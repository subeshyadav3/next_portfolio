"use client"

import type { FC } from "react"
import Image from "next/image"
import { ExternalLink, Github } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  photo: string
  stack: string[]
  projectLink: string
  githubLink?: string
}

const ProjectCard: FC<ProjectCardProps> = ({ title, description, photo, stack, projectLink, githubLink }) => {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border border-gray-200  shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={photo || "/placeholder.svg?height=192&width=384"}
          alt={`${title} project screenshot`}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 384px"
        />
      </div>

      <div className="p-5">
        <h3 className="mb-2 text-xl font-bold tracking-tight ">{title}</h3>
        
        <p className="mb-4 text-sm text-gray-600 line-clamp-3 dark:text-gray-300">{description}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span 
              key={tech} 
              className="inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex justify-between gap-2">
          <a 
            href={projectLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Project
          </a>

          {githubLink && (
            <a 
              href={githubLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="View source code on GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-transparent text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
