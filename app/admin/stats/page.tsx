import Link from "next/link";
import {
  Eye,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Globe,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Layers,
  Cpu,
  Building2,
  Zap,
} from "lucide-react";
import { getAdminStats, StatsPeriod } from "@/services/stats.service";

interface PageProps {
  searchParams: Promise<{ period?: string; tab?: string }>;
}

export const metadata = {
  title: "Traffic & Views Stats | Admin",
  description: "Aggregated views and analytics for Blog and IOE",
};

export default async function AdminStatsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const period: StatsPeriod =
    sp.period === "today" || sp.period === "week" || sp.period === "month" || sp.period === "all"
      ? sp.period
      : "all";

  const tab = sp.tab === "blog" || sp.tab === "ioe" ? sp.tab : "all";

  const stats = await getAdminStats(period);
  const { overview, trend, topPosts, ioePrograms, ioeAggregates } = stats;

  const maxDailyViews = Math.max(1, ...trend.map((t) => t.total));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Traffic & Views Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Resource-optimized stats for Blog posts and IOE portal (aggregated to save Neon Tech DB compute).
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="inline-flex rounded-lg bg-gray-100 p-1 text-xs font-medium dark:bg-gray-800">
          {(
            [
              { id: "today", label: "Today (24h)" },
              { id: "week", label: "7 Days" },
              { id: "month", label: "30 Days" },
              { id: "all", label: "All Time" },
            ] as const
          ).map((item) => (
            <Link
              key={item.id}
              href={buildStatsUrl(sp, "period", item.id)}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                period === item.id
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Views */}
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Traffic
            </span>
            <span className="rounded-lg bg-gray-100 p-2 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <Globe className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {overview.totalViews.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {getPeriodLabel(period)}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Across blog, IOE, and portfolio
          </p>
        </div>

        {/* Blog Views */}
        <div className="relative overflow-hidden rounded-xl border border-blue-200/70 bg-white p-5 shadow-sm dark:border-blue-900/50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Blog Views
            </span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <BookOpen className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              {overview.blogViews.toLocaleString()}
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
              {overview.blogPercent}%
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Educational articles & guides
          </p>
        </div>

        {/* IOE Views */}
        <div className="relative overflow-hidden rounded-xl border border-emerald-200/70 bg-white p-5 shadow-sm dark:border-emerald-900/50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              IOE Portal Views
            </span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <GraduationCap className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {overview.ioeViews.toLocaleString()}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              {overview.ioePercent}%
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Curriculum, notes & question banks
          </p>
        </div>

        {/* Other Pages */}
        <div className="relative overflow-hidden rounded-xl border border-purple-200/70 bg-white p-5 shadow-sm dark:border-purple-900/50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Portfolio & Other
            </span>
            <span className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
              {overview.otherViews.toLocaleString()}
            </span>
            <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
              {overview.otherPercent}%
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Home, about & utility pages
          </p>
        </div>
      </div>

      {/* Traffic Distribution & Trend Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Daily Traffic Breakdown (Past {trend.length} Days)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Comparison between Blog readership, IOE Portal visits, and other pages.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">Blog</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-emerald-500" />
              <span className="text-gray-600 dark:text-gray-400">IOE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-purple-400" />
              <span className="text-gray-600 dark:text-gray-400">Other</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="mt-6 flex h-48 items-end gap-2 border-b border-gray-100 pt-8 pb-2 dark:border-gray-800">
          {trend.map((point) => {
            const heightPercent = Math.max(4, Math.round((point.total / maxDailyViews) * 100));
            const blogShare = point.total > 0 ? (point.blog / point.total) * 100 : 0;
            const ioeShare = point.total > 0 ? (point.ioe / point.total) * 100 : 0;
            const otherShare = point.total > 0 ? (point.other / point.total) * 100 : 0;

            return (
              <div
                key={point.date}
                className="group relative flex flex-1 flex-col items-center justify-end h-full"
              >
                {/* Tooltip */}
                <div className="pointer-events-none absolute -top-14 z-20 hidden rounded-md bg-gray-900 px-2.5 py-1.5 text-[11px] text-white shadow-lg group-hover:block dark:bg-gray-800 whitespace-nowrap">
                  <p className="font-semibold">{point.shortDate}</p>
                  <p className="text-blue-300">Blog: {point.blog}</p>
                  <p className="text-emerald-300">IOE: {point.ioe}</p>
                  <p className="text-purple-300">Other: {point.other}</p>
                  <p className="text-gray-300 font-bold border-t border-gray-700 mt-1 pt-0.5">
                    Total: {point.total}
                  </p>
                </div>

                {/* Stacked bar */}
                <div
                  className="w-full max-w-[28px] rounded-t flex flex-col-reverse overflow-hidden transition-all duration-200 group-hover:opacity-90"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div style={{ height: `${blogShare}%` }} className="bg-blue-500 w-full" />
                  <div style={{ height: `${ioeShare}%` }} className="bg-emerald-500 w-full" />
                  <div style={{ height: `${otherShare}%` }} className="bg-purple-400 w-full" />
                </div>

                {/* Date label */}
                <span className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-full">
                  {point.shortDate}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Filter: All, Blog Only, IOE Only */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <Link
          href={buildStatsUrl(sp, "tab", "all")}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "all"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          All Views & Breakdowns
        </Link>
        <Link
          href={buildStatsUrl(sp, "tab", "blog")}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "blog"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Blog Posts Leaderboard
        </Link>
        <Link
          href={buildStatsUrl(sp, "tab", "ioe")}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "ioe"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          IOE Aggregates & Programs
        </Link>
      </div>

      {/* Two Columns Grid: Blog & IOE */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* BLOG STATS SECTION */}
        {(tab === "all" || tab === "blog") && (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Top Visited Blog Posts
                  </h2>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {getPeriodLabel(period)}
                </span>
              </div>

              {topPosts.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No post view records for this period yet.
                </div>
              ) : (
                <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
                  {topPosts.map((post) => (
                    <div
                      key={post.slug}
                      className="flex items-start justify-between py-3.5 gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {post.rank}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <div className="mt-1 flex items-center gap-2">
                            {post.category && (
                              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                {post.category}
                              </span>
                            )}
                            <span className="text-[11px] text-gray-400">/blog/{post.slug}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-bold tabular-nums text-gray-900 dark:text-white">
                            {post.views.toLocaleString()}
                          </span>
                          <span className="block text-[10px] text-gray-400">views</span>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                          title="Open live post"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs text-gray-500">
                <span>View tracking unified under single source</span>
                <Link
                  href="/admin/posts"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Manage all posts &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* IOE STATS SECTION */}
        {(tab === "all" || tab === "ioe") && (
          <div className="space-y-6">
            {/* IOE Timeframe Summary Cards */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    IOE Aggregated Views
                  </h2>
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Cost-Optimized
                </span>
              </div>

              {/* Aggregates Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    Today
                  </span>
                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                    {ioeAggregates.today.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    This Week
                  </span>
                  <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {ioeAggregates.thisWeek.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    This Month
                  </span>
                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                    {ioeAggregates.thisMonth.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    All Time
                  </span>
                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                    {ioeAggregates.allTime.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Engineering Programs Breakdown */}
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Traffic By Engineering Program
                </h3>
                <p className="mt-0.5 text-xs text-gray-400">
                  Aggregated at program level to eliminate expensive per-link queries.
                </p>

                <div className="mt-4 space-y-3">
                  {ioePrograms.length === 0 ? (
                    <p className="text-xs text-gray-500">No program visits recorded yet.</p>
                  ) : (
                    ioePrograms.map((prog) => (
                      <div key={prog.code}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {prog.name}
                          </span>
                          <span className="font-semibold tabular-nums text-gray-700 dark:text-gray-300">
                            {prog.views.toLocaleString()} ({prog.percent}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className={`h-full rounded-full ${getBarColor(prog.code)}`}
                            style={{ width: `${Math.max(2, prog.percent)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Link to IOE manager */}
              <div className="mt-6 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs text-gray-500">
                <span>Direct portal: /ioe</span>
                <Link
                  href="/admin/ioe"
                  className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Manage IOE content &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getPeriodLabel(period: StatsPeriod): string {
  switch (period) {
    case "today":
      return "past 24h";
    case "week":
      return "past 7 days";
    case "month":
      return "past 30 days";
    case "all":
    default:
      return "all time";
  }
}

function getBarColor(code: string): string {
  switch (code) {
    case "bct":
      return "bg-blue-500";
    case "bce":
      return "bg-emerald-500";
    case "bex":
      return "bg-purple-500";
    case "bel":
      return "bg-amber-500";
    case "bme":
      return "bg-rose-500";
    case "barch":
      return "bg-teal-500";
    case "portal":
      return "bg-sky-400";
    default:
      return "bg-indigo-400";
  }
}

function buildStatsUrl(
  sp: Record<string, string | undefined>,
  key: "period" | "tab",
  val: string
) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v && k !== key) params.set(k, v);
  }
  if (val !== "all" || key === "period") {
    params.set(key, val);
  }
  const q = params.toString();
  return q ? `/admin/stats?${q}` : "/admin/stats";
}
