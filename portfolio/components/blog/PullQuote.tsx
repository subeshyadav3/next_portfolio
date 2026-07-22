interface PullQuoteProps {
  children?: React.ReactNode;
  color?: string;
}

export function PullQuote({ children, color }: PullQuoteProps) {
  return (
    <blockquote
      className="pull-quote"
      style={{
        borderLeftWidth: "3px",
        borderLeftStyle: "solid",
        borderLeftColor: color || "var(--blog-accent)",
        paddingLeft: "1.5rem",
        fontStyle: "italic",
        fontSize: "1.25em",
        lineHeight: "var(--prose-line-height)",
        margin: "2rem 0",
      }}
    >
      {children}
    </blockquote>
  );
}
