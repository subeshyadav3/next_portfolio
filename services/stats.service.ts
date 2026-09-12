import { unstable_cache } from "next/cache";
import { prisma } from "@/db/prisma";

export type StatsPeriod = "today" | "week" | "month" | "all";

export interface OverviewMetrics {
  totalViews: number;
  blogViews: number;
  blogPercent: number;
  ioeViews: number;
  ioePercent: number;
  otherViews: number;
  otherPercent: number;
}

export interface DailyTrendPoint {
  date: string;
  shortDate: string;
  blog: number;
  ioe: number;
  other: number;
  total: number;
}

export interface TopPostMetric {
  rank: number;
  title: string;
  slug: string;
  views: number;
  category: string | null;
}

export interface IoeProgramMetric {
  code: string;
  name: string;
  views: number;
  percent: number;
  color: string;
}

export interface IoeAggregates {
  today: number;
  thisWeek: number;
  thisMonth: number;
  allTime: number;
}

export interface AdminStatsData {
  period: StatsPeriod;
  overview: OverviewMetrics;
  trend: DailyTrendPoint[];
  topPosts: TopPostMetric[];
  ioePrograms: IoeProgramMetric[];
  ioeAggregates: IoeAggregates;
}

const PROGRAM_META: Record<string, { name: string; color: string }> = {
  bce: { name: "Civil Engineering (BCE)", color: "emerald" },
  bct: { name: "Computer Engineering (BCT)", color: "blue" },
  bex: { name: "Electronics & Comm. (BEX)", color: "purple" },
  bel: { name: "Electrical Engineering (BEL)", color: "amber" },
  bme: { name: "Mechanical Engineering (BME)", color: "rose" },
  barch: { name: "Architecture (BArch)", color: "teal" },
  portal: { name: "IOE Portal Home", color: "sky" },
  other: { name: "Other Syllabus & Notes", color: "indigo" },
};

async function fetchStatsData(period: StatsPeriod): Promise<AdminStatsData> {
  const now = new Date();
  let since: Date | null = null;
  if (period === "today") {
    since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  } else if (period === "week") {
    since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "month") {
    since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const todaySince = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekSince = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthSince = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Parallel queries to minimize Neon DB round-trips
  const [
    totalCount,
    blogCount,
    ioeCount,
    postViewsAggregate,
    ioeToday,
    ioeWeek,
    ioeMonth,
    ioeAllTime,
    ioePathGroups,
  ] = await Promise.all([
    prisma.pageView.count({
      where: since ? { createdAt: { gte: since } } : undefined,
    }),
    prisma.pageView.count({
      where: {
        slug: { not: null },
        ...(since ? { createdAt: { gte: since } } : {}),
      },
    }),
    prisma.pageView.count({
      where: {
        path: { startsWith: "/ioe" },
        ...(since ? { createdAt: { gte: since } } : {}),
      },
    }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.pageView.count({
      where: { path: { startsWith: "/ioe" }, createdAt: { gte: todaySince } },
    }),
    prisma.pageView.count({
      where: { path: { startsWith: "/ioe" }, createdAt: { gte: weekSince } },
    }),
    prisma.pageView.count({
      where: { path: { startsWith: "/ioe" }, createdAt: { gte: monthSince } },
    }),
    prisma.pageView.count({
      where: { path: { startsWith: "/ioe" } },
    }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: {
        path: { startsWith: "/ioe" },
        ...(since ? { createdAt: { gte: since } } : {}),
      },
      _count: { path: true },
    }),
  ]);

  // Handle all-time lifetime counters vs period PageViews
  let blogViews = blogCount;
  let totalViews = totalCount;
  if (period === "all") {
    const sumPostViews = postViewsAggregate._sum.views ?? 0;
    blogViews = Math.max(sumPostViews, blogCount);
    const otherCount = Math.max(0, totalCount - blogCount - ioeCount);
    totalViews = blogViews + ioeCount + otherCount;
  }

  const otherViews = Math.max(0, totalViews - blogViews - ioeCount);
  const safeTotal = totalViews > 0 ? totalViews : 1;

  const overview: OverviewMetrics = {
    totalViews,
    blogViews,
    blogPercent: Math.round((blogViews / safeTotal) * 100),
    ioeViews: ioeCount,
    ioePercent: Math.round((ioeCount / safeTotal) * 100),
    otherViews,
    otherPercent: Math.round((otherViews / safeTotal) * 100),
  };

  // Build IOE Program Breakdown
  const programCounts: Record<string, number> = {
    bce: 0,
    bct: 0,
    bex: 0,
    bel: 0,
    bme: 0,
    barch: 0,
    portal: 0,
    other: 0,
  };

  for (const item of ioePathGroups) {
    const p = item.path.toLowerCase();
    const count = item._count.path;
    if (p === "/ioe" || p === "/ioe/") {
      programCounts.portal += count;
    } else if (p.startsWith("/ioe/bce")) {
      programCounts.bce += count;
    } else if (p.startsWith("/ioe/bct")) {
      programCounts.bct += count;
    } else if (p.startsWith("/ioe/bex")) {
      programCounts.bex += count;
    } else if (p.startsWith("/ioe/bel")) {
      programCounts.bel += count;
    } else if (p.startsWith("/ioe/bme")) {
      programCounts.bme += count;
    } else if (p.startsWith("/ioe/barch")) {
      programCounts.barch += count;
    } else {
      programCounts.other += count;
    }
  }

  const safeIoe = ioeCount > 0 ? ioeCount : 1;
  const ioePrograms: IoeProgramMetric[] = Object.entries(programCounts)
    .map(([code, views]) => ({
      code,
      name: PROGRAM_META[code]?.name ?? code.toUpperCase(),
      views,
      percent: Math.round((views / safeIoe) * 100),
      color: PROGRAM_META[code]?.color ?? "gray",
    }))
    .sort((a, b) => b.views - a.views)
    .filter((p) => p.views > 0);

  // Top Blog Posts
  let topPosts: TopPostMetric[] = [];
  if (period === "all") {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        category: { select: { name: true } },
      },
    });

    topPosts = posts.map((p, idx) => ({
      rank: idx + 1,
      title: p.title,
      slug: p.slug,
      views: p.views,
      category: p.category?.name ?? null,
    }));
  } else {
    const topSlugs = await prisma.pageView.groupBy({
      by: ["slug"],
      where: {
        slug: { not: null },
        ...(since ? { createdAt: { gte: since } } : {}),
      },
      _count: { slug: true },
      orderBy: { _count: { slug: "desc" } },
      take: 10,
    });

    const slugs = topSlugs.map((s) => s.slug).filter(Boolean) as string[];
    if (slugs.length > 0) {
      const postDetails = await prisma.post.findMany({
        where: { slug: { in: slugs } },
        select: {
          slug: true,
          title: true,
          category: { select: { name: true } },
        },
      });

      const detailMap = new Map(postDetails.map((p) => [p.slug, p]));
      topPosts = topSlugs.map((item, idx) => {
        const slug = item.slug!;
        const detail = detailMap.get(slug);
        return {
          rank: idx + 1,
          title: detail?.title ?? slug,
          slug,
          views: item._count.slug,
          category: detail?.category?.name ?? null,
        };
      });
    }
  }

  // Daily Trend (Past 7 days for today/week, past 14 days for month/all)
  const trendDaysCount = period === "month" || period === "all" ? 14 : 7;
  const trendSince = new Date(now.getTime() - trendDaysCount * 24 * 60 * 60 * 1000);

  const recentViews = await prisma.pageView.findMany({
    where: { createdAt: { gte: trendSince } },
    select: {
      createdAt: true,
      path: true,
      slug: true,
    },
    take: 5000,
  });

  // Aggregate by day string YYYY-MM-DD
  const daysMap = new Map<string, { blog: number; ioe: number; other: number; total: number; dateObj: Date }>();

  for (let i = trendDaysCount - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    daysMap.set(key, { blog: 0, ioe: 0, other: 0, total: 0, dateObj: d });
  }

  for (const v of recentViews) {
    const key = v.createdAt.toISOString().split("T")[0];
    const bucket = daysMap.get(key);
    if (bucket) {
      bucket.total++;
      if (v.slug) {
        bucket.blog++;
      } else if (v.path.startsWith("/ioe")) {
        bucket.ioe++;
      } else {
        bucket.other++;
      }
    }
  }

  const trend: DailyTrendPoint[] = Array.from(daysMap.entries()).map(([key, data]) => {
    const d = data.dateObj;
    const shortDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return {
      date: key,
      shortDate,
      blog: data.blog,
      ioe: data.ioe,
      other: data.other,
      total: data.total,
    };
  });

  return {
    period,
    overview,
    trend,
    topPosts,
    ioePrograms,
    ioeAggregates: {
      today: ioeToday,
      thisWeek: ioeWeek,
      thisMonth: ioeMonth,
      allTime: ioeAllTime,
    },
  };
}

export async function getAdminStats(period: StatsPeriod = "all"): Promise<AdminStatsData> {
  try {
    const cachedFn = unstable_cache(
      () => fetchStatsData(period),
      [`admin:stats:${period}`],
      { revalidate: 60, tags: ["admin:stats"] }
    );
    return await cachedFn();
  } catch {
    return fetchStatsData(period);
  }
}
