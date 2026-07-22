"use client";
import { useRef, useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import {
  SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiTailwindcss, SiMongodb,
  SiExpress, SiPrisma, SiPostgresql, SiPython, SiPandas, SiStreamlit,
  SiClerk, SiGreensock, SiOpenaigym, SiVercel, SiShadcnui,
} from "react-icons/si";

interface ProjectCardProps {
  title: string;
  description: string;
  photo: string | string[];
  stack: string[];
  projectLink: string;
  githubLink?: string;
  index: number;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  NodeJS: SiNodedotjs,
  "Node.js": SiNodedotjs,
  TypeScript: SiTypescript,
  Tailwind: SiTailwindcss,
  "Tailwind CSS": SiTailwindcss,
  MongoDB: SiMongodb,
  ExpressJS: SiExpress,
  Express: SiExpress,
  Prisma: SiPrisma,
  PostgreSQL: SiPostgresql,
  Python: SiPython,
  Pandas: SiPandas,
  Streamlit: SiStreamlit,
  Clerk: SiClerk,
  OpenAI: SiOpenaigym,
  GSAP: SiGreensock,
  Vercel: SiVercel,
  ShadCn: SiShadcnui,
  "Shadcn UI": SiShadcnui,
  NextAuth: SiShadcnui,
};

const stackColors: Record<string, string> = {
  React: "#61DAFB",
  "Next.js": "#fff",
  "Node.js": "#339933",
  TypeScript: "#3178C6",
  MongoDB: "#47A248",
  Tailwind: "#06B6D4",
  Express: "#fff",
  Prisma: "#fff",
  PostgreSQL: "#336791",
  Python: "#3776AB",
};

export default function ProjectCard({
  title,
  description,
  photo,
  stack,
  projectLink,
  githubLink,
  index,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showMoreDesc, setShowMoreDesc] = useState(false);

  // 3D hover effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(10px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group project-card flex items-start gap-4 p-5 cursor-pointer transition-all duration-500"
      style={{
        backgroundColor: "rgba(13, 17, 23, 0.6)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Thumbnail */}
      {photo && (
        <div className="hidden sm:block shrink-0">
          <img
            src={Array.isArray(photo) ? photo[0] : photo}
            alt={title}
            width={80}
            height={80}
            loading="lazy"
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Number indicator with glow */}
      <div className="flex-1 min-w-0 relative">
        <div className="flex items-start gap-3 mb-3">
          <span className="mono text-2xl font-bold text-muted/50 leading-none shrink-0 group-hover:text-green/50 transition-colors duration-300">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex-1">
            <h3 className="text-base font-medium text-primary leading-tight group-hover:text-green transition-colors duration-300">
              {title}
            </h3>
          </div>
        </div>

        <div className="ml-[3.5rem]">
          <p className="text-sm text-secondary leading-relaxed mb-3">
            {showMoreDesc
              ? description
              : description.length > 120
              ? description.slice(0, 120) + "..."
              : description}
          </p>
          {description.length > 120 && (
            <button
              onClick={() => setShowMoreDesc(!showMoreDesc)}
              className="mono text-[11px] text-blue hover:underline mb-3 transition-colors"
            >
              {showMoreDesc ? "Show less" : "Show more"}
            </button>
          )}

          {/* Stack with colored icons */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {stack.map((s) => {
              const Icon = iconMap[s];
              const color = stackColors[s] || "var(--accent-blue)";
              return (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 mono text-[11px] px-2 py-0.5 transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: "rgba(22, 27, 34, 0.8)",
                    border: `1px solid ${color}33`,
                    color: color,
                  }}
                >
                  {Icon && <Icon size={11} style={{ color }} />}
                  {s}
                </span>
              );
            })}
          </div>

          <div className="flex gap-2">
            <a
              href={projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow mono text-[11px] uppercase tracking-wider px-3 py-1.5 inline-flex items-center gap-1.5 transition-all duration-300"
              style={{
                backgroundColor: "var(--accent-green)",
                color: "var(--bg-base)",
                fontWeight: 500,
              }}
            >
              <ExternalLink size={12} />
              View
            </a>
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mono text-[11px] uppercase tracking-wider px-3 py-1.5 inline-flex items-center gap-1.5 transition-all duration-300 neon-hover"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                <Github size={12} />
                Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
