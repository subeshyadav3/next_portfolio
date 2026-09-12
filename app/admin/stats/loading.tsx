export default function AdminStatsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-96 rounded bg-gray-100 dark:bg-gray-850" />
        </div>
        <div className="h-8 w-60 rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          />
        ))}
      </div>

      <div className="h-64 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="h-96 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900" />
        <div className="h-96 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900" />
      </div>
    </div>
  );
}
