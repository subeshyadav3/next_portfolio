"use client"

import { useState } from "react"
import ProjectCard from "./projectcard"
import useInViewAnimation from "@/app/hooks/useInViewAnimation"
import "../../globals.css"
import projectsData from "./projectsData"

export default function ProjectsPage() {
  const [showMore, setShowMore] = useState(false)
  const isInView = useInViewAnimation(0.8, "projects")
  const [multiPhoto, setMultiPhoto] = useState({
    aqi: {
      aqi: {
        photos: [
          "/projects/aqi.png",
          "/projects/aqi1.png",
        ]
      }
    }
  })

  return (
    <div id='projects' className=" flex flex-col mt-[100px] sm:ml-[100px] lg:ml-[200px] pl-2 sm:pl-0 ">
      <div className="space-y-8">
        <div>
          <h1 className={`text-3xl  font-bold text-[#90A0D9] title-line opacity-0 ${isInView ? "hero-anim-title opacity-100 " : ""}`}>Projects</h1>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         
          {projectsData.slice(0, showMore ? projectsData.length : 3).map((project, index) => (
            <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            photo={project.photo}
            stack={project.stack}
            projectLink={project.projectLink}
            githubLink={project.githubLink}
            isInView={isInView}
            delay={project.delay}
          />
          ))}
        </div>

        {!showMore ? (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowMore(true)}
              className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Show More Projects
            </button>
          </div>
        ) :
          (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowMore(false)}
                className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Show Less Projects
              </button>
            </div>
          )}
      </div>
    </div>
  )
}
