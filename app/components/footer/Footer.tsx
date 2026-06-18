"use client";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <footer
      className="py-12 px-6 sm:px-0"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-[900px] mx-auto">
        <pre
          className="mono text-xs leading-relaxed mb-8 whitespace-pre-wrap"
          style={{ color: "var(--text-secondary)" }}
        >
{`$ cat ~/.subesh
> Subesh Yadav · Full-Stack Developer
> Based in Nepal · UTC+5:45
> Last deployed: ${today}

$ ls socials/`}
        </pre>
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <a
            href="https://github.com/subeshyadav3"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="GitHub"
            className="mono text-xs text-secondary hover:text-green transition-colors flex items-center gap-2"
          >
            <Github size={14} /> github.com/subeshyadav3
          </a>
          <a
            href="https://linkedin.com/in/subeshyadav3"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="LinkedIn"
            className="mono text-xs text-secondary hover:text-green transition-colors flex items-center gap-2"
          >
            <Linkedin size={14} /> linkedin.com/in/subeshyadav3
          </a>
        </div>
        <p className="mono text-xs text-muted text-center">
          Subesh Yadav · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
