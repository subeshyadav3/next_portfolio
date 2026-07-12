"use client";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./projectcard";
import projectsData from "./projectsData";
import { ExternalLink, Github, ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsPage() {
  const featuredRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement[]>([]);
  const [showMore, setShowMore] = useState(false);

  const featured = projectsData[0];
  const rest = projectsData.slice(1);
  const visibleRest = showMore ? rest : rest.slice(0, 2);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (featuredRef.current) {
        gsap.fromTo(
          featuredRef.current.querySelector(".featured-content"),
          { opacity: 0, x: -60, filter: "blur(10px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
        gsap.fromTo(
          featuredRef.current.querySelector(".featured-image"),
          { opacity: 0, scale: 0.95, filter: "blur(10px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
        // Parallax on image
        gsap.to(featuredRef.current.querySelector(".featured-image"), {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      cardRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 30, opacity: 0, rotateX: -5 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            delay: 0.08 * i,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, [showMore]);

  return (
    <section id="projects" className="min-h-screen px-6 sm:px-0 py-24 relative">
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-green opacity-[0.03] rounded-full blur-[100px]" />

      <div className="max-w-[1000px] mx-auto w-full relative z-10">
        <p className="mono text-xs text-orange uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles size={14} />
          05 / projects
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-12">
          Projects
        </h2>

        {/* Featured project */}
        <div
          ref={featuredRef}
          className="featured-project relative mb-16 p-8 sm:p-12 overflow-hidden group"
          style={{
            backgroundColor: "rgba(13, 17, 23, 0.6)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(61,214,140,0.05), rgba(96,165,250,0.05), rgba(168,85,247,0.05))",
            }}
          />

          <div className="absolute top-4 right-4 mono text-[10px] text-orange uppercase tracking-widest flex items-center gap-1">
            <Sparkles size={10} />
            Featured
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="featured-content">
              <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4 leading-tight">
                {featured.title}
              </h3>
              <p className="text-sm text-secondary leading-relaxed mb-6">{featured.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {featured.stack.map((s) => (
                  <span
                    key={s}
                    className="mono text-[11px] px-2.5 py-1 transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: "rgba(22, 27, 34, 0.8)",
                      border: "1px solid var(--border)",
                      color: "var(--accent-blue)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href={featured.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow mono text-xs uppercase tracking-wider px-5 py-2.5 inline-flex items-center gap-2 transition-all duration-300"
                  style={{
                    backgroundColor: "var(--accent-green)",
                    color: "var(--bg-base)",
                    fontWeight: 600,
                  }}
                >
                  <ExternalLink size={14} />
                  View Live
                </a>
                <a
                  href={featured.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono text-xs uppercase tracking-wider px-5 py-2.5 inline-flex items-center gap-2 transition-all duration-300 neon-hover"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Github size={14} />
                  Source
                </a>
              </div>
            </div>

            <div
              className="featured-image-wrap overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <div className="featured-image w-full h-full transform transition-transform duration-700 hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={Array.isArray(featured.photo) ? featured.photo[0] : featured.photo}
                  alt={featured.title}
                  width={600}
                  height={450}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Other projects header */}
        <div className="flex items-center gap-3 mb-6">
          <ArrowRight size={14} className="text-orange animate-pulse" />
          <p className="mono text-xs text-orange uppercase tracking-widest">More work</p>
        </div>

        {/* Remaining projects */}
        <div className="flex flex-col gap-4" style={{ perspective: "1000px" }}>
          {visibleRest.map((project, i) => (
            <div key={i} ref={(el) => { cardRef.current[i] = el!; }}>
              <ProjectCard
                title={project.title}
                description={project.description}
                photo={project.photo}
                stack={project.stack}
                projectLink={project.projectLink}
                githubLink={project.githubLink}
                index={i}
              />
            </div>
          ))}
        </div>

        {rest.length > 2 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="w-full mt-8 py-4 mono text-xs text-muted hover:text-primary transition-all duration-300 neon-hover group"
            style={{ border: "1px solid var(--border)", backgroundColor: "transparent" }}
          >
            <span className="group-hover:text-green transition-colors">
              {showMore ? "show less ↑" : `show ${rest.length - 2} more ↓`}
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
