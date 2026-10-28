"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminStatsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AdminStatsError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        Unable to load Stats Analytics
      </h2>
      <p className="mt-1.5 max-w-md text-xs text-gray-500 dark:text-gray-400">
        The database server (Neon PostgreSQL) is unreachable or has exceeded its project usage limits.
      </p>
      {error.message && (
        <p className="mt-3 max-w-lg rounded-lg bg-gray-50 p-2 font-mono text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-300 break-all">
          {error.message}
        </p>
      )}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry Loading
      </button>
    </div>
  );
}
