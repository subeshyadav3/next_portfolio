"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Github, Linkedin } from "lucide-react";
import "../../globals.css";

export default function Hero() {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (paragraphRef.current) {
        gsap.fromTo(
          paragraphRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.3 }
        );
      }
      if (terminalRef.current) {
        gsap.fromTo(
          terminalRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.4 }
        );
      }
      if (tagsRef.current) {
        gsap.fromTo(
          tagsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.5 }
        );
      }
      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.6 }
        );
      }
      if (socialsRef.current) {
        gsap.fromTo(
          socialsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.7 }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("subeshgaming@gmail.com");
  };

  return (
    <section id="home" className="min-h-screen flex items-center px-6 sm:px-0">
      <div className="max-w-[680px] mx-auto w-full pt-32">
        {/* Status pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 text-xs mono text-secondary" style={{ backgroundColor: "rgba(61,214,140,0.08)", border: "1px solid rgba(61,214,140,0.2)" }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-green opacity-75 animate-ping" />
            <span className="relative rounded-full h-2 w-2 bg-green" />
          </span>
          Open to opportunities
        </div>

        {/* Name */}
        <h1 className="text-4xl sm:text-6xl font-bold text-primary leading-tight tracking-tight">
          Subesh Yadav
        </h1>

        {/* Role line */}
        <p className="mt-3 text-lg mono text-green">
          &gt; Full-Stack Developer
        </p>

        {/* Bio */}
        <p ref={paragraphRef} className="mt-6 text-base text-secondary leading-relaxed max-w-xl">
          Building scalable web apps with React, Next.js and Node.js. Engineering student at Pulchowk Campus.
        </p>

        {/* Terminal snippet */}
        <div ref={terminalRef} className="mt-6 p-4 max-w-xl" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="h-2.5 w-2.5" style={{ backgroundColor: "var(--accent-green)" }} />
            <span className="h-2.5 w-2.5" style={{ backgroundColor: "var(--accent-orange)" }} />
            <span className="h-2.5 w-2.5" style={{ backgroundColor: "var(--accent-blue)" }} />
          </div>
          <div className="mono text-xs leading-relaxed">
            <p className="text-muted">$ <span className="text-green">whoami</span></p>
            <p className="text-secondary pl-4 mb-2">subesh_yadav</p>
            <p className="text-muted">$ <span className="text-green">stack</span></p>
            <p className="text-secondary pl-4 mb-2">React Next.js Node.js MongoDB</p>
            <p className="text-muted">$ <span className="text-green">status</span></p>
            <p className="text-secondary pl-4">Building cool stuff<span className="text-green ml-1">✦</span></p>
          </div>
        </div>

        {/* Tech tags */}
        <div ref={tagsRef} className="flex flex-wrap gap-2 mt-6">
          {["React.js", "Next.js", "Node.js", "TypeScript", "MongoDB"].map((tech) => (
            <span key={tech} className="mono text-xs px-[10px] py-1 text-blue" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              {tech}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div ref={buttonsRef} className="flex gap-3 mt-8">
          <a
            href="#projects"
            className="mono text-xs uppercase tracking-widest px-7 py-3"
            style={{ backgroundColor: "var(--accent-green)", color: "var(--bg-base)" }}
          >
            View Projects
          </a>
          <a
            href="https://github.com/subeshyadav3"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-xs uppercase tracking-widest px-7 py-3 hover:text-primary transition-colors"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            GitHub
          </a>
        </div>

        {/* Social row */}
        <div ref={socialsRef} className="flex items-center gap-4 mt-10">
          <a href="https://github.com/subeshyadav3" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors" aria-label="GitHub">
            <Github className="h-[18px] w-[18px]" />
          </a>
          <a href="https://linkedin.com/in/subeshyadav3" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors" aria-label="LinkedIn">
            <Linkedin className="h-[18px] w-[18px]" />
          </a>
          <span className="w-px h-4 bg-muted" />
          <button onClick={handleCopyEmail} className="mono text-xs text-muted hover:text-green transition-colors cursor-copy">
            subeshgaming@gmail.com
          </button>
        </div>
      </div>
    </section>
  );
}
