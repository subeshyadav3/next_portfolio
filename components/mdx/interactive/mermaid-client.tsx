"use client";

import { useEffect, useId, useRef, useState } from "react";

interface MermaidClientProps {
  chart: string;
}

/**
 * Renders a Mermaid diagram. Mermaid is heavy (~700KB gzipped), so we load
 * it only when this component mounts, on the client side.
 */
export function MermaidClient({ chart }: MermaidClientProps) {
  const id = useId().replace(/:/g, "_");
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" });
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled) setSvg(svg);
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-6 rounded border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800">
        Diagram error: {error}
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-[var(--blog-border)] bg-[var(--blog-surface)] p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
