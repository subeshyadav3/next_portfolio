"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, ArrowUpRight, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current?.querySelectorAll(".footer-animate"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="py-16 px-6 sm:px-0 relative"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-[900px] mx-auto">
        {/* Terminal-style intro */}
        <pre
          className="footer-animate mono text-xs leading-relaxed mb-8 whitespace-pre-wrap"
          style={{ color: "var(--text-secondary)" }}
        >
{`$ cat ~/.subesh
> Subesh Yadav · Full-Stack Developer
> Based in Nepal · UTC+5:45
> Last deployed: ${today}

$ ls socials/`}
        </pre>

        <div className="flex items-center gap-4 mb-6 flex-wrap footer-animate">
          <a
            href="https://github.com/subeshyadav3"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-xs text-secondary hover:text-green transition-all duration-300 flex items-center gap-2 group"
          >
            <Github size={14} className="group-hover:scale-110 transition-transform" />
            github.com/subeshyadav3
            <ArrowUpRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </a>
          <a
            href="https://linkedin.com/in/subeshyadav3"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-xs text-secondary hover:text-green transition-all duration-300 flex items-center gap-2 group"
          >
            <Linkedin size={14} className="group-hover:scale-110 transition-transform" />
            linkedin.com/in/subeshyadav3
            <ArrowUpRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </a>
        </div>

        <div className="footer-animate flex items-center justify-between flex-wrap gap-4 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="mono text-xs text-muted">
            Subesh Yadav · © {new Date().getFullYear()}
          </p>
          <p className="mono text-xs text-muted flex items-center gap-1">
            Built with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> and React
          </p>
        </div>
      </div>
    </footer>
  );
}
