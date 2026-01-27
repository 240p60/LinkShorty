import Redis from "ioredis";

let redis: Redis | null = null;

export interface LinkData {
  originalUrl: string;
}

/**
 * Initialize Redis connection
 */
export function initRedis(): Promise<void> {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  redis.on("error", (err: Error) => {
    console.error("Redis connection error:", err.message);
  });

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  return redis.connect().catch((err: Error) => {
    console.warn("Redis connection failed, caching disabled:", err.message);
    redis = null;
  });
}

/**
 * Get Redis client (may be null if connection failed)
 */
export function getRedis(): Redis | null {
  return redis;
}

/**
 * Cache key prefixes
 */
const CACHE_KEYS = {
  LINK: "link:",
  UNIQUE_IPS: "unique_ips:",
} as const;

/**
 * Cache TTL values (in seconds)
 */
const CACHE_TTL = {
  LINK: 3600, // 1 hour
  UNIQUE_IPS: 86400, // 24 hours
} as const;

/**
 * Get cached link by short code
 */
export async function getCachedLink(shortCode: string): Promise<LinkData | null> {
  if (!redis) return null;

  try {
    const cached = await redis.get(CACHE_KEYS.LINK + shortCode);
    return cached ? (JSON.parse(cached) as LinkData) : null;
  } catch {
    return null;
  }
}

/**
 * Cache link data
 */
export async function cacheLink(shortCode: string, linkData: LinkData): Promise<void> {
  if (!redis) return;

  try {
    await redis.setex(CACHE_KEYS.LINK + shortCode, CACHE_TTL.LINK, JSON.stringify(linkData));
  } catch (err) {
    console.error("Cache write error:", (err as Error).message);
  }
}

/**
 * Invalidate link cache
 */
export async function invalidateLinkCache(shortCode: string): Promise<void> {
  if (!redis) return;

  try {
    await redis.del(CACHE_KEYS.LINK + shortCode);
  } catch (err) {
    console.error("Cache invalidation error:", (err as Error).message);
  }
}

/**
 * Check if IP has visited this link before (for unique click tracking)
 */
export async function hasIpVisited(shortCode: string, ipHash: string): Promise<boolean> {
  if (!redis) return false;

  try {
    const key = CACHE_KEYS.UNIQUE_IPS + shortCode;
    return (await redis.sismember(key, ipHash)) === 1;
  } catch {
    return false;
  }
}

/**
 * Mark IP as having visited this link
 */
export async function markIpVisited(shortCode: string, ipHash: string): Promise<void> {
  if (!redis) return;

  try {
    const key = CACHE_KEYS.UNIQUE_IPS + shortCode;
    await redis.sadd(key, ipHash);
    await redis.expire(key, CACHE_TTL.UNIQUE_IPS);
  } catch (err) {
    console.error("Cache IP marking error:", (err as Error).message);
  }
}
