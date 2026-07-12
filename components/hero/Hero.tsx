"use client";
import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, ChevronDown, Sparkles } from "lucide-react";
import { SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiMongodb } from "react-icons/si";

const techTags = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#fff" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
];

const terminalLines = [
  { cmd: "whoami", out: "subesh_yadav", delay: 300 },
  { cmd: "stack --primary", out: "React Next.js Node.js TypeScript", delay: 900 },
  { cmd: "stack --tools", out: "MongoDB PostgreSQL Prisma Tailwind GSAP", delay: 1600 },
  { cmd: "status", out: "Building cool stuff ✦", delay: 2300, cursor: true },
];

// Animated particles background — deferred until idle and paused off-screen
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let animationId: number;
    let paused = false;
    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Pause when hero is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => { paused = !entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas.parentElement as Element);

    // Create particles
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 0.5,
      });
    }

    const draw = () => {
      if (paused) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(61, 214, 140, 0.3)";
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(61, 214, 140, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(draw);
    };

    // Defer particle init until browser is idle
    const start = () => {
      draw();
    };
    if ("requestIdleCallback" in window) {
      (window as Window).requestIdleCallback(start, { timeout: 2000 });
    } else {
      setTimeout(start, 300);
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}

export default function Hero() {
  const [shown, setShown] = useState(0);
  const socialsRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(terminalLines.length);
      return;
    }
    const timers = terminalLines.map((l) =>
      window.setTimeout(() => setShown((n) => n + 1), l.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const el = socialsRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    const id = window.setTimeout(() => {
      el.style.transition = "all 0.8s cubic-bezier(0.16,1,0.3,1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 2800);
    return () => clearTimeout(id);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("subeshgaming@gmail.com");
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center px-6 sm:px-0 relative overflow-hidden"
    >
      {/* Particle background */}
      <ParticleBackground />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green opacity-[0.03] rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue opacity-[0.03] rounded-full blur-[100px]" />

      <div className="max-w-[680px] mx-auto w-full pt-20 pb-16 relative z-10">
        {/* Status pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs mono status-pill fade-in-up"
          style={{
            backgroundColor: "rgba(61,214,140,0.08)",
            border: "1px solid rgba(61,214,140,0.2)",
            animationDelay: "0ms",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-green opacity-75 animate-ping" />
            <span className="relative rounded-full h-2 w-2 bg-green" />
          </span>
          Open to opportunities
        </div>

        {/* Name with gradient text + floating effect */}
        <h1
          ref={nameRef}
          className="text-5xl sm:text-7xl font-bold leading-[1.1] tracking-tight fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
          <span className="gradient-text">Subesh</span>
          <br />
          <span className="text-primary">Yadav</span>
        </h1>

        {/* Role line with icon */}
        <p
          className="mt-4 text-lg mono text-green flex items-center gap-2 fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <Sparkles size={16} className="animate-pulse" />
          &gt; Full-Stack Developer
        </p>

        {/* Bio */}
        <p
          className="mt-6 text-base text-secondary leading-relaxed max-w-xl fade-in-up"
          style={{ animationDelay: "450ms" }}
        >
          Building scalable web apps with{" "}
          <span className="text-green underline-draw">React</span>,{" "}
          <span className="text-green underline-draw">Next.js</span> and{" "}
          <span className="text-green underline-draw">Node.js</span>. Engineering student at Pulchowk Campus
          crafting pixel-perfect, high-performance digital experiences.
        </p>

        {/* Terminal snippet with glow */}
        <div
          className="mt-6 p-4 max-w-xl glass-card fade-in-up"
          style={{
            animationDelay: "600ms",
            border: "1px solid rgba(61,214,140,0.1)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--accent-green)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--accent-orange)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--accent-blue)" }} />
          </div>
          <div className="mono text-xs leading-relaxed min-h-[8.5rem]">
            {terminalLines.map((l, i) =>
              i < shown ? (
                <div key={i} className="terminal-line">
                  <p className="text-muted">
                    $ <span className="text-green">{l.cmd}</span>
                  </p>
                  <p className="text-secondary pl-4 mb-2">
                    {l.out}
                    {l.cursor && <span className="terminal-cursor text-green ml-1">▍</span>}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Tech tags with individual colors */}
        <div className="flex flex-wrap gap-2 mt-6 fade-in-up" style={{ animationDelay: "750ms" }}>
          {techTags.map(({ name, Icon, color }) => (
          <span
              key={name}
              className="tech-tag mono text-xs px-[10px] py-1"
              style={{
                backgroundColor: "rgba(22, 27, 34, 0.8)",
                border: `1px solid ${color}33`,
                color: color,
              }}
            >
              <Icon size={12} style={{ color }} />
              {name}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex gap-4 mt-8 fade-in-up" style={{ animationDelay: "900ms" }}>
          <a
            href="#projects"
            className="btn-glow mono text-xs uppercase tracking-widest px-7 py-3 inline-flex items-center gap-2"
            style={{
              backgroundColor: "var(--accent-green)",
              color: "var(--bg-base)",
              fontWeight: 600,
            }}
          >
            View Projects
          </a>
          <a
            href="https://github.com/subeshyadav3"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-xs uppercase tracking-widest px-7 py-3 inline-flex items-center gap-2 transition-all duration-300 hover:border-green neon-hover"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              backgroundColor: "rgba(22, 27, 34, 0.5)",
            }}
          >
            <Github size={14} />
            GitHub
          </a>
        </div>

        {/* Social row */}
        <div
          ref={socialsRef}
          className="flex items-center gap-4 mt-10 fade-in-up"
          style={{ animationDelay: "1050ms" }}
        >
          <a
            href="https://github.com/subeshyadav3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-green transition-colors duration-300"
            aria-label="GitHub"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          <a
            href="https://linkedin.com/in/subeshyadav3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-green transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-[18px] w-[18px]" />
          </a>
          <span className="w-px h-4 bg-muted" />
          <button
            onClick={handleCopyEmail}
            className="mono text-xs text-muted hover:text-green transition-colors duration-300 underline-draw"
          >
            subeshgaming@gmail.com
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        className="hidden md:flex flex-col items-center gap-1 absolute bottom-10 left-1/2 -translate-x-1/2 mono text-[10px] uppercase tracking-widest text-muted hover:text-green transition-colors cursor-pointer"
      >
        <span>scroll</span>
        <ChevronDown size={16} className="scroll-chevron" />
      </a>
    </section>
  );
}
