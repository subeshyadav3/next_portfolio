"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BsCopy } from "react-icons/bs";
import "../../globals.css";
import ScrollText from "../animation/ScrollText";
import Toast from "../toast/toast"; 

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLDivElement | HTMLButtonElement)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: -50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      inputRefs.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 100%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = () => {
    const newErrors = { name: "", email: "", message: "" };
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to send message");
          showToast("✅ Message sent successfully!");
          return res.json();
        })
        .catch((err) => {
          console.error("Error sending message:", err);
          showToast("❌ Failed to submit message. Please try again later.");
        });

      setFormData({ name: "", email: "", message: "" });
      setErrors({ name: "", email: "", message: "" });
    }
  };

  const handleEmail = () => {
    navigator.clipboard.writeText("subeshgaming@gmail.com");
    showToast("📋 Email copied to clipboard!");
  };

  const inputClass = `
    transition-all duration-300 bg-[#1d2136] text-white rounded-md px-4 py-3 mb-3
    border-2 border-[#1d2136]
    hover:border-transparent
    hover:bg-gradient-to-r hover:from-[#1d2136] hover:to-[#29305a]
    hover:shadow-2xl hover:scale-105 hover:shadow-[#29305a]
    focus:outline-none focus:ring-2 focus:ring-[#546397]
  `;

  return (
    <div
      ref={containerRef}
      id="contact"
      className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-0"
    >
      <h2 ref={titleRef} className="text-4xl font-semibold mb-6 text-[#90A0D9]">
        Get In Touch
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-md mx-auto">
        <div ref={(el) => { inputRefs.current[0] = el! }} className="flex flex-col">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className={inputClass}
            autoComplete="off"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>

        <div ref={(el) => { inputRefs.current[1] = el! }} className="flex flex-col">
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className={inputClass}
            autoComplete="off"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div ref={(el) => { inputRefs.current[2] = el! }} className="flex flex-col sm:col-span-2">
          <textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            className={`${inputClass} resize-none`}
          />
          {errors.message && <span className="text-red-500 text-sm">{errors.message}</span>}
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-6">
        <button
          ref={(el) => { inputRefs.current[3] = el! }} className="group border-2 border-[#546397] w-[90px] mr-2 px-4 py-2 rounded-sm resume-btn"
          onClick={handleSubmit}
        >
          <span className="relative z-10 group-hover:text-blue-950">Submit</span>
        </button>

        <ScrollText text="or" duration={1} yOffset={50} delay={0.1} animateOnMount={true} />

        <button
          ref={(el) => { inputRefs.current[4] = el! }}
          className="group flex gap-2 cursor-copy border-2 border-[#546397] w-[110px] mr-2 px-4 py-2 rounded-sm resume-btn"
          onClick={handleEmail}
        >
          <span className="relative z-10 group-hover:text-blue-950">Email</span>
          <BsCopy className="z-10 ml-1 mt-0.5 group-hover:text-[#0D1232]" />
        </button>
      </div>

    
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}
