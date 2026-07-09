import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  YouTube                                                                   */
/* -------------------------------------------------------------------------- */

interface YouTubeProps {
  id: string;
  title?: string;
  start?: number;
}

export function YouTube({ id, title, start }: YouTubeProps) {
  const params = new URLSearchParams();
  if (start) params.set("start", String(start));
  params.set("rel", "0");
  const src = `https://www.youtube-nocookie.com/embed/${id}${params.toString() ? `?${params}` : ""}`;
  return (
    <figure className="my-6 not-prose">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={src}
          title={title ?? "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {title && (
        <figcaption className="mt-2 text-center text-sm text-[var(--blog-text-muted)]">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  PdfEmbed                                                                  */
/* -------------------------------------------------------------------------- */

interface PdfEmbedProps {
  src: string;
  title?: string;
  height?: number;
}

export function PdfEmbed({ src, title, height = 800 }: PdfEmbedProps) {
  return (
    <figure className="my-6 not-prose">
      <div className="overflow-hidden rounded-lg border border-[var(--blog-border)] bg-[var(--blog-surface)]">
        <iframe
          src={src}
          title={title ?? "PDF document"}
          style={{ width: "100%", height: `${height}px`, border: 0 }}
          loading="lazy"
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-[var(--blog-text-muted)]">{title ?? "PDF document"}</span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--blog-accent)] hover:underline"
        >
          Download ↓
        </a>
      </div>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  DownloadButton                                                            */
/* -------------------------------------------------------------------------- */

interface DownloadButtonProps {
  href: string;
  children: ReactNode;
  filename?: string;
}

export function DownloadButton({ href, children, filename }: DownloadButtonProps) {
  return (
    <a
      href={href}
      download={filename}
      className="my-4 inline-flex items-center gap-2 rounded-lg bg-[var(--blog-accent)] px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 not-prose"
    >
      {children}
      <span aria-hidden>↓</span>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*  CloudinaryImage                                                           */
/* -------------------------------------------------------------------------- */

interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  /** Cloudinary transforms (e.g. "w_800,c_fill,q_auto,f_auto") */
  transforms?: string;
  caption?: string;
  className?: string;
}

/**
 * Renders a Cloudinary-hosted image with sensible defaults. The base URL
 * is read from NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.
 */
export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  transforms = "f_auto,q_auto",
  caption,
  className,
}: CloudinaryImageProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    // Fallback to plain <img> when not configured
    return (
      <figure className="my-6 not-prose">
        <img src={publicId} alt={alt} className={`w-full rounded-lg ${className ?? ""}`} />
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-[var(--blog-text-muted)]">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }
  const url = `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`;
  return (
    <figure className="my-6 not-prose">
      <img
        src={url}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={`w-full rounded-lg ${className ?? ""}`}
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[var(--blog-text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
