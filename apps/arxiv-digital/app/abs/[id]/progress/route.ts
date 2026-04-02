import { getMdx } from "../storage";
import { generatePaperDeduped } from "../generate";

export const dynamic = "force-dynamic";

/**
 * SSE endpoint that streams generation progress for a paper.
 *
 * Event types:
 *   - `progress` : { message: string }  — agent status update
 *   - `done`     : {}                   — generation complete, client can refresh
 *   - `error`    : { message: string }  — generation failed
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // If already cached, signal done immediately
  const cached = await getMdx(id);
  if (cached) {
    return sseResponse((send) => {
      send("done", {});
    });
  }

  // Stream progress from generation
  return sseResponse((send, close) => {
    generatePaperDeduped(id, (message) => {
      send("progress", { message });
    })
      .then(() => {
        send("done", {});
        close();
      })
      .catch((err) => {
        send("error", { message: String(err) });
        close();
      });
  });
}

// ---------------------------------------------------------------------------
// SSE helpers
// ---------------------------------------------------------------------------

type SendFn = (event: string, data: Record<string, unknown>) => void;
type CloseFn = () => void;

/**
 * Create an SSE `Response` with a `ReadableStream`.
 *
 * The `setup` callback receives `send` (to push events) and `close`
 * (to end the stream). `setup` may be async — errors are caught and
 * forwarded as an `error` event.
 */
function sseResponse(
  setup: (send: SendFn, close: CloseFn) => void | Promise<void>,
): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send: SendFn = (event, data) => {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
          );
        } catch {
          // Stream may already be closed
        }
      };

      const close: CloseFn = () => {
        try {
          controller.close();
        } catch {
          // Already closed
        }
      };

      try {
        const result = setup(send, close);
        if (result instanceof Promise) {
          result.catch((err) => {
            send("error", { message: String(err) });
            close();
          });
        }
      } catch (err) {
        send("error", { message: String(err) });
        close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
