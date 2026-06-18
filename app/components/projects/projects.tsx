"use client"
import { useRef, useState, useEffect } from "react"
import ProjectCard from "./projectcard"
import "../../globals.css"
import projectsData from "./projectsData"
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ProjectsPage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement[]>([])
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRef.current.forEach((card, i) => {
        gsap.fromTo(card, { y: 20, opacity: 0 }, { y: 0, opacity: 1, delay: 0.05 * i, duration: 0.4, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' } })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [showMore])

  const visibleProjects = showMore ? projectsData : projectsData.slice(0, 3)

  return (
    <section id="projects" ref={sectionRef} className="min-h-screen flex items-center px-6 sm:px-0 py-24">
      <div className="max-w-[900px] mx-auto w-full">
        <p className="mono text-xs text-orange uppercase tracking-widest mb-4">05 / projects</p>
        <h2 className="text-[28px] font-semibold text-primary mb-12">Projects</h2>

        {/* All projects - single column */}
        <div className="flex flex-col gap-4">
          {visibleProjects.map((project, i) => (
            <ProjectCard
              key={i}
              ref={(el) => { cardRef.current[i] = el! }}
              title={project.title}
              description={project.description}
              photo={project.photo}
              stack={project.stack}
              projectLink={project.projectLink}
              githubLink={project.githubLink}
              index={i}
            />
          ))}
        </div>

        {projectsData.length > 3 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="w-full mt-8 py-4 mono text-xs text-muted hover:text-primary transition-colors"
            style={{ border: "1px solid var(--border)", backgroundColor: "transparent" }}
          >
            {showMore ? "show less ↑" : "show more projects ↓"}
          </button>
        )}
      </div>
    </section>
  )
}