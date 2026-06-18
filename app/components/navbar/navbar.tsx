'use client'
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 80) setShowNavbar(false)
      else setShowNavbar(true)
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => { setIsMenuOpen(false); document.body.style.overflow = "" }

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#experiences", label: "Experiences" },
    { href: "#education", label: "Education" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ]

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
    closeMenu()
  }

  return (
    <>
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-base/80" onClick={closeMenu} />
      )}
      {isMobile && isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen z-50 flex flex-col items-center justify-center gap-6 bg-surface">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} scroll={false} onClick={(e) => handleClick(e, link.href)}>
              <span className="text-lg text-primary hover:text-green transition-colors">{link.label}</span>
            </Link>
          ))}
        </div>
      )}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"} bg-surface border-b border-custom`}>
        <Link href="#home" scroll={false}>
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
        </Link>
        {!isMobile ? (
          <div className="flex items-center gap-8 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} scroll={false} onClick={(e) => handleClick(e, link.href)}
                className="hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
            <a href="/resume_new.pdf" target="_blank" rel="noopener noreferrer"
              className="mono text-xs px-4 py-2 border border-green text-green transition-colors"
              style={{ borderColor: "var(--accent-green)", color: "var(--accent-green)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-green)"; e.currentTarget.style.color = "var(--bg-base)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--accent-green)"; }}
            >
              Resume
            </a>
          </div>
        ) : (
          <button onClick={toggleMenu} className="flex flex-col justify-center items-center w-8 h-8 z-[60]" aria-label="Toggle menu">
            <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`} />
            <span className={`block w-6 h-0.5 bg-primary my-1 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1" : ""}`} />
          </button>
        )}
      </nav>
    </>
  )
}