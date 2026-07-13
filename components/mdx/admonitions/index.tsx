import type { ReactNode } from "react";
import {
  Info,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Bell,
  BookOpen,
} from "lucide-react";

type Variant = "info" | "warning" | "success" | "tip" | "note" | "callout";

interface AdmonitionProps {
  title?: string;
  children: ReactNode;
}

/**
 * Design: each box has a 3px solid left accent bar, a light tinted background
 * that works in both light and dark, and a clear icon+label header.
 * Body text is 15px (0.9375rem) — not tiny like text-sm was.
 */
const config: Record<
  Variant,
  { icon: ReactNode; defaultTitle: string }
> = {
  info:    { icon: <Info className="h-4 w-4 shrink-0" />,          defaultTitle: "Note" },
  warning: { icon: <AlertTriangle className="h-4 w-4 shrink-0" />, defaultTitle: "Warning" },
  success: { icon: <CheckCircle className="h-4 w-4 shrink-0" />,  defaultTitle: "Success" },
  tip:     { icon: <Lightbulb className="h-4 w-4 shrink-0" />,    defaultTitle: "Tip" },
  note:    { icon: <BookOpen className="h-4 w-4 shrink-0" />,     defaultTitle: "Note" },
  callout: { icon: <Bell className="h-4 w-4 shrink-0" />,         defaultTitle: "Heads up" },
};

function Admonition({ variant, title, children }: AdmonitionProps & { variant: Variant }) {
  const c = config[variant];
  const isAlert = variant === "warning" || variant === "callout";

  return (
    <aside
      role="note"
      aria-live={isAlert ? "polite" : undefined}
      className="not-prose my-7 rounded-r-lg border-l-[3px] border-l-[var(--blog-accent)] bg-[var(--blog-accent-tint)] dark:bg-[var(--blog-accent-tint)] px-5 py-4"
    >
      <div className="mb-2.5 flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-widest text-[var(--blog-accent)]">
        <span aria-hidden="true">{c.icon}</span>
        <span>{title ?? c.defaultTitle}</span>
      </div>
      <div className="text-[0.9375rem] leading-relaxed text-[var(--blog-text-secondary)] [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&>ul]:my-2 [&>ul]:pl-5 [&>ul]:list-disc">
        {children}
      </div>
    </aside>
  );
}

export function InfoBox(props: AdmonitionProps)    { return <Admonition variant="info"    {...props} />; }
export function WarningBox(props: AdmonitionProps) {
  return <Admonition variant="warning" {...props} />;
}
export function SuccessBox(props: AdmonitionProps) {
  return <Admonition variant="success" {...props} />;
}
export function TipBox(props: AdmonitionProps) {
  return <Admonition variant="tip" {...props} />;
}
export function Notes(props: AdmonitionProps) {
  return <Admonition variant="note" {...props} />;
}
export function Callout(props: AdmonitionProps) {
  return <Admonition variant="callout" {...props} />;
}
