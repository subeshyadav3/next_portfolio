"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const RESERVED_BLOG_SEGMENTS = new Set([
  "category",
  "tag",
  "archive",
  "rss.xml",
  "privacy",
  "terms",
  "disclaimer",
  "author",
  "about",
  "contact",
  "search",
]);

export function SiteViewTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Do not track admin CMS visits or internal API routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    // Prevent double firing in React StrictMode for the exact same path
    if (lastTracked.current === pathname) return;

    // Deduplicate within the current session for this path
    const sessionKey = `pv:${pathname}`;
    try {
      if (sessionStorage.getItem(sessionKey)) {
        lastTracked.current = pathname;
        return;
      }
      sessionStorage.setItem(sessionKey, "1");
    } catch {
      // Ignore sessionStorage exceptions (private browsing / disabled)
    }

    lastTracked.current = pathname;

    // Check if this path corresponds to a specific blog post
    let slug: string | null = null;
    if (pathname.startsWith("/blog/")) {
      const segments = pathname.replace(/^\/blog\//, "").split("/");
      const candidate = segments[0];
      if (candidate && !RESERVED_BLOG_SEGMENTS.has(candidate)) {
        slug = candidate;
      }
    }

    const payload = JSON.stringify({ path: pathname, slug });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/views", blob);
    } else {
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
