
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type ToastProps = {
  message: string;
  visible: boolean;
  onClose: () => void;
};

export default function Toast({ message, visible, onClose }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && toastRef.current) {
      gsap.fromTo(
        toastRef.current,
        { y: 50, opacity: 0, display: "none" },
        {
          y: 0,
          opacity: 1,
          display: "flex",
          duration: 0.4,
          ease: "power3.out",
        }
      );

      const timeout = setTimeout(() => {
        gsap.to(toastRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
          onComplete: onClose,
        });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [visible, onClose]);

  return (
    <div
      ref={toastRef}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-[#1d2136] to-[#29305a] text-white rounded-xl shadow-xl text-sm sm:text-base z-50 hidden"
    >
      {message}
    </div>
  );
}
