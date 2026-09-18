"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Flame,
  Calendar,
  BookOpen,
  Award,
  HelpCircle,
  ArrowDown,
} from "lucide-react";

interface IoeSubjectJumpNavProps {
  hasQuestions?: boolean;
  hasExamScheme?: boolean;
  hasFaq?: boolean;
  hasSyllabus?: boolean;
}

export function IoeSubjectJumpNav({
  hasQuestions = true,
  hasExamScheme = true,
  hasFaq = true,
  hasSyllabus = true,
}: IoeSubjectJumpNavProps) {
  const [activeId, setActiveId] = useState<string>("");

  const navItems = [
    { id: "pdf-viewer", label: "PDF Papers", icon: FileText, color: "text-blue-500", show: true },
    { id: "most-asked", label: "Most Asked PYQs", icon: Flame, color: "text-amber-500", show: hasQuestions },
    { id: "year-wise", label: "Past 10 Years", icon: Calendar, color: "text-emerald-500", show: hasQuestions },
    { id: "syllabus", label: "Syllabus", icon: BookOpen, color: "text-violet-500", show: hasSyllabus },
    { id: "exam-scheme", label: "Marks Scheme", icon: Award, color: "text-indigo-500", show: hasExamScheme },
    { id: "faq", label: "FAQs", icon: HelpCircle, color: "text-rose-500", show: hasFaq },
  ].filter((item) => item.show);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const item of navItems) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [hasQuestions]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const offset = 90; // Navbar offset
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="sticky top-16 z-30 -mx-2 sm:mx-0">
      <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-2 shadow-sm backdrop-blur-md transition-all dark:border-gray-800/90 dark:bg-gray-900/90">
        <div className="flex items-center justify-between gap-2 overflow-x-auto px-1 py-0.5 text-xs font-semibold scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-2 pr-1">
              <ArrowDown className="h-3 w-3" />
              Jump to:
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleScrollTo(e, item.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? (item.id === "most-asked" ? "text-amber-400" : item.id === "year-wise" ? "text-emerald-400" : "text-blue-400") : item.color}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
