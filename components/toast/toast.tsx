"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type ToastProps = {
  message: string;
  visible: boolean;
  onClose: () => void;
};

export default function Toast({ message, visible, onClose }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    const bar = barRef.current;
    if (!el || !bar) return;

    if (visible) {
      // Make sure it's mounted/visible before animating in
      el.style.opacity = "0";
      el.style.transform = "translate3d(0, 80px, 0)";

      gsap.to(el, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(bar, { scaleX: 1 }, { scaleX: 0, duration: 3, ease: "linear" });

      timerRef.current = window.setTimeout(() => {
        gsap.to(el, {
          y: 80,
          opacity: 0,
          duration: 0.3,
          ease: "power3.in",
          onComplete: onClose,
        });
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible, onClose]);

  // Always render the element so the exit animation can play; toggle visibility
  if (!visible && !ref.current) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className="toast fixed bottom-6 right-6 z-[1000] mono text-xs"
      style={{
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--accent-green)",
        color: "var(--text-primary)",
        padding: "12px 16px",
        minWidth: "240px",
        maxWidth: "360px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        opacity: visible ? undefined : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <span>{message}</span>
      <div
        ref={barRef}
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 2,
          width: "100%",
          backgroundColor: "var(--accent-green)",
          transformOrigin: "left",
          transform: "scaleX(1)",
        }}
      />
    </div>
  );
}
