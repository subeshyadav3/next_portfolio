interface PoemLineProps {
  children?: React.ReactNode;
}

export function PoemLine({ children }: PoemLineProps) {
  return (
    <p
      className="poem-line text-center"
      style={{
        whiteSpace: "pre-line",
        marginBottom: "var(--prose-paragraph-gap)",
      }}
    >
      {children}
    </p>
  );
}
