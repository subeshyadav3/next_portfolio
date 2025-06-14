'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import ScrollText from "../animation/ScrollText"



export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobNavTriggered, setMobNavTriggered] = useState(true)
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const toggleMenu = () => {
    setMobNavTriggered(!mobNavTriggered)
    setIsMenuOpen(!isMenuOpen)

  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.style.overflow = ""
  }

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#experiences", label: "Experiences" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ]


  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    e.preventDefault();

    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    closeMenu();
  };


  return (
    <>
      {isMobile && isMenuOpen && (
        <div className="fixed w-full  inset-0 backdrop-blur-lg z-40" onClick={closeMenu} />
      )}

      {isMobile && isMenuOpen && (
        <div className="mobile-nav  fixed bg-[radial-gradient(closest-side,#430741,#0c1232)] top-0  left-0 w-full h-screen  z-50 flex flex-col gap-2 items-center justify-center overflow-y-hidden">

          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} scroll={false} onClick={(e) => handleClick(e, link.href)}>
              <span className="nav-anim cursor-pointer text-md my-4">{link.label}</span>
            </Link>
          ))}
        </div>
      )}

      <nav className={`navbar mx-auto flex flex-row items-center justify-between backdrop-blur-sm px-4 w-full sm:pt-8 sticky top-0 z-50   transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
        <Link href="#home" scroll={false}>
          <div className="w-[70px] h-[80px] sm:w-[60px] sm:h-[60px] cursor-pointer " >
            <img src="/logo.svg" alt="Logo" />
          </div>
        </Link>

        {!isMobile ? (
          <div className="hidden sm:flex  space-x-6 text-sm font-regular text-[#ccd6f6]">
            {navLinks.map((link,i) => (
              <Link
                key={link.href}
                href={link.href}
                scroll={false}
                onClick={(e) => handleClick(e, link.href)}
                className="nav-anim cursor-pointer hover:text-[#64ffda] transition-all duration-300"
              >
                <ScrollText text={link.label} duration={1} delay={i*0.1} yOffset={80} animateOnMount={true} />
              </Link>
            ))}
          </div>
        ) : (
          <button
            className="z-[100] fixed top-4 right-[-20px] flex flex-col justify-center items-center w-8 h-8"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-[#ccd6f6] transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#ccd6f6] my-1 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#ccd6f6] transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1" : ""}`} />
          </button>
        )}
      </nav>
    </>
  )

}
