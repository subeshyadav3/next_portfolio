"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full hover:bg-[var(--blog-surface)] transition-colors"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 text-[var(--blog-text-secondary)]" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-[var(--blog-surface)] transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-[var(--blog-text-secondary)]" />
      ) : (
        <Moon className="h-5 w-5 text-[var(--blog-text-secondary)]" />
      )}
    </button>
  );
}
