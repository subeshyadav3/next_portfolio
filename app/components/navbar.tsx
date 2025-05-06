'use client'

import Link from "next/link"
import { useState, useEffect } from "react"

export default function Navbar() {
    const [isMobile, setIsMobile] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showNavbar, setShowNavbar] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

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
                // scrolling down
                setShowNavbar(false)
            } else {
                // scrolling up
                setShowNavbar(true)
            }
            setLastScrollY(currentScrollY)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [lastScrollY])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
        document.body.style.overflow = !isMenuOpen ? "hidden" : ""
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
        document.body.style.overflow = ""
    }

    const navLinks = [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
        // { href: "#skills", label: "Skills" },
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
                <div className="fixed w-full inset-0 backdrop-blur-sm z-40" onClick={closeMenu} />
            )}

            <nav className={`navbar max-w-[1200px]  mx-auto flex flex-row items-center justify-between px-4 pt-5 sm:pt-8 sticky top-0 z-50 bg-[#23283E]  transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
                <Link href="#home" scroll={false}>
                    <div className="w-[70px] h-[80px] sm:w-[60px] sm:h-[60px] cursor-pointer">
                        <img src="/logo.svg" alt="Logo" />
                    </div>
                </Link>

                {!isMobile ? (
                    <div className="menu flex space-x-6 text-sm font-regular text-[#ccd6f6] ">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} scroll={false} onClick={(e) => handleClick(e, link.href)}>
                                <span className="nav-anim cursor-pointer">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <>
                        <button
                            className="z-[100] fixed top-4 right-4 flex flex-col justify-center items-center w-8 h-8"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            <span className={`block w-6 h-0.5 bg-[#ccd6f6] transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`} />
                            <span className={`block w-6 h-0.5 bg-[#ccd6f6] my-1 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
                            <span className={`block w-6 h-0.5 bg-[#ccd6f6] transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1" : ""}`} />
                        </button>
                        {isMenuOpen && (
                            <div className={`absolute top-0 right-0  gap-2 w-full h-screen bg-[#23283E] flex flex-col items-center justify-center transition-transform duration-400 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                                {navLinks.map((link) => (
                                    <Link key={link.href} href={link.href} scroll={false} onClick={(e) => handleClick(e, link.href)}>
                                        <span className="nav-anim cursor-pointer text-md my-4">{link.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}




                    </>

                )}
            </nav>
        </>
    )
}
