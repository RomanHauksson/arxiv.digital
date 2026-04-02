"use client";

import { useState, type ReactNode } from "react";
import {
  GenerationProgress,
  type GenerationStatus,
} from "./generation-progress";

interface PaperSwitcherProps {
  id: string;
  arxivHtmlBase: string;
  /** If set, the custom version is already available (cache hit). */
  customSlot?: ReactNode;
}

/**
 * Manages the view toggle between the arXiv original and the
 * AI-generated custom version.
 *
 * - Cache hit  → `customSlot` is provided; shows custom version directly.
 * - Cache miss → connects to the SSE progress endpoint, streams status
 *                messages in the header bar, and offers a "Switch" button
 *                once generation is complete (which triggers router.refresh).
 */
export function PaperSwitcher({
  id,
  arxivHtmlBase,
  customSlot,
}: PaperSwitcherProps) {
  const hasCachedVersion = customSlot != null;
  const [showCustom, setShowCustom] = useState(hasCachedVersion);

  // Cache hit — render with a simple toggle, no generation progress
  if (hasCachedVersion) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header>
          {showCustom ? (
            <>
              <p className="text-sm text-muted-foreground">Custom version</p>
              <button
                type="button"
                onClick={() => setShowCustom(false)}
                className="ml-auto px-3 py-1.5 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Switch to arXiv original
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">arXiv original</p>
              <button
                type="button"
                onClick={() => setShowCustom(true)}
                className="ml-auto px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Switch to custom version
              </button>
            </>
          )}
        </Header>

        <ArxivIframe id={id} arxivHtmlBase={arxivHtmlBase} hidden={showCustom} />
        <div className={`flex-1 ${showCustom ? "" : "hidden"}`}>
          {customSlot}
        </div>
      </div>
    );
  }

  // Cache miss — stream generation progress
  return (
    <GenerationProgress id={id}>
      {({ status, message, switchToCustom }) => (
        <div className="flex flex-col min-h-screen">
          <Header>
            <GeneratingHeader
              status={status}
              message={message}
              onSwitch={switchToCustom}
            />
          </Header>

          <ArxivIframe id={id} arxivHtmlBase={arxivHtmlBase} hidden={false} />
        </div>
      )}
    </GenerationProgress>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Header({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background">
      {children}
    </div>
  );
}

function GeneratingHeader({
  status,
  message,
  onSwitch,
}: {
  status: GenerationStatus;
  message: string;
  onSwitch: () => void;
}) {
  if (status === "done") {
    return (
      <>
        <p className="text-sm text-muted-foreground">Custom version ready.</p>
        <button
          type="button"
          onClick={onSwitch}
          className="ml-auto px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Switch to custom version
        </button>
      </>
    );
  }

  if (status === "error") {
    return (
      <p className="text-sm text-destructive">
        Generation failed — {message}
      </p>
    );
  }

  // status === "generating"
  return (
    <>
      <div
        className="size-5 shrink-0 animate-spin rounded-full border-2 border-border border-t-primary"
        aria-hidden
      />
      <div className="flex items-baseline gap-2 min-w-0">
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          Generating custom version…
        </p>
        <p className="text-xs text-muted-foreground/60 truncate">{message}</p>
      </div>
    </>
  );
}

function ArxivIframe({
  id,
  arxivHtmlBase,
  hidden,
}: {
  id: string;
  arxivHtmlBase: string;
  hidden: boolean;
}) {
  return (
    <div
      className={`flex flex-col flex-1 min-h-0 ${hidden ? "hidden" : ""}`}
    >
      <p className="px-4 py-2 text-xs text-muted-foreground">
        Some papers may not have an HTML version.{" "}
        <a
          href={`https://arxiv.org/pdf/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          View PDF
        </a>
      </p>
      <iframe
        title={`arXiv HTML paper ${id}`}
        src={`${arxivHtmlBase}/${id}`}
        className="flex-1 w-full min-h-0 border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
