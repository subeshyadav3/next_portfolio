export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
      <div className="h-64 rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" />
    </div>
  );
}
