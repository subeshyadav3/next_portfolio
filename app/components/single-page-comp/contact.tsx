"use client";
import { useState,useEffect } from "react"
import useInViewAnimation from "@/app/hooks/useInViewAnimation";
import "../../globals.css";

export default function ContactPage() {
    const [isMobile, setIsMobile] = useState(false)

    const isInView= useInViewAnimation(0.8,"contact");
    
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


    return (
        <div id='contact' className=" min-h-screen flex justify-center items-center flex-col  pl-2 sm:pl-0">
            {/* <h1 className="text-xl ">Contact Me</h1> */}
            <h2 className={`text-4xl font-semibold mb-4 text-[#90A0D9] opacity-0 ${isInView?"hero-anim opacity-100":""}`}>Get In Touch</h2>
            <p className={`opacity-0 ${isInView?"hero-anim delay-400 opacity-100":""} mb-8 w-full  sm:w-[500px]  py-3`}>
               {isMobile ? "Feel free to reach out to me via email for any inquiries or collaboration opportunities. I'm always open to discussing new projects and ideas!" : " I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Let's connect and make something amazing together!"}
            </p>


            <button className={` opacity-0 ${isInView?"hero-anim delay-600 opacity-100":""} border-2 border-[#90A0D9] px-4 py-2 rounded-sm resume-btn`}
                onClick={() => window.location.href = "mailto:your-email@example.com"}>
                <span className='relative z-10 hover:text-blue-950'>Email</span>
            </button>

            
            
        </div>
    )
}
