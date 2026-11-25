"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Compass, Cpu, Flame, Layers, Zap } from "lucide-react";

export interface QuickProgramData {
  code: string;
  name: string;
  slug: string;
  fullName: string;
  totalSubjects: number;
  pyqCount: number;
  semesters: Array<{
    sem: string;
    subjectCount: number;
  }>;
}

interface IoeQuickLauncherProps {
  programs: QuickProgramData[];
  otherSubjectsCount: number;
  otherFacultiesCount: number;
}

const ACCENT_MAP: Record<
  string,
  {
    activeTab: string;
    semHover: string;
    badge: string;
    cta: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  BCT: {
    activeTab: "bg-blue-600 text-white shadow-xs dark:bg-blue-500",
    semHover: "hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-500 dark:hover:bg-blue-950/50 dark:hover:text-blue-300",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    cta: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    icon: Cpu,
  },
  BCE: {
    activeTab: "bg-emerald-600 text-white shadow-xs dark:bg-emerald-500",
    semHover: "hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    cta: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    icon: Building2,
  },
  BEX: {
    activeTab: "bg-violet-600 text-white shadow-xs dark:bg-violet-500",
    semHover: "hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 dark:hover:border-violet-500 dark:hover:bg-violet-950/50 dark:hover:text-violet-300",
    badge: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
    cta: "bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600",
    icon: Zap,
  },
};

const OTHER_FACULTIES = ["BEL", "BME", "BAE", "BGE", "BIE", "B.Arch", "BCH", "BAG", "BAS"];

export function IoeQuickLauncher({
  programs,
  otherSubjectsCount,
  otherFacultiesCount,
}: IoeQuickLauncherProps) {
  const [selectedCode, setSelectedCode] = useState<string>(programs[0]?.code ?? "BCT");

  const activeProgram = programs.find((p) => p.code === selectedCode);
  const isOther = selectedCode === "OTHER";
  const accent = ACCENT_MAP[selectedCode] ?? ACCENT_MAP.BCT;
  const ActiveIcon = isOther ? Compass : accent.icon;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 dark:border-gray-800/90 dark:bg-gray-950/60 sm:p-5">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Layers className="h-3.5 w-3.5 text-blue-500" />
            Quick Semester Jump
          </span>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Pick faculty
          </span>
        </div>

        {/* Faculty Switcher Pills */}
        <div className="mt-3 grid grid-cols-4 gap-1.5 rounded-xl border border-slate-200/80 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
          {programs.map((p) => {
            const isActive = selectedCode === p.code;
            const cfg = ACCENT_MAP[p.code] ?? ACCENT_MAP.BCT;
            return (
              <button
                key={p.code}
                type="button"
                onClick={() => setSelectedCode(p.code)}
                className={`rounded-lg py-2 font-mono text-xs font-bold transition ${
                  isActive
                    ? cfg.activeTab
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-gray-800"
                }`}
              >
                {p.code}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setSelectedCode("OTHER")}
            className={`rounded-lg py-2 font-mono text-xs font-bold transition ${
              isOther
                ? "bg-amber-600 text-white shadow-xs dark:bg-amber-500"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-gray-800"
            }`}
          >
            Other
          </button>
        </div>

        {/* Active Program Details */}
        {activeProgram ? (
          <div className="mt-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900 dark:text-white">
                  <ActiveIcon className="h-4 w-4 shrink-0 text-blue-500" />
                  <span className="truncate">{activeProgram.fullName}</span>
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {activeProgram.totalSubjects} courses · {activeProgram.pyqCount} interactive PYQ banks
                </p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${accent.badge}`}
              >
                <Flame className="h-2.5 w-2.5" />
                {activeProgram.semesters.length} Sems
              </span>
            </div>

            <div className="mt-3.5 grid grid-cols-4 gap-2">
              {activeProgram.semesters.map((s) => (
                <Link
                  key={s.sem}
                  href={`/ioe/${activeProgram.slug}/semester/${s.sem}`}
                  className={`group flex flex-col items-center justify-center rounded-xl border border-slate-200/90 bg-white px-2 py-2.5 text-center shadow-2xs transition dark:border-gray-800 dark:bg-gray-900 ${accent.semHover}`}
                >
                  <span className="font-mono text-xs font-extrabold">Sem {s.sem}</span>
                  <span className="mt-0.5 text-[10px] text-slate-400 group-hover:text-current">
                    {s.subjectCount} subj
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900 dark:text-white">
                  <Compass className="h-4 w-4 text-amber-500" />
                  Specialized B.E. Faculties
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {otherFacultiesCount} disciplines · {otherSubjectsCount} archived subjects
                </p>
              </div>
            </div>

            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {OTHER_FACULTIES.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-amber-200/80 bg-white px-2.5 py-1.5 font-mono text-[11px] font-bold text-amber-800 dark:border-amber-900/50 dark:bg-gray-900 dark:text-amber-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-gray-800">
        {activeProgram ? (
          <Link
            href={`/ioe/${activeProgram.slug}`}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-xs transition ${accent.cta}`}
          >
            <span>Open {activeProgram.code} Full Curriculum</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <Link
            href="/ioe/other-programs"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            <span>Browse All Other Programs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
