import type { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { Click } from "@models/click.model";
import { hashIp } from "@utils/hash";
import { hasIpVisited, markIpVisited, invalidateLinkCache } from "./cache.service";

const prisma = new PrismaClient();

interface ClickRecordResult {
  isUnique: boolean;
}

interface ClickDocument {
  timestamp: Date;
  referrer: string | null;
  userAgent: string | null;
  isUnique: boolean;
}

interface ClicksResponse {
  clicks: {
    timestamp: string;
    referrer: string | null;
    user_agent: string | null;
    is_unique: boolean;
  }[];
  total: number;
  limit: number;
  offset: number;
}

interface ChartDataPoint {
  date: string;
  clicks: number;
}

interface GetClicksOptions {
  limit?: number;
  offset?: number;
}

/**
 * Record a click event
 */
export async function recordClick(shortCode: string, req: Request): Promise<ClickRecordResult> {
  const ip = req.ip || "unknown";
  const ipHash = hashIp(ip);
  const userAgent = req.get("user-agent") || null;
  const referrer = req.get("referer") || null;

  // Check if this is a unique click (using Redis for fast lookup)
  let isUnique = !(await hasIpVisited(shortCode, ipHash));

  // If Redis wasn't available, check MongoDB
  if (isUnique) {
    const existingClick = await Click.findOne({ shortCode, ipHash });
    isUnique = !existingClick;
  }

  // Record click in MongoDB
  const click = new Click({
    shortCode,
    ipHash,
    userAgent,
    referrer,
    isUnique,
    timestamp: new Date(),
  });
  await click.save();

  // Update PostgreSQL counters
  await prisma.link.update({
    where: { shortCode },
    data: {
      totalClicks: { increment: 1 },
      ...(isUnique && { uniqueClicks: { increment: 1 } }),
    },
  });

  // Mark IP as visited in cache
  if (isUnique) {
    await markIpVisited(shortCode, ipHash);
  }

  // Invalidate link cache to reflect new click counts
  await invalidateLinkCache(shortCode);

  return { isUnique };
}

/**
 * Get clicks for a link with pagination
 */
export async function getClicksForLink(
  shortCode: string,
  options: GetClicksOptions = {}
): Promise<ClicksResponse> {
  const { limit = 50, offset = 0 } = options;

  const clicks = (await Click.find({ shortCode })
    .sort({ timestamp: -1 })
    .skip(offset)
    .limit(limit)
    .lean()) as ClickDocument[];

  const total = await Click.countDocuments({ shortCode });

  return {
    clicks: clicks.map((click) => ({
      timestamp: click.timestamp.toISOString(),
      referrer: click.referrer,
      user_agent: click.userAgent,
      is_unique: click.isUnique,
    })),
    total,
    limit,
    offset,
  };
}

/**
 * Get clicks aggregated by day for the last N days
 */
export async function getClicksOverTime(
  shortCode: string,
  days: number = 7
): Promise<ChartDataPoint[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const pipeline = [
    {
      $match: {
        shortCode,
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
        },
        clicks: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 as const },
    },
  ];

  const aggregated = (await Click.aggregate(pipeline)) as { _id: string; clicks: number }[];

  // Fill in missing days with 0 clicks
  const result: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const found = aggregated.find((a) => a._id === dateStr);

    result.push({
      date: date.toLocaleDateString("ru-RU", { month: "short", day: "numeric" }),
      clicks: found ? found.clicks : 0,
    });
  }

  return result;
}

/**
 * Delete all clicks for a link
 */
export async function deleteClicksForLink(shortCode: string): Promise<void> {
  await Click.deleteMany({ shortCode });
}
