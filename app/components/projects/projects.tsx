"use client"

import { useRef, useState, useEffect } from "react"
import ProjectCard from "./projectcard"
import "../../globals.css"
import projectsData from "./projectsData"
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedTitle from "../animation/AnimatedTitle"

gsap.registerPlugin(ScrollTrigger)

export default function ProjectsPage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement[]>([])


  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
 

      cardRef.current.forEach((card, index) => {
        if (!card) return
        gsap.fromTo(
          card,
          { y: 50, scale: 0.7, opacity: 0 },
          {
            
            y: 0,
            opacity: 1,
            scale: 1,
            delay: 0.05 * index,
            duration: .2,
            ease: 'power3.in',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'bottom 30%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [showMore])

  return (
    <div id='projects' className="flex flex-col mt-[100px] sm:ml-[100px] lg:ml-[200px] pl-2 sm:pl-0">
      <div className="space-y-8">
        <AnimatedTitle className="text-3xl font-bold text-[#90A0D9] title-line">
          Projects
        </AnimatedTitle>

        <div ref={sectionRef}  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.slice(0, showMore ? projectsData.length : 3).map((project, index) => (
            <ProjectCard
              key={index}
              ref={(el) => { cardRef.current[index] = el! }}
              title={project.title}
              description={project.description}
              photo={project.photo}
              stack={project.stack}
              projectLink={project.projectLink}
              githubLink={project.githubLink}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowMore(!showMore)}
            className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {showMore ? "Show Less Projects" : "Show More Projects"}
          </button>
        </div>
      </div>
    </div>
  )
}
