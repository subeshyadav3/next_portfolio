"use client";

import { useState, useEffect } from "react";

interface ReadingProgressProps {
  color?: string;
}

export function ReadingProgress({ color }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, value)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[3px] transition-[width] duration-150 ease-out"
      style={{
        width: `${progress}%`,
        backgroundColor: color || "var(--blog-accent)",
      }}
      aria-hidden="true"
    />
  );
}
