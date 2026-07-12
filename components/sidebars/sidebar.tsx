"use client"

import type React from "react"
import { Github, Linkedin, Facebook } from "lucide-react"
import Link from "next/link"
import gsap from "gsap"
import { useEffect } from "react"

const Sidebar: React.FC = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sidebar-icon",
        { y: 60, opacity: 0, scale: 0.5 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.15 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed right-0 top-0 hidden md:flex h-screen w-[50px] flex-col items-center justify-center z-40">
      <div className="flex flex-col items-center gap-6">
        <Link
          href="https://github.com/subeshyadav3"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-icon hover:scale-105 hover:translate-y-[-2px] transition-transform duration-300 ease-in-out"
        >
          <Github size={22} className="text-muted hover:text-green transition-colors" />
          <span className="sr-only">GitHub</span>
        </Link>

        <Link
          href="https://linkedin.com/in/subeshyadav3"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-icon hover:scale-105 hover:translate-y-[-2px] transition-transform duration-300 ease-in-out"
        >
          <Linkedin size={22} className="text-muted hover:text-green transition-colors" />
          <span className="sr-only">LinkedIn</span>
        </Link>

        <Link
          href="https://www.facebook.com/subesh.yadav.54772/"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-icon hover:scale-105 hover:translate-y-[-2px] transition-transform duration-300 ease-in-out"
        >
          <Facebook size={22} className="text-muted hover:text-green transition-colors" />
          <span className="sr-only">Facebook</span>
        </Link>

        <div className="mt-6 h-[80px] w-px" style={{ backgroundColor: "var(--border)" }} />
      </div>
    </div>
  )
}

export default Sidebar
