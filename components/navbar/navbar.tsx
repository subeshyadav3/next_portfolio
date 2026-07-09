"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useActiveSection } from "../../hooks/useActiveSection";

const NAV_IDS = ["home", "about", "tech", "stats", "experiences", "education", "projects", "contact"];

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const active = useActiveSection(NAV_IDS);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) setShowNavbar(false);
      else setShowNavbar(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? "hidden" : "";
      return next;
    });
  };
  const closeMenu = () => { setIsMenuOpen(false); document.body.style.overflow = ""; };

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#tech", label: "Stack" },
    { href: "#experiences", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    closeMenu();
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-base/80 backdrop-blur-sm" onClick={closeMenu} />
      )}
      {isMobile && isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen z-50 flex flex-col items-center justify-center gap-8 bg-surface mobile-nav">
          <button
            onClick={closeMenu}
            className="absolute top-6 right-6 flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-elevated transition-colors"
            aria-label="Close menu"
          >
            <span className="block w-5 h-0.5 bg-primary rotate-45 translate-y-0.5 transition-all duration-300" />
            <span className="block w-5 h-0.5 bg-primary -rotate-45 -translate-y-0.5 transition-all duration-300" />
          </button>
          {navLinks.map((link, i) => {
            const id = link.href.replace("#", "");
            const isActive = active === id;
            return (
              <Link
                key={link.href}
                href={link.href}
                scroll={false}
                onClick={(e) => handleClick(e, link.href)}
                className="mobile-nav-item"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span
                  className={`text-xl font-medium transition-colors ${isActive ? "text-green" : "text-primary hover:text-green"}`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"} bg-glass border-b border-custom`}
      >
        <Link href="#home" scroll={false}>
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
        </Link>
        {!isMobile ? (
          <div className="flex items-center gap-8 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = active === id;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  scroll={false}
                  onClick={(e) => handleClick(e, link.href)}
                  className={`nav-link transition-colors ${isActive ? "nav-link--active" : "hover:text-primary"}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="/resume_new.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="Resume"
              className="mono text-xs px-4 py-2 border nav-resume"
              style={{ borderColor: "var(--accent-green)", color: "var(--accent-green)" }}
            >
              Resume
            </a>
          </div>
        ) : (
          <button onClick={toggleMenu} className="flex flex-col justify-center items-center w-8 h-8 z-[60]" aria-label="Toggle menu">
            <span className={`block w-6 h-0.5 bg-green transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`} />
            <span className={`block w-6 h-0.5 bg-green my-1 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-green transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1" : ""}`} />
          </button>
        )}
      </nav>
    </>
  );
}
