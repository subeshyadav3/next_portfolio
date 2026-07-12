export default function EditPostLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-4 space-y-3">
              <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-40 w-full rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
        <div className="h-10 w-32 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
