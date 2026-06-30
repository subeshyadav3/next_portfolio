"use client";

import { useEffect, useState } from "react";

interface GiscusCommentsProps {
  slug: string;
}

export function GiscusComments({ slug }: GiscusCommentsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "subeshyadav3/next_portfolio");
    script.setAttribute("data-repo-id", "R_kgDOJ12345"); // Placeholder - update with real repo ID
    script.setAttribute("data-category", "Blog Comments");
    script.setAttribute("data-category-id", "DIC_kwDOJ12345"); // Placeholder
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "en");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    const container = document.getElementById(`giscus-${slug}`);
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
  }, [mounted, slug]);

  return (
    <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6">
      <h3 className="text-lg font-semibold text-[var(--blog-text)] mb-4">
        Comments
      </h3>
      <div id={`giscus-${slug}`} />
    </div>
  );
}
