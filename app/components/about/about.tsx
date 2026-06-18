"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../globals.css";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: contentRef.current, start: "top 80%" } }
      );
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.7, delay: 0.2, ease: "power3.out", scrollTrigger: { trigger: imageRef.current, start: "top 80%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="min-h-screen flex items-center px-6 sm:px-0 py-24">
      <div className="max-w-[900px] mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left column - text */}
          <div ref={contentRef} className="md:w-[60%]">
            <p className="mono text-xs text-orange uppercase tracking-widest mb-4">02 / about</p>
            <h2 className="text-[28px] font-semibold text-primary mb-8">About Me</h2>

            <p className="text-base text-secondary leading-relaxed mb-6">
              I am a passionate engineering student with a keen interest in coding and problem-solving. I thrive on challenges and enjoy exploring new technologies to create innovative solutions for real-world problems. My dedication to continuous learning drives me to stay updated with the latest trends in the tech industry.
            </p>

            <p className="text-base text-secondary leading-relaxed mb-10">
              I am always eager to expand my skill set and take on new projects that push my boundaries. Whether it is developing web applications or diving into algorithms, I approach each task with enthusiasm and a commitment to excellence.
            </p>

            <div>
              <p className="mono text-xs text-muted uppercase tracking-widest mb-4">Tech I work with</p>
              <div className="flex flex-wrap gap-2">
                {["JavaScript", "React.js", "Node.js", "Next.js", "Express.js", "MongoDB", "Tailwind CSS", "Python"].map((skill) => (
                  <span key={skill} className="mono text-xs px-[10px] py-1 border border-custom text-blue transition-colors hover:border-blue hover:bg-blue/10" style={{ backgroundColor: "var(--bg-elevated)" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - photo */}
          <div ref={imageRef} className="md:w-[40%] flex items-start justify-center md:justify-end md:mt-12">
            <div className="flex gap-3">
              <div className="w-[3px] bg-green shrink-0" />
              <div className="transition-all duration-300" style={{ border: "1px solid var(--border)" }}>
                <Image
                  src="/profile.jpg"
                  alt="About Me"
                  width={280}
                  height={280}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}