"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Mobile-only behavior:
 *  - The button only appears when the user is scrolling UP (deltaY < -5px)
 *    after they've already read past ~300px.
 *  - It hides immediately when the user starts scrolling DOWN.
 *  - After scrolling stops, it auto-hides after a short delay.
 *
 * Desktop behavior (unchanged from the original):
 *  - Visible once scrollY > 400, stays visible.
 */
const MOBILE_SHOW_AFTER = 300;     // px — minimum scroll depth required
const MOBILE_UP_THRESHOLD = -5;    // px — must scroll up by at least this much to reveal
const MOBILE_HIDE_AFTER_MS = 1200; // ms — auto-hide after the user stops scrolling up
const DESKTOP_SHOW_AFTER = 400;    // px — original desktop threshold

export function BackToTop() {
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);
  const lastYRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);

  // Detect mobile viewport
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    // Safari < 14 fallback
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastYRef.current;
      lastYRef.current = currentY;

      if (!isMobile) {
        // Desktop: simple threshold, stays visible
        setVisible(currentY > DESKTOP_SHOW_AFTER);
        return;
      }

      // Mobile: only show when user scrolls UP by at least 5px
      if (currentY < MOBILE_SHOW_AFTER) {
        setVisible(false);
        clearHideTimer();
        return;
      }

      if (delta <= MOBILE_UP_THRESHOLD) {
        // Scrolling up — reveal the button
        clearHideTimer();
        setVisible(true);
        // Auto-hide after the user stops scrolling
        hideTimerRef.current = window.setTimeout(() => {
          setVisible(false);
          hideTimerRef.current = null;
        }, MOBILE_HIDE_AFTER_MS);
      } else if (delta > 0) {
        // Scrolling down — hide immediately
        setVisible(false);
        clearHideTimer();
      }
      // If delta === 0 (perfectly still), keep current state until the timer fires
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearHideTimer();
    };
  }, [isMobile]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-5 right-4 z-50 flex h-9 w-9 md:bottom-8 md:right-8 md:h-12 md:w-12 items-center justify-center rounded-full bg-[var(--blog-accent)] text-white shadow-lg hover:opacity-90 active:scale-95 transition-[transform,opacity] duration-200"
    >
      <ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
    </button>
  );
}
