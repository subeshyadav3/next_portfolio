interface ProseParagraphProps {
  children?: React.ReactNode;
  className?: string;
}

export function ProseParagraph({ children, className }: ProseParagraphProps) {
  return (
    <p
      className={`prose-paragraph ${className || ""}`}
      style={{
        maxWidth: "var(--prose-max-width)",
        textAlign: "left",
        marginBottom: "var(--prose-paragraph-gap)",
      }}
    >
      {children}
    </p>
  );
}
