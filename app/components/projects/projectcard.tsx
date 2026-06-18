"use client"
import type { FC } from "react"
import { useEffect, useState, forwardRef } from "react"
import Image from "next/image"
import "../../globals.css"

interface ProjectCardProps {
  title: string
  description: string
  photo: string | string[]
  stack: string[]
  projectLink: string
  githubLink?: string
  index: number
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(({
  title,
  description,
  photo,
  stack,
  projectLink,
  githubLink,
  index,
}, ref) => {
  const isMultiple = Array.isArray(photo)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [showMoreDesc, setShowMoreDesc] = useState(false)

  useEffect(() => {
    if (!isMultiple) return
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % (photo as string[]).length)
    }, 3000)
    return () => clearInterval(interval)
  }, [photo])

  const currentPhoto = isMultiple ? (photo as string[])[photoIndex] : (photo as string) || "/placeholder.svg?height=192&width=384"

  return (
    <div
      ref={ref}
      className="opacity-0 w-full transition-colors duration-200 hover:bg-elevated"
      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-col md:flex-row gap-0 p-0">
        {/* Number + Info side */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <span className="mono text-4xl font-bold text-muted leading-none shrink-0">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-primary mb-1">{title}</h3>
              <p className="text-sm text-secondary leading-relaxed mb-2">
                {showMoreDesc ? description : description.length > 100 ? description.slice(0, 100) + "..." : description}
              </p>
              {description.length > 100 && (
                <button onClick={() => setShowMoreDesc(!showMoreDesc)} className="mono text-xs text-blue hover:underline">
                  {showMoreDesc ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {stack.map((tech) => (
              <span key={tech} className="mono text-xs px-[8px] py-0.5" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--accent-blue)" }}>
                {tech}
              </span>
            ))}
          </div>
          <div className="flex gap-4 mt-3">
            <a href={projectLink} target="_blank" rel="noopener noreferrer" className="mono text-xs text-blue hover:underline flex items-center gap-1">
              Live Demo ↗
            </a>
            {githubLink && (
              <a href={githubLink} target="_blank" rel="noopener noreferrer" className="mono text-xs text-blue hover:underline flex items-center gap-1">
                Source ↗
              </a>
            )}
          </div>
        </div>

        {/* Image side */}
        <div className="md:w-[200px] md:min-h-[140px] shrink-0 relative border-t md:border-t-0 md:border-l border-custom">
          <Image
            src={currentPhoto}
            alt={`${title} project screenshot`}
            fill
            className="object-cover"
            sizes="200px"
          />
        </div>
      </div>
    </div>
  )
})

ProjectCard.displayName = "ProjectCard"
export default ProjectCard