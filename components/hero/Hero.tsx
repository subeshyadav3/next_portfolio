import Image from "next/image";
import { Github, Linkedin, Mail, ChevronDown, FileText, ArrowRight } from "lucide-react";
import { SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiMongodb } from "react-icons/si";

const techTags = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#fff" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center px-4 sm:px-6 md:px-0 relative overflow-hidden"
    >
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green opacity-[0.03] rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue opacity-[0.03] rounded-full blur-[100px]" />

      <div className="max-w-[680px] mx-auto w-full pt-24 pb-16 relative z-10">
        <div className="flex items-center gap-4 mb-8 fade-in-up" style={{ animationDelay: "0ms" }}>
          <Image
            src="/profile.jpg"
            alt="Portrait of Subesh Yadav"
            width={72}
            height={72}
            priority
            className="h-[72px] w-[72px] rounded-full object-cover border border-custom"
          />
          <div
            className="inline-flex items-center gap-2 px-4 py-2 text-xs mono status-pill"
            style={{
              backgroundColor: "rgba(61,214,140,0.08)",
              border: "1px solid rgba(61,214,140,0.2)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-green opacity-75 animate-ping" />
              <span className="relative rounded-full h-2 w-2 bg-green" />
            </span>
            Open to opportunities
          </div>
        </div>

        <h1
          className="text-5xl sm:text-7xl font-bold leading-[1.1] tracking-tight fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <span className="gradient-text">Subesh</span>
          <br />
          <span className="text-primary">Yadav</span>
        </h1>

        <p
          className="mt-4 text-lg mono text-green fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          Full-Stack Developer · Kathmandu, Nepal
        </p>

        <p
          className="mt-6 text-base sm:text-lg text-secondary leading-relaxed max-w-xl fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          I build fast, scalable web apps with{" "}
          <span className="text-primary font-medium">React</span>,{" "}
          <span className="text-primary font-medium">Next.js</span> and{" "}
          <span className="text-primary font-medium">Node.js</span>. Computer engineering
          student at Pulchowk Campus, writing about code and building tools for students.
        </p>

        <ul
          className="flex flex-wrap gap-2 mt-6 fade-in-up"
          style={{ animationDelay: "400ms" }}
          aria-label="Core technologies"
        >
          {techTags.map(({ name, Icon, color }) => (
            <li
              key={name}
              className="tech-tag mono text-xs px-[10px] py-1"
              style={{
                backgroundColor: "rgba(22, 27, 34, 0.8)",
                border: `1px solid ${color}33`,
                color,
              }}
            >
              <Icon size={12} style={{ color }} />
              {name}
            </li>
          ))}
        </ul>

        <div
          className="flex flex-wrap gap-3 mt-8 fade-in-up"
          style={{ animationDelay: "500ms" }}
        >
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
            <ArrowRight size={14} />
          </a>
          <a
            href="#contact"
            className="mono text-xs uppercase tracking-widest px-7 py-3 inline-flex items-center gap-2 transition-all duration-300 hover:border-green neon-hover"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              backgroundColor: "rgba(22, 27, 34, 0.5)",
            }}
          >
            <Mail size={14} />
            Contact
          </a>
          <a
            href="/resume_new.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-xs uppercase tracking-widest px-7 py-3 inline-flex items-center gap-2 text-muted hover:text-green transition-colors duration-300"
          >
            <FileText size={14} />
            Resume
          </a>
        </div>

        <div
          className="flex items-center gap-4 mt-10 fade-in-up"
          style={{ animationDelay: "600ms" }}
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
          <a
            href="mailto:subeshgaming@gmail.com"
            className="mono text-xs text-muted hover:text-green transition-colors duration-300 underline-draw"
          >
            subeshgaming@gmail.com
          </a>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="hidden md:flex flex-col items-center gap-1 absolute bottom-10 left-1/2 -translate-x-1/2 mono text-[10px] uppercase tracking-widest text-muted hover:text-green transition-colors"
      >
        <span>scroll</span>
        <ChevronDown size={16} className="scroll-chevron" />
      </a>
    </section>
  );
}
