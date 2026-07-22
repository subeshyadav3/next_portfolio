"use client";

import { useState } from "react";

interface CaptionedImageProps {
  src?: string;
  alt?: string;
  title?: string;
}

export function CaptionedImage({ src, alt, title }: CaptionedImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <figure className="captioned-image my-8" style={{ margin: "2rem 0" }}>
        <div
          className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--blog-surface)]"
          style={{ minHeight: "200px" }}
        >
          <div className="flex flex-col items-center gap-2 p-4 text-center text-[var(--blog-text-muted)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            <span className="text-sm">{alt || "Image unavailable"}</span>
          </div>
        </div>
        {title && (
          <figcaption className="mt-2 text-center text-sm text-[var(--blog-text-muted)]">
            {title}
          </figcaption>
        )}
      </figure>
    );
  }

  const caption = title;

  return (
    <figure className="captioned-image my-8" style={{ margin: "2rem 0" }}>
      <div className="relative w-full overflow-hidden rounded-xl bg-[var(--blog-surface)]" style={{ minHeight: "300px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ""}
          className="h-full w-full object-contain"
          onError={() => setError(true)}
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
