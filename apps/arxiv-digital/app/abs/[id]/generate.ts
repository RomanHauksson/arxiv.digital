import { Sandbox } from "@e2b/code-interpreter";
import { createOpencodeClient } from "@opencode-ai/sdk/client";
import type { Event } from "@opencode-ai/sdk";
import { getMdx, savePaper } from "./storage";

export type ProgressCallback = (message: string) => void;

const OPENCODE_PORT = 4096;
const THREE_MINUTES_MS = 3 * 60 * 1000;

/**
 * Generate a paper website from arXiv LaTeX source.
 *
 * Runs the OpenCode agent inside an E2B sandbox via its HTTP server,
 * subscribing to the structured SSE event stream for real-time progress.
 */
export async function generatePaper(
  id: string,
  onProgress: ProgressCallback = () => {},
): Promise<string> {
  // Check cache first
  const cached = await getMdx(id);
  if (cached) return cached;

  onProgress("Creating sandbox…");

  const sandbox = await Sandbox.create("template-tag-dev", {
    envs: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY! },
    timeoutMs: THREE_MINUTES_MS,
  });

  try {
    // Download LaTeX source
    onProgress("Downloading LaTeX source…");
    await sandbox.commands.run(
      `curl -L -o /tmp/latex.tar.gz https://arxiv.org/src/${id} && mkdir -p /home/user/latex && tar xzf /tmp/latex.tar.gz -C /home/user/latex`,
    );

    // Start the OpenCode server in the background
    onProgress("Starting OpenCode server…");
    sandbox.commands.run(
      `opencode serve --hostname 0.0.0.0 --port ${OPENCODE_PORT}`,
      { background: true },
    );

    const host = sandbox.getHost(OPENCODE_PORT);
    const baseUrl = `https://${host}`;

    // Wait for the server to be ready
    await waitForHealth(baseUrl);
    onProgress("OpenCode server ready");

    // Connect the SDK client
    const client = createOpencodeClient({ baseUrl });

    // Subscribe to SSE event stream
    const { stream } = await client.event.subscribe();

    // Create a session
    const { data: session } = await client.session.create({
      body: { title: `Paper ${id}` },
    });
    if (!session) throw new Error("Failed to create OpenCode session");

    // Send the prompt asynchronously (fire-and-forget)
    await client.session.promptAsync({
      path: { id: session.id },
      body: {
        parts: [
          {
            type: "text",
            text: `Starting from the ~/template/ repository, create a website for the paper whose LaTeX source is in ~/latex/. Just try making a first draft, do not spend more than 1 minute on this.`,
          },
        ],
      },
    });

    onProgress("AI agent is working…");

    // Listen for events until the session goes idle
    for await (const event of stream) {
      handleEvent(event, session.id, onProgress);

      if (
        event.type === "session.idle" &&
        event.properties.sessionID === session.id
      ) {
        break;
      }
    }

    // Read the generated MDX
    onProgress("Reading generated page…");
    const file = await sandbox.commands.run(
      `cat /home/user/template/app/page.mdx`,
    );
    const mdx = file.stdout;

    // Persist to storage
    onProgress("Saving to storage…");
    await savePaper(id, mdx);

    return mdx;
  } finally {
    sandbox.kill();
  }
}

// ---------------------------------------------------------------------------
// Event handling — extract user-friendly progress messages
// ---------------------------------------------------------------------------

function handleEvent(
  event: Event,
  sessionId: string,
  onProgress: ProgressCallback,
): void {
  if (event.type === "message.part.updated") {
    const { part } = event.properties;

    // Tool events have the richest status info
    if (part.type === "tool") {
      const { state } = part;

      if (state.status === "running" && state.title) {
        onProgress(state.title);
      } else if (state.status === "completed" && state.title) {
        onProgress(state.title);
      } else if (state.status === "error") {
        onProgress(`Tool error: ${state.error}`);
      }
    }
  }

  if (event.type === "session.error") {
    const err = event.properties.error;
    if (err) {
      onProgress(`Error: ${err.name}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Health check polling
// ---------------------------------------------------------------------------

async function waitForHealth(
  baseUrl: string,
  timeoutMs = 30_000,
  intervalMs = 500,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/global/health`);
      if (res.ok) return;
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error(`OpenCode server did not become healthy within ${timeoutMs}ms`);
}

// ---------------------------------------------------------------------------
// In-flight generation deduplication
// ---------------------------------------------------------------------------

interface InFlightEntry {
  promise: Promise<string>;
  listeners: Set<ProgressCallback>;
}

const inFlight = new Map<string, InFlightEntry>();

/**
 * Generate a paper, deduplicating concurrent requests for the same ID.
 *
 * Every caller's `onProgress` callback receives all progress messages.
 */
export function generatePaperDeduped(
  id: string,
  onProgress: ProgressCallback = () => {},
): Promise<string> {
  const existing = inFlight.get(id);

  if (existing) {
    existing.listeners.add(onProgress);
    return existing.promise.finally(() => {
      existing.listeners.delete(onProgress);
    });
  }

  const listeners = new Set<ProgressCallback>([onProgress]);

  const broadcast: ProgressCallback = (msg) => {
    for (const listener of listeners) {
      try {
        listener(msg);
      } catch {
        // Don't let one broken listener kill the generation
      }
    }
  };

  const promise = generatePaper(id, broadcast).finally(() => {
    inFlight.delete(id);
  });

  inFlight.set(id, { promise, listeners });

  return promise;
}
