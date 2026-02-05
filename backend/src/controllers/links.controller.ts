import { PrismaClient } from "@prisma/client";
import {
  buildShortUrl,
  cacheLink,
  deleteClicksForLink,
  generateUniqueShortCode,
  getClicksForLink,
  getClicksOverTime,
  invalidateLinkCache,
} from "@services/index";
import type { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * Create a new short link
 * POST /api/links
 */
export async function createLink(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }
    if (!req.sanitizedUrl) {
      res.status(400).json({ error: "URL обязателен" });
      return;
    }
    const originalUrl = req.sanitizedUrl;
    const customCode = req.customCode;

    // Generate unique short code
    const shortCode = await generateUniqueShortCode(customCode);

    // Create link in database
    const link = await prisma.link.create({
      data: {
        shortCode,
        originalUrl,
        userId: req.user.id,
      },
    });

    // Cache the new link
    await cacheLink(shortCode, { originalUrl });

    res.status(201).json({
      id: link.id,
      short_code: link.shortCode,
      short_url: buildShortUrl(link.shortCode),
      original_url: link.originalUrl,
      created_at: link.createdAt.toISOString(),
      total_clicks: link.totalClicks,
      unique_clicks: link.uniqueClicks,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all links (with pagination)
 * GET /api/links
 */
export async function getAllLinks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }
    const limit = Math.min(Number.parseInt(req.query.limit as string, 10) || 50, 100);
    const offset = Number.parseInt(req.query.offset as string, 10) || 0;

    const [links, total] = await Promise.all([
      prisma.link.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.link.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      links: links.map((link) => ({
        id: link.id,
        short_code: link.shortCode,
        short_url: buildShortUrl(link.shortCode),
        original_url: link.originalUrl,
        created_at: link.createdAt.toISOString(),
        total_clicks: link.totalClicks,
        unique_clicks: link.uniqueClicks,
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single link by short code
 * GET /api/links/:shortCode
 */
export async function getLink(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }
    const { shortCode } = req.params;

    const link = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (!link || link.userId !== req.user.id) {
      res.status(404).json({
        error: "Ссылка не найдена",
      });
      return;
    }

    res.json({
      id: link.id,
      short_code: link.shortCode,
      short_url: buildShortUrl(link.shortCode),
      original_url: link.originalUrl,
      created_at: link.createdAt.toISOString(),
      total_clicks: link.totalClicks,
      unique_clicks: link.uniqueClicks,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a link
 * DELETE /api/links/:shortCode
 */
export async function deleteLink(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }
    const { shortCode } = req.params;

    // Verify link exists and belongs to user
    const link = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (!link || link.userId !== req.user.id) {
      res.status(404).json({ error: "Ссылка не найдена" });
      return;
    }

    // Delete link from PostgreSQL
    await prisma.link.delete({
      where: { shortCode },
    });

    // Delete all clicks from MongoDB
    await deleteClicksForLink(shortCode);

    // Invalidate cache
    await invalidateLinkCache(shortCode);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Get clicks for a link
 * GET /api/links/:shortCode/clicks
 */
export async function getLinkClicks(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }
    const { shortCode } = req.params;
    const limit = Math.min(Number.parseInt(req.query.limit as string, 10) || 50, 100);
    const offset = Number.parseInt(req.query.offset as string, 10) || 0;

    // Verify link exists and belongs to user
    const link = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (!link || link.userId !== req.user.id) {
      res.status(404).json({
        error: "Ссылка не найдена",
      });
      return;
    }

    const clicksData = await getClicksForLink(shortCode, { limit, offset });
    res.json(clicksData);
  } catch (error) {
    next(error);
  }
}

/**
 * Get clicks over time for a link
 * GET /api/links/:shortCode/stats
 */
export async function getLinkStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }
    const { shortCode } = req.params;
    const days = Math.min(Number.parseInt(req.query.days as string, 10) || 7, 30);

    // Verify link exists and belongs to user
    const link = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (!link || link.userId !== req.user.id) {
      res.status(404).json({
        error: "Ссылка не найдена",
      });
      return;
    }

    const chartData = await getClicksOverTime(shortCode, days);

    res.json({
      link: {
        id: link.id,
        short_code: link.shortCode,
        short_url: buildShortUrl(link.shortCode),
        original_url: link.originalUrl,
        created_at: link.createdAt.toISOString(),
        total_clicks: link.totalClicks,
        unique_clicks: link.uniqueClicks,
      },
      chart_data: chartData,
    });
  } catch (error) {
    next(error);
  }
}
