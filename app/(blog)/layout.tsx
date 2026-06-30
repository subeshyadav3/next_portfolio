"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/blog/ThemeToggle";
import { getCategoryAccent } from "@/lib/blog/categories";

interface NavItem {
  label: string;
  href?: string;
  color?: string;
  children?: { label: string; href: string }[];
}

const BLOG_NAV: NavItem[] = [
  { label: "Essays", href: "/blog/category/essays", color: getCategoryAccent("essays") },
  { label: "Poems", href: "/blog/category/poems", color: getCategoryAccent("poems") },
  { label: "Shayari & Gajal", href: "/blog/category/shayari", color: getCategoryAccent("shayari") },
  { label: "Stories", href: "/blog/category/stories", color: getCategoryAccent("stories") },
  {
    label: "Exam Notes",
    color: getCategoryAccent("see"),
    children: [
      { label: "SEE", href: "/blog/category/see" },
      { label: "BLE", href: "/blog/category/ble" },
      { label: "Class 7", href: "/blog/category/class-7" },
      { label: "Class 8", href: "/blog/category/class-8" },
      { label: "Class 9", href: "/blog/category/class-9" },
      { label: "Class 10", href: "/blog/category/class-10" },
      { label: "Class 11", href: "/blog/category/class-11" },
    ],
  },
  { label: "Reviews", href: "/blog/category/reviews", color: getCategoryAccent("reviews") },
];

function useIsActive(href?: string): boolean {
  const pathname = usePathname();
  if (!href) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActive = useIsActive(item.href);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (item.children) {
    return (
      <div
        className="relative"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          className="flex items-center gap-1 text-sm font-medium transition-colors"
          style={{ color: open ? item.color : "var(--blog-text-secondary)" }}
        >
          {item.label}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div
            role="menu"
            className="absolute top-full left-0 mt-2 w-44 rounded-lg border border-[var(--blog-border)] bg-[var(--blog-surface)] shadow-lg py-1"
          >
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                className="block px-4 py-2 text-sm text-[var(--blog-text-secondary)] hover:bg-[var(--blog-bg)] hover:text-[var(--blog-text)] transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className="text-sm font-medium transition-colors"
      style={{
        color: isActive ? item.color : "var(--blog-text-secondary)",
      }}
    >
      {item.label}
    </Link>
  );
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);

  if (item.children) {
    return (
      <div className="border-b border-[var(--blog-border)]">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`mobile-submenu-${item.label}`}
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between py-3 text-base font-medium text-[var(--blog-text)]"
        >
          {item.label}
          <ChevronDown
            className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
        {expanded && (
          <div id={`mobile-submenu-${item.label}`} className="pb-2 pl-4 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className="block py-2 text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)]"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      onClick={onNavigate}
      className="block py-3 text-base font-medium text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] border-b border-[var(--blog-border)]"
    >
      {item.label}
    </Link>
  );
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="blog-section min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[var(--blog-border)] bg-[var(--blog-bg)]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/blog"
              className="text-xl font-semibold tracking-tight text-[var(--blog-text)]"
            >
              Subesh<span className="text-[var(--blog-accent)]">.</span>Blog
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {BLOG_NAV.map((item) => (
                <DesktopNavItem key={item.label} item={item} />
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/blog/search"
                className="hidden md:flex p-2 rounded-full hover:bg-[var(--blog-surface)] transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-[var(--blog-text-secondary)]" />
              </Link>
              <button
                type="button"
                className="md:hidden p-2 rounded-full hover:bg-[var(--blog-surface)] transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5 text-[var(--blog-text-secondary)]" />
                ) : (
                  <Menu className="h-5 w-5 text-[var(--blog-text-secondary)]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--blog-border)] bg-[var(--blog-bg)]">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 space-y-1">
              {BLOG_NAV.map((item) => (
                <MobileNavItem
                  key={item.label}
                  item={item}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
              <Link
                href="/blog/search"
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-base font-medium text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)]"
              >
                Search
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[var(--blog-border)] bg-[var(--blog-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link
                href="/blog"
                className="text-lg font-semibold text-[var(--blog-text)]"
              >
                Subesh<span className="text-[var(--blog-accent)]">.</span>Blog
              </Link>
              <p className="mt-3 text-sm text-[var(--blog-text-secondary)] leading-relaxed">
                Essays, poems, SEE/BLB notes, and educational content in Nepali
                and English.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--blog-text)]">
                Quick Links
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/search"
                    className="text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
                  >
                    Search
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/author"
                    className="text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
                  >
                    Author
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--blog-text)]">
                Connect
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="https://github.com/subeshyadav3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/subeshyadav"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[var(--blog-border)] text-center text-sm text-[var(--blog-text-muted)]">
            © {new Date().getFullYear()} Subesh Yadav. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
