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
  const viewerSrc = `/pdf-viewer?url=${encodeURIComponent(src)}`;
  return (
    <figure className="my-6 not-prose">
      <div className="overflow-hidden rounded-lg border border-[var(--blog-border)] bg-[var(--blog-surface)]">
        <iframe
          src={viewerSrc}
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
    <div className="not-prose my-8 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-4 sm:p-6">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--blog-accent)]/10">
          <svg
            className="h-7 w-7 text-[var(--blog-accent)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10v6m0 0l-3-3m3 3l3-3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-[var(--blog-text)]">{children}</div>
          {filename && (
            <div className="mt-0.5 text-sm text-[var(--blog-text-muted)]">{filename}</div>
          )}
        </div>
        <a
          href={href}
          download={filename || true}
          style={{ color: "#fff", textDecoration: "none" }}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--blog-accent)] px-6 py-3 text-sm font-bold shadow transition-all hover:opacity-90 hover:shadow-md"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 3v12" />
          </svg>
          Download
        </a>
      </div>
    </div>
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
