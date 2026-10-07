"use client";

import { useState } from "react";
import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/blog/${slug}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const shareLinks = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: Facebook,
    },
    {
      name: "Twitter / X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      icon: Twitter,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: Linkedin,
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--blog-border)]">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--blog-text-muted)]">
        Share this article
      </span>
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] text-[var(--blog-text-secondary)] transition-all hover:border-[var(--blog-accent)] hover:bg-[var(--blog-accent)]/10 hover:text-[var(--blog-accent)]"
          >
            <link.icon className="h-4 w-4" />
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy article link"
          className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-all ${
            copied
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
              : "border-[var(--blog-border)] bg-[var(--blog-surface)] text-[var(--blog-text-secondary)] hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)]"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="h-3.5 w-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
