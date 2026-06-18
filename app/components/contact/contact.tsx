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

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (message: string) => setToast({ message, visible: true });
  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", scrollTrigger: { trigger: titleRef.current, start: "top 80%", toggleActions: "play none none reverse" } }
        );
      }
      inputRefs.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, delay: index * 0.15, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play reverse play reverse" } }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = () => {
    const newErrors = { name: "", email: "", message: "" };
    let valid = true;
    if (!formData.name.trim()) { newErrors.name = "Name is required."; valid = false; }
    if (!formData.email.trim()) { newErrors.email = "Email is required."; valid = false; } else if (!validateEmail(formData.email)) { newErrors.email = "Invalid email format."; valid = false; }
    if (!formData.message.trim()) { newErrors.message = "Message is required."; valid = false; }
    setErrors(newErrors);
    if (valid) {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => { if (!res.ok) throw new Error("Failed"); showToast("✅ Message sent successfully!"); return res.json(); })
        .catch(() => showToast("❌ Failed to submit message. Please try again later."));
      setFormData({ name: "", email: "", message: "" });
      setErrors({ name: "", email: "", message: "" });
    }
  };

  const handleEmail = () => {
    navigator.clipboard.writeText("subeshgaming@gmail.com");
    showToast("📋 Email copied to clipboard!");
  };

  const inputBase = "w-full text-primary text-sm px-4 py-3 focus:outline-none transition-all duration-200";
  const inputBorder = { backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", fontFamily: "'Inter', sans-serif" };

  return (
    <section id="contact" ref={containerRef} className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-0 py-24">
      <p className="mono text-xs text-orange uppercase tracking-widest mb-4">06 / contact</p>
      <h2 ref={titleRef} className="text-[28px] font-semibold text-primary mb-8">Get In Touch</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mx-auto">
        <div ref={(el) => { inputRefs.current[0] = el! }} className="flex flex-col">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className={inputBase}
            style={inputBorder}
            autoComplete="off"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-surface)"; e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "rgba(61,214,140,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-elevated)"; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-green)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
          {errors.name && <span className="text-red-400 text-xs mt-1 mono">{errors.name}</span>}
        </div>

        <div ref={(el) => { inputRefs.current[1] = el! }} className="flex flex-col">
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className={inputBase}
            style={inputBorder}
            autoComplete="off"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-surface)"; e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "rgba(61,214,140,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-elevated)"; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-green)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
          {errors.email && <span className="text-red-400 text-xs mt-1 mono">{errors.email}</span>}
        </div>

        <div ref={(el) => { inputRefs.current[2] = el! }} className="flex flex-col sm:col-span-2">
          <textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            className={`${inputBase} resize-none`}
            style={inputBorder}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-surface)"; e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "rgba(61,214,140,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-elevated)"; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-green)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
          {errors.message && <span className="text-red-400 text-xs mt-1 mono">{errors.message}</span>}
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-6">
        <button
          ref={(el) => { inputRefs.current[3] = el! }}
          onClick={handleSubmit}
          className="relative overflow-hidden mono text-xs uppercase tracking-wider px-6 py-3 resume-btn"
          style={{ border: "1px solid var(--accent-green)", color: "var(--accent-green)", backgroundColor: "transparent" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-green)"; e.currentTarget.style.color = "var(--bg-base)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--accent-green)"; }}
        >
          <span className="relative z-10">Submit</span>
        </button>

        <ScrollText text="or" duration={1} yOffset={30} delay={0.1} animateOnMount={true} />

        <button
          ref={(el) => { inputRefs.current[4] = el! }}
          onClick={handleEmail}
          className="relative overflow-hidden flex items-center gap-2 mono text-xs uppercase tracking-wider px-6 py-3 resume-btn"
          style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", backgroundColor: "transparent" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-green)"; e.currentTarget.style.color = "var(--accent-green)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <span className="relative z-10">Email</span>
          <BsCopy className="relative z-10 h-3 w-3" />
        </button>
      </div>

      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </section>
  );
}