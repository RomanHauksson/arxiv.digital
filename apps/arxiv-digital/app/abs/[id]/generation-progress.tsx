"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type GenerationStatus = "generating" | "done" | "error";

interface GenerationProgressProps {
  id: string;
  children: (state: {
    status: GenerationStatus;
    message: string;
    switchToCustom: () => void;
  }) => React.ReactNode;
}

/**
 * Connects to the SSE progress endpoint for a paper and provides
 * streaming status updates to its render-prop children.
 *
 * When generation completes (`done` event), the user can trigger
 * `switchToCustom` which calls `router.refresh()` to re-render
 * the server component tree (picking up the now-cached MDX).
 */
export function GenerationProgress({ id, children }: GenerationProgressProps) {
  const [status, setStatus] = useState<GenerationStatus>("generating");
  const [message, setMessage] = useState("Connecting…");
  const router = useRouter();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(`/abs/${id}/progress`);
    eventSourceRef.current = es;

    es.addEventListener("progress", (e) => {
      const data = JSON.parse(e.data) as { message: string };
      setMessage(data.message);
    });

    es.addEventListener("done", () => {
      setStatus("done");
      setMessage("Custom version ready");
      es.close();
    });

    es.addEventListener("error", (e) => {
      // EventSource fires generic error events on connection issues,
      // but our server also sends typed error events with data.
      if (e instanceof MessageEvent) {
        const data = JSON.parse(e.data) as { message: string };
        setMessage(data.message);
      }
      setStatus("error");
      es.close();
    });

    return () => {
      es.close();
    };
  }, [id]);

  const switchToCustom = () => {
    router.refresh();
  };

  return <>{children({ status, message, switchToCustom })}</>;
}
