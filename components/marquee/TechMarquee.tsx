"use client";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiExpress,
  SiPrisma,
  SiGreensock,
  SiVercel,
  SiPython,
  SiPandas,
  SiStreamlit,
  SiClerk,
  SiShadcnui,
} from "react-icons/si";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Item = { name: string; Icon: React.ComponentType<{ size?: number; className?: string }> };

const rows: Item[][] = [
  [
    { name: "React", Icon: SiReact },
    { name: "Next.js", Icon: SiNextdotjs },
    { name: "TypeScript", Icon: SiTypescript },
    { name: "Node.js", Icon: SiNodedotjs },
    { name: "Tailwind CSS", Icon: SiTailwindcss },
    { name: "MongoDB", Icon: SiMongodb },
    { name: "PostgreSQL", Icon: SiPostgresql },
  ],
  [
    { name: "Express", Icon: SiExpress },
    { name: "Prisma", Icon: SiPrisma },
    { name: "GSAP", Icon: SiGreensock },
    { name: "Vercel", Icon: SiVercel },
    { name: "Shadcn UI", Icon: SiShadcnui },
    { name: "Clerk", Icon: SiClerk },
    { name: "Python", Icon: SiPython },
  ],
  [
    { name: "Pandas", Icon: SiPandas },
    { name: "Streamlit", Icon: SiStreamlit },
    { name: "React", Icon: SiReact },
    { name: "Next.js", Icon: SiNextdotjs },
    { name: "MongoDB", Icon: SiMongodb },
    { name: "TypeScript", Icon: SiTypescript },
    { name: "Tailwind CSS", Icon: SiTailwindcss },
  ],
];

export default function TechMarquee() {
  const reduced = useReducedMotion();

  return (
    <section id="tech" className="py-24 overflow-hidden">
      <div className="max-w-[1100px] mx-auto w-full px-6">
        <p className="mono text-xs text-orange uppercase tracking-widest mb-4">02.5 / stack</p>
        <h2 className="text-[28px] font-semibold text-primary mb-10">Tech I work with</h2>
      </div>
      <div className="marquee-mask flex flex-col gap-4">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`marquee-row ${reduced ? "" : i % 2 === 0 ? "marquee-row--left" : "marquee-row--right"}`}
          >
            <div className="marquee-track">
              {[...row, ...row, ...row].map((item, j) => (
                <span key={j} className="marquee-item mono text-sm">
                  <item.Icon size={18} className="text-secondary" />
                  <span className="text-primary">{item.name}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
