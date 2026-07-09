"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  "JavaScript",
  "React.js",
  "Node.js",
  "Next.js",
  "Express.js",
  "MongoDB",
  "Tailwind CSS",
  "Python",
  "TypeScript",
  "PostgreSQL",
  "Prisma",
  "GSAP",
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Stagger text animations
      const textElements = textRef.current?.querySelectorAll(".about-animate");
      if (textElements) {
        gsap.fromTo(
          textElements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Image scale-in
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, scale: 0.9, rotateY: -10 },
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Skills stagger
      const skillTags = skillsRef.current?.querySelectorAll(".skill-tag");
      if (skillTags) {
        gsap.fromTo(
          skillTags,
          { opacity: 0, scale: 0.8, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // 3D tilt effect for image
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = imageRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
    }
  };

  return (
    <section id="about" className="min-h-screen flex items-center px-6 sm:px-0 py-24 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-green opacity-[0.02] rounded-full blur-[120px]" />

      <div ref={sectionRef} className="max-w-[900px] mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left column - text */}
          <div ref={textRef} className="md:w-[60%]">
            <p className="mono text-xs text-orange uppercase tracking-widest mb-4 about-animate">
              02 / about
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-8 about-animate">
              About Me
            </h2>

            <p className="text-base text-secondary leading-relaxed mb-6 about-animate">
              I am a passionate engineering student with a keen interest in coding and problem-solving.
              I thrive on challenges and enjoy exploring new technologies to create innovative solutions
              for real-world problems. My dedication to continuous learning drives me to stay updated with
              the latest trends in the tech industry.
            </p>

            <p className="text-base text-secondary leading-relaxed mb-8 about-animate">
              I am always eager to expand my skill set and take on new projects that push my boundaries.
              Whether it&apos;s developing web applications or diving into algorithms, I approach each
              task with enthusiasm and a commitment to excellence.
            </p>

            {/* Currently building row */}
            <a
              href="#projects"
              className="currently-building inline-flex items-center gap-2 px-4 py-2 mb-10 mono text-xs transition-all duration-300 about-animate hover:shadow-lg"
              style={{
                backgroundColor: "rgba(22, 27, 34, 0.8)",
                border: "1px solid rgba(61, 214, 140, 0.15)",
                color: "var(--text-secondary)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-green opacity-75 animate-ping" />
                <span className="relative rounded-full h-2 w-2 bg-green" />
              </span>
              <span className="text-muted">currently building</span>
              <span className="text-primary font-medium">Transparent Nepal</span>
              <ArrowUpRight size={12} className="text-green" />
            </a>

            <div ref={skillsRef}>
              <p className="mono text-xs text-muted uppercase tracking-widest mb-4 about-animate">
                Tech I work with
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-tag mono text-xs px-[10px] py-1 text-blue"
                    style={{
                      backgroundColor: "rgba(22, 27, 34, 0.8)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - photo with 3D tilt */}
          <div className="md:w-[40%] flex items-start justify-center md:justify-end md:mt-12">
            <div
              ref={imageRef}
              className="relative cursor-pointer transition-all duration-500 ease-out"
              style={{ transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Glow behind image */}
              <div
                className="absolute -inset-3 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(61,214,140,0.1), rgba(96,165,250,0.1))",
                  filter: "blur(20px)",
                }}
              />
              <div className="flex gap-3 relative">
                <div className="w-[3px] bg-green shadow-[0_0_10px_rgba(61,214,140,0.5)]" />
                <div
                  className="overflow-hidden neon-hover transition-all duration-300"
                  style={{ border: "1px solid rgba(61,214,140,0.15)" }}
                >
                  <Image
                    src="/profile.jpg"
                    alt="About Me"
                    width={280}
                    height={280}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
