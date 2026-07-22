"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pathname.startsWith("/blog")) return;
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, [pathname]);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-[var(--blog-border)] bg-[var(--blog-surface)] p-4 shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row">
        <p className="flex-1 text-sm text-[var(--blog-text-secondary)]">
          This site uses cookies for analytics and personalized ads. By continuing, you agree to our{" "}
          <Link href="/blog/privacy" className="text-[var(--blog-accent)] hover:underline">Privacy Policy</Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={decline}
            className="rounded-lg border border-[var(--blog-border)] px-4 py-2 text-sm font-medium text-[var(--blog-text-secondary)] hover:bg-[var(--blog-bg)]"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-[var(--blog-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
