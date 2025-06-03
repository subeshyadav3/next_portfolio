"use client";
import { useState, useEffect } from "react";
import useInViewAnimation from "@/app/hooks/useInViewAnimation";
import "../../globals.css";

export default function ContactPage() {
    const [isMobile, setIsMobile] = useState(false);
    const isInView = useInViewAnimation(0.8, "contact");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({ name: "", email: "", message: "" });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 800);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = () => {
        let valid = true;
        const newErrors = { name: "", email: "", message: "" };

        if (!name.trim()) {
            newErrors.name = "Name is required.";
            valid = false;
        }
        if (!email.trim()) {
            newErrors.email = "Email is required.";
            valid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = "Invalid email format.";
            valid = false;
        }
        if (!message.trim()) {
            newErrors.message = "Message is required.";
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            alert("Message submitted successfully!");
            setName("");
            setEmail("");
            setMessage("");
            setErrors({ name: "", email: "", message: "" });
        }
    };

    return (
        <div id='contact' className="min-h-screen flex justify-center items-center flex-col pl-2 sm:pl-0">
            <h2 className={`text-4xl font-semibold mx-auto mb-4 text-[#90A0D9] opacity-0 ${isInView ? "hero-anim-title opacity-100" : ""}`}>
                Get In Touch
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 my-5 mx-auto w-full sm:w-[500px]">
                <div className="flex flex-col">
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`transition-all duration-300 bg-transparent text-white 
                        border-2 border-[#1d2136] px-2 py-3 mb-1 sm:mr-2 
                        hover:border-transparent 
                        hover:bg-gradient-to-r hover:from-[#1d2136] hover:to-[#29305a] 
                        hover:shadow-2xl hover:scale-105 hover:shadow-[#29305a] 
                        ${isInView ? "hero-anim-title delay-400 opacity-100" : "opacity-0"}`}
                        placeholder="Your Name"
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                </div>

                <div className="flex flex-col">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`transition-all duration-300 bg-transparent text-white 
                        border-2 border-[#1d2136] px-2 py-3 mb-1 
                        hover:border-transparent 
                        hover:bg-gradient-to-r hover:from-[#1d2136] hover:to-[#29305a] 
                        hover:shadow-2xl hover:scale-105 hover:shadow-[#29305a] 
                        ${isInView ? "hero-anim-title delay-400 opacity-100" : "opacity-0"}`}
                        placeholder="Your Email"
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                <div className="flex flex-col sm:col-span-2">
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={`transition-all duration-300 bg-transparent text-white 
                        border-2 border-[#1d2136] px-2 py-3 mb-1 
                        hover:border-transparent 
                        hover:bg-gradient-to-r hover:from-[#1d2136] hover:to-[#29305a] 
                        hover:shadow-2xl hover:scale-105 hover:shadow-[#29305a] 
                        ${isInView ? "hero-anim-title delay-400 opacity-100" : "opacity-0"}`}
                        placeholder="Your Message"
                    ></textarea>
                    {errors.message && <span className="text-red-500 text-sm">{errors.message}</span>}
                </div>
            </div>

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
                onClick={() => window.location.href = "mailto:subeshgaming@gmail.com"}
            >
                <span className="relative z-10 hover:text-blue-950">Email</span>
            </button>
        </div>
    );
}
