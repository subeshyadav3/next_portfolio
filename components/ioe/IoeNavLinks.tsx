"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, GraduationCap, Library } from "lucide-react";

const NAV_ITEMS = [
  { href: "/ioe", label: "Overview", icon: GraduationCap, exact: true },
  { href: "/ioe/bct", label: "BCT" },
  { href: "/ioe/bce", label: "BCE" },
  { href: "/ioe/bex", label: "BEX" },
  { href: "/ioe/other-programs", label: "Other", icon: Compass },
  { href: "/ioe/all", label: "All Subjects", icon: Library },
];

export function IoeNavLinks() {
  const pathname = usePathname() || "/ioe";

  return (
    <div className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              isActive
                ? "bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-gray-800 dark:hover:text-white"
            }`}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
