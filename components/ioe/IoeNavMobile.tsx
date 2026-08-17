"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Library, GraduationCap, ArrowLeft, BookOpen } from "lucide-react";

export function IoeNavMobile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation Menu"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-200"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-slate-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-xl transition-all dark:border-gray-800 dark:bg-gray-950/95">
          <div className="flex flex-col gap-2">
            <Link
              href="/ioe"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-gray-900"
            >
              <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Programs (BCT, BCE, BEX)
            </Link>

            <Link
              href="/ioe/all"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-gray-900"
            >
              <Library className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              All Subjects Archive
            </Link>

            <div className="my-1 border-t border-slate-100 dark:border-gray-800" />

            <div className="grid grid-cols-3 gap-1.5 px-1 py-1">
              <Link
                href="/ioe/bct"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-blue-50 py-1.5 text-center text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
              >
                BCT
              </Link>
              <Link
                href="/ioe/bce"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-emerald-50 py-1.5 text-center text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              >
                BCE
              </Link>
              <Link
                href="/ioe/bex"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-violet-50 py-1.5 text-center text-xs font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
              >
                BEX
              </Link>
            </div>

            <div className="my-1 border-t border-slate-100 dark:border-gray-800" />

            <div className="flex items-center justify-between pt-1">
              <Link
                href="/blog"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Blog
              </Link>

              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
