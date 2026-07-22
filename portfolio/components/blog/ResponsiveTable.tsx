interface ResponsiveTableProps {
  children?: React.ReactNode;
}

export function ResponsiveTable({ children }: ResponsiveTableProps) {
  return (
    <div className="overflow-x-auto my-8 rounded-xl border border-[var(--blog-border)]">
      <table className="w-full border-collapse min-w-full">
        {children}
      </table>
    </div>
  );
}
