import Image from "next/image";

interface CaptionedImageProps {
  src?: string;
  alt?: string;
  title?: string;
}

export function CaptionedImage({ src, alt, title }: CaptionedImageProps) {
  if (!src) return null;

  const caption = title;

  return (
    <figure className="captioned-image my-8" style={{ margin: "2rem 0" }}>
      <div className="relative w-full overflow-hidden rounded-xl bg-[var(--blog-surface)]" style={{ minHeight: "300px" }}>
        <Image
          src={src}
          alt={alt || ""}
          fill
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-contain"
          unoptimized={src.startsWith("http")}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[var(--blog-text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
