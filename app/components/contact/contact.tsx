"use client";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BsCopy } from "react-icons/bs";
import { Send, Mail, Sparkles } from "lucide-react";
import Toast from "../toast/toast";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [toast, setToast] = useState({ message: "", visible: false });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const showToast = (message: string) => setToast({ message, visible: true });
  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: -40, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: titleRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
      }
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: formRef.current, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      }
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
    if (!formData.email.trim()) { newErrors.email = "Email is required."; valid = false; }
    else if (!validateEmail(formData.email)) { newErrors.email = "Invalid email format."; valid = false; }
    if (!formData.message.trim()) { newErrors.message = "Message is required."; valid = false; }
    setErrors(newErrors);
    if (valid) {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed");
          showToast(" Message sent successfully!");
          return res.json();
        })
        .catch(() => showToast(" Failed to submit message. Please try again later."));
      setFormData({ name: "", email: "", message: "" });
      setErrors({ name: "", email: "", message: "" });
    }
  };

  const handleEmail = () => {
    navigator.clipboard.writeText("subeshgaming@gmail.com");
    showToast(" Email copied to clipboard!");
  };

  const inputStyle = (field: string) => ({
    backgroundColor: "rgba(13, 17, 23, 0.6)",
    border: `1px solid ${focusedField === field ? "rgba(61,214,140,0.3)" : "var(--border)"}`,
    fontFamily: "'Inter', sans-serif",
    transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: focusedField === field ? "0 0 20px rgba(61, 214, 140, 0.1)" : "none",
  });

  return (
    <section id="contact" ref={containerRef} className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-0 py-24 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green opacity-[0.02] rounded-full blur-[150px]" />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <p className="mono text-xs text-orange uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <Sparkles size={14} />
            06 / contact
          </p>
          <h2 ref={titleRef} className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
            Get In Touch
          </h2>
          <p className="text-secondary text-sm">Let&apos;s build something amazing together</p>
        </div>

        <div ref={formRef} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Your Name"
                className="w-full text-primary text-sm px-4 py-3 focus:outline-none contact-input rounded-none"
                style={inputStyle("name")}
                autoComplete="off"
              />
              {errors.name && <span className="text-red-400 text-xs mt-1 mono">{errors.name}</span>}
            </div>

            <div className="flex flex-col">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="Your Email"
                className="w-full text-primary text-sm px-4 py-3 focus:outline-none contact-input rounded-none"
                style={inputStyle("email")}
                autoComplete="off"
              />
              {errors.email && <span className="text-red-400 text-xs mt-1 mono">{errors.email}</span>}
            </div>
          </div>

          <div className="flex flex-col">
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              placeholder="Your Message"
              rows={5}
              className="w-full text-primary text-sm px-4 py-3 focus:outline-none contact-input resize-none rounded-none"
              style={inputStyle("message")}
            />
            {errors.message && <span className="text-red-400 text-xs mt-1 mono">{errors.message}</span>}
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 mt-8 flex-wrap gap-y-3">
          <button
            onClick={handleSubmit}
            className="btn-glow mono text-xs uppercase tracking-wider px-8 py-3 inline-flex items-center gap-2 transition-all duration-300"
            style={{
              border: "1px solid var(--accent-green)",
              color: "var(--accent-green)",
              backgroundColor: "transparent",
              fontWeight: 500,
            }}
          >
            <Send size={14} />
            Submit
          </button>

          <span className="mono text-xs text-muted">or</span>

          <button
            onClick={handleEmail}
            className="flex items-center gap-2 mono text-xs uppercase tracking-wider px-6 py-3 transition-all duration-300 neon-hover"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", backgroundColor: "transparent" }}
          >
            <Mail size={14} />
            Email
            <BsCopy className="h-3 w-3" />
          </button>
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </section>
  );
}
