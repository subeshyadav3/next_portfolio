"use client";

import { useEffect } from "react";

export default function PostViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;
    const key = `post-viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable — still count once via beacon
    }

    if (navigator.sendBeacon) {
      navigator.sendBeacon(`/api/posts/${encodeURIComponent(slug)}/view`, "1");
    } else {
      fetch(`/api/posts/${encodeURIComponent(slug)}/view`, {
        method: "POST",
        keepalive: true,
      }).catch(() => {});
    }
  }, [slug]);

  return null;
}
