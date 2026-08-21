"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "cookie-consent";

type Consent = "accepted" | "declined" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(CONSENT_KEY) as Consent;
    setConsent(stored);
    // Show banner only if user has never made a choice
    setVisible(!stored);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setConsent("declined");
    setVisible(false);
  }

  // Avoid hydration mismatch - don't render until mounted
  if (!mounted) return null;

  if (!visible) {
    if (!consent) return null;
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        className="fixed bottom-3 left-3 z-[100] rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Privacy choices
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row">
        <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">
          This site uses Google Analytics (anonymized) to understand traffic. Advertising cookies may also be used after AdSense is enabled. Read the{" "}
          <Link href="/blog/privacy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={decline}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
