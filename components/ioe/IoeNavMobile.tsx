"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Library, GraduationCap, ArrowLeft, BookOpen, Compass } from "lucide-react";

export function IoeNavMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "/ioe";

  const isPathActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Navigation Menu"
        aria-expanded={isOpen}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition active:scale-95 hover:bg-slate-50 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-200"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {isOpen && (
        <>
          {/* Click-outside backdrop */}
          <div
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 top-[57px] z-40 bg-slate-900/25 backdrop-blur-xs"
          />

          <div className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-xl backdrop-blur-xl transition-all dark:border-gray-800 dark:bg-gray-950/95">
            <div className="flex flex-col gap-1.5">
              <Link
                href="/ioe"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  isPathActive("/ioe", true)
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-gray-900"
                }`}
              >
                <GraduationCap className="h-4 w-4 text-blue-500" />
                IOE Home &amp; Programs
              </Link>

              <Link
                href="/ioe/all"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  isPathActive("/ioe/all")
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-gray-900"
                }`}
              >
                <Library className="h-4 w-4 text-emerald-500" />
                All Subjects A–Z
              </Link>

              <Link
                href="/ioe/other-programs"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  isPathActive("/ioe/other-programs")
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-gray-900"
                }`}
              >
                <Compass className="h-4 w-4 text-amber-500" />
                Other Programs
              </Link>

              <div className="my-1 border-t border-slate-100 dark:border-gray-800" />

              <div className="grid grid-cols-3 gap-2 py-1">
                {[
                  {
                    href: "/ioe/bct",
                    label: "BCT",
                    activeCls: "bg-blue-600 text-white shadow-xs",
                    cls: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
                  },
                  {
                    href: "/ioe/bce",
                    label: "BCE",
                    activeCls: "bg-emerald-600 text-white shadow-xs",
                    cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
                  },
                  {
                    href: "/ioe/bex",
                    label: "BEX",
                    activeCls: "bg-violet-600 text-white shadow-xs",
                    cls: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
                  },
                ].map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-xl py-2.5 text-center text-xs font-bold transition ${
                      isPathActive(p.href) ? p.activeCls : p.cls
                    }`}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>

              <div className="my-1 border-t border-slate-100 dark:border-gray-800" />

              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/blog"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Blog
                </Link>

                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Portfolio
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
