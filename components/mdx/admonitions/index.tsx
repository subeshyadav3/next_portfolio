import type { ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle, Lightbulb, Bell, BookOpen } from "lucide-react";

type Variant = "info" | "warning" | "success" | "tip" | "note" | "callout";

interface AdmonitionProps {
  title?: string;
  children: ReactNode;
}

const styles: Record<
  Variant,
  { bg: string; border: string; text: string; icon: ReactNode; defaultTitle: string }
> = {
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-300 dark:border-blue-800",
    text: "text-blue-900 dark:text-blue-200",
    icon: <Info className="h-5 w-5" />,
    defaultTitle: "Info",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-300 dark:border-amber-800",
    text: "text-amber-900 dark:text-amber-200",
    icon: <AlertTriangle className="h-5 w-5" />,
    defaultTitle: "Warning",
  },
  success: {
    bg: "bg-green-50 dark:bg-green-950/40",
    border: "border-green-300 dark:border-green-800",
    text: "text-green-900 dark:text-green-200",
    icon: <CheckCircle className="h-5 w-5" />,
    defaultTitle: "Success",
  },
  tip: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-300 dark:border-purple-800",
    text: "text-purple-900 dark:text-purple-200",
    icon: <Lightbulb className="h-5 w-5" />,
    defaultTitle: "Tip",
  },
  note: {
    bg: "bg-stone-100 dark:bg-stone-900/40",
    border: "border-stone-300 dark:border-stone-700",
    text: "text-stone-900 dark:text-stone-200",
    icon: <BookOpen className="h-5 w-5" />,
    defaultTitle: "Note",
  },
  callout: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-300 dark:border-rose-800",
    text: "text-rose-900 dark:text-rose-200",
    icon: <Bell className="h-5 w-5" />,
    defaultTitle: "Heads up",
  },
};

function Admonition({ variant, title, children }: AdmonitionProps & { variant: Variant }) {
  const s = styles[variant];
  return (
    <aside
      className={`my-6 rounded-lg border-l-4 ${s.border} ${s.bg} p-4 not-prose`}
      role="note"
    >
      <div className={`mb-2 flex items-center gap-2 font-semibold ${s.text}`}>
        {s.icon}
        <span>{title ?? s.defaultTitle}</span>
      </div>
      <div className={`${s.text} prose-sm`}>{children}</div>
    </aside>
  );
}

export function InfoBox(props: AdmonitionProps) {
  return <Admonition variant="info" {...props} />;
}
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
