"use client";

import { useState } from "react";
import { deleteMediaAction } from "@/actions/media";

interface MediaCardProps {
  id: string;
  publicId: string;
  secureUrl: string;
  width: number | null;
  height: number | null;
  bytes: number | null;
}

export function MediaCard({ id, publicId, secureUrl, width, height, bytes }: MediaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(secureUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={secureUrl}
          alt={publicId}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {publicId}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {width}x{height} &middot;{" "}
          {bytes ? `${(bytes / 1024).toFixed(1)} KB` : "—"}
        </p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleCopy}
            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {copied ? "Copied!" : "Copy URL"}
          </button>
          <form
            action={deleteMediaAction.bind(null, id)}
            onSubmit={(e) => {
              if (!confirm("Delete this media?")) e.preventDefault();
            }}
          >
            <button
              type="submit"
              className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
