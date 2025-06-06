"use client";

import React, { useState, useEffect } from "react";
import "../../globals.css";
import Toast from "../toast/toast";

const SidebarLeft: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVisible, setToastVisible] = useState(false);

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
      <div className="fixed top-1/2 left-0 hidden sm:flex h-screen w-[50px] flex-col items-center pb-6">
        <a
          onClick={handleCopyEmail}
          className="rotate-90 cursor-copy text-sm tracking-widest hover:text-gray-300 gmail-btn"
        >
          subeshgaming@gmail.com
        </a>
      </div>

      {toastVisible && <Toast message={`${toastMessage}`} visible={true} onClose={() => { }} />}
    </>
  );
};

export default SidebarLeft;
