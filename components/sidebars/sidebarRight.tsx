"use client";

import React, { useState, useEffect } from "react";
import "@/app/globals.css";
import Toast from "../toast/toast";
import gsap from "gsap";

const SidebarLeft: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gmail-btn",
        { y: -100, opacity: 0, scale: 0.5 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("subeshgaming@gmail.com");
    showToast("Email copied to clipboard!");
  };

  return (
    <>
      <div className="fixed top-0 left-0 hidden md:flex h-screen w-[50px] flex-col items-center justify-center">
        <button
          type="button"
          onClick={handleCopyEmail}
          className="rotate-90 cursor-copy mono text-xs tracking-widest text-muted hover:text-green transition-colors gmail-btn whitespace-nowrap bg-transparent border-none p-0"
          aria-label="Copy email to clipboard"
        >
          subeshgaming@gmail.com
        </button>
        <div className="mt-6 h-[80px] w-px" style={{ backgroundColor: "var(--border)" }} />
      </div>

      {toastVisible && <Toast message={`${toastMessage}`} visible={true} onClose={() => {}} />}
    </>
  );
};

export default SidebarLeft;
