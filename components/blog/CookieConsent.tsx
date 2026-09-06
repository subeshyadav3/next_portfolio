"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const CONSENT_KEY = "cookie-consent";
const CONSENT_EVENT = "cookie-consent-updated";

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

    const handleOpen = () => setVisible(true);
    window.addEventListener("open-privacy-choices", handleOpen);
    return () => window.removeEventListener("open-privacy-choices", handleOpen);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setConsent("accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setConsent("declined");
    setVisible(false);
  }

  function dismiss() {
    setVisible(false);
  }

  // Avoid hydration mismatch
  if (!mounted || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-200 bg-white/95 backdrop-blur-md p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="flex-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          This site uses anonymized analytics to measure traffic and improve content. Learn more in our{" "}
          <Link href="/blog/privacy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Privacy Policy
          </Link>
          . You can adjust your preferences anytime via Privacy Choices in the footer.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Dismiss cookie notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
