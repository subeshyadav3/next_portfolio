import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  YouTube                                                                   */
/* -------------------------------------------------------------------------- */

interface YouTubeProps { id: string; title?: string; start?: number; }

export function YouTube({ id, title, start }: YouTubeProps) {
  const params = new URLSearchParams();
  if (start) params.set("start", String(start));
  params.set("rel", "0");
  const src = `https://www.youtube-nocookie.com/embed/${id}${params.toString() ? `?${params}` : ""}`;

  return (
    <figure className="my-6 not-prose">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-sm">
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

interface PdfEmbedProps { src: string; title?: string; height?: number; }

export function PdfEmbed({ src, title, height = 800 }: PdfEmbedProps) {
  const viewerSrc = `/pdf-viewer?url=${encodeURIComponent(src)}`;

  return (
    <figure className="my-6 not-prose">
      <div className="overflow-hidden rounded-lg border border-[var(--blog-border)] bg-[var(--blog-surface)] shadow-sm">
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

interface DownloadButtonProps { href: string; children: ReactNode; filename?: string; }

export function DownloadButton({ href, children, filename }: DownloadButtonProps) {
  return (
    <div className="not-prose my-8 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        {/* Icon */}
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--blog-accent)]/10"
          aria-hidden="true"
        >
          <svg
            className="h-7 w-7 text-[var(--blog-accent)]"
            fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 10v6m0 0l-3-3m3 3l3-3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
        </div>

        {/* Label */}
        <div className="flex-1">
          <div className="font-semibold text-[var(--blog-text)]">{children}</div>
          {filename && (
            <div className="mt-0.5 text-sm text-[var(--blog-text-muted)]">{filename}</div>
          )}
        </div>

        {/* Button */}
        <a
          href={href}
          download={filename || true}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--blog-accent)] px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:opacity-90 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blog-accent)] focus-visible:ring-offset-2"
          // Inline color overrides `.blog-prose a { color: var(--blog-accent) }` which would otherwise make the white text invisible on the accent background.
          style={{ color: "white", textDecoration: "none" }}
        >
          <svg
            className="h-4 w-4"
            fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 3v12" />
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
  publicId:   string;
  alt:        string;
  width?:     number;
  height?:    number;
  transforms?: string;
  caption?:   string;
  className?: string;
  /** Pass true for the first/hero image on a page to load it eagerly */
  priority?:  boolean;
}

export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  transforms = "f_auto,q_auto",
  caption,
  className,
  priority = false,
}: CloudinaryImageProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const imgProps = {
    alt: alt?.trim() || "Blog image",
    width,
    height,
    loading:   priority ? ("eager"  as const) : ("lazy"  as const),
    decoding:  priority ? ("sync"   as const) : ("async" as const),
    fetchPriority: priority ? ("high" as "high" | "low" | "auto") : undefined,
    style: width && height ? { aspectRatio: `${width}/${height}` } : undefined,
    className: `w-full rounded-lg shadow-sm ${className ?? ""}`,
  };

  if (!cloudName) {
    return (
      <figure className="my-6 not-prose">
        <img src={publicId} {...imgProps} />
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
      <img src={url} {...imgProps} />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[var(--blog-text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
