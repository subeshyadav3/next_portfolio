"use client"

import type { FC } from "react"
import { useEffect, useState, forwardRef } from "react"
import Image from "next/image"
import { ExternalLink, Github } from 'lucide-react'

import "../../globals.css"

interface ProjectCardProps {
  title: string
  description: string
  photo: string | string[]
  stack: string[]
  projectLink: string
  githubLink?: string
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(({
  title,
  description,
  photo,
  stack,
  projectLink,
  githubLink,
}, ref) => {
  const isMultiple = Array.isArray(photo)
  const [index, setIndex] = useState(0)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (!isMultiple) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % photo.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [photo])

  const currentPhoto = isMultiple ? photo[index] : photo || "/placeholder.svg?height=192&width=384"

  return (
    <div
      ref={ref}
      className="opacity-0 w-full max-w-sm rounded-xl border-b-2 border-[#90a0d9]
      bg-[#23283E] shadow-[#171f31] shadow-md transition-all duration-300
      hover:shadow-xl hover:-translate-y-1 hover:border-[#90a0d9] cursor-pointer"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={currentPhoto}
          alt={`${title} project screenshot`}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 384px"
        />
      </div>

      <div className="p-5">
        <h3 className="mb-2 text-xl font-semibold tracking-tight text-[#90a0d9]">{title}</h3>
        <p className="mb-2 text-sm text-gray-300">
          {showMore ? description : description.length > 100 ? description.slice(0, 100) + "..." : description}
        </p>
        {description.length > 100 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-[#90a0d9] underline text-sm"
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        )}

        <div className="mb-4 mt-4 flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
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
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-transparent text-gray-700  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Github className="h-4 w-4 text-white" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
})

ProjectCard.displayName = "ProjectCard"
export default ProjectCard
