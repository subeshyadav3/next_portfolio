"use client";

import { useState, useEffect } from "react";
import useInViewAnimation from "@/app/hooks/useInViewAnimation";
import "../../globals.css";

export default function ContactPage() {
  const [isMobile, setIsMobile] = useState(false);
  const isInView = useInViewAnimation(0.8, "contact");

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
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
      alert("Message submitted successfully!");
      setFormData({ name: "", email: "", message: "" });
      setErrors({ name: "", email: "", message: "" });
    }
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
      id="contact"
      className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-0"
   
    >
      <h2
        className={`text-4xl font-semibold mb-6 text-[#90A0D9] opacity-0 ${
          isInView ? "hero-anim-title opacity-100" : ""
        }`}
      >
        Get In Touch
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-md mx-auto">
        <div className="flex flex-col">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className={`${inputClass} ${isInView ? "hero-anim-title delay-400 opacity-100" : "opacity-0"}`}
            autoComplete="off"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>

        <div className="flex flex-col">
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className={`${inputClass} ${isInView ? "hero-anim-title delay-400 opacity-100" : "opacity-0"}`}
            autoComplete="off"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div className="flex flex-col sm:col-span-2">
          <textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            className={`${inputClass} resize-none ${isInView ? "hero-anim-title delay-400 opacity-100" : "opacity-0"}`}
          />
          {errors.message && <span className="text-red-500 text-sm">{errors.message}</span>}
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-6">
        <button
          className={`opacity-0 ${isInView ? "hero-anim-title delay-600 opacity-100" : ""} 
            border-2 border-[#546397] w-[90px] mr-2 px-4 py-2 rounded-sm resume-btn`}
          onClick={handleSubmit}
        >
          <span className="relative z-10 hover:text-blue-950">Submit</span>
        </button>

        <span className="font-light py-2">or</span>

        <button
          className={`opacity-0 ${isInView ? "hero-anim-title delay-600 opacity-100" : ""} 
            border-2 border-[#546397] w-[90px] mr-2 px-4 py-2 rounded-sm resume-btn`}
          onClick={() => (window.location.href = "mailto:subeshgaming@gmail.com")}
        >
          <span className="relative z-10 hover:text-blue-950">Email</span>
        </button>
      </div>
    </div>
  );
}
