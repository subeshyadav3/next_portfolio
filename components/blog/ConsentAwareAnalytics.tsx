"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie-consent";
const CONSENT_EVENT = "cookie-consent-updated";

export function ConsentAwareAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => setEnabled(localStorage.getItem(CONSENT_KEY) === "accepted");
    update();
    window.addEventListener(CONSENT_EVENT, update);
    return () => window.removeEventListener(CONSENT_EVENT, update);
  }, []);

  return enabled ? <GoogleAnalytics gaId="G-6HZ0GV26W3" /> : null;
}
