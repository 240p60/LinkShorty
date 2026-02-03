import { PrismaClient } from "@prisma/client";
import { cacheLink, getCachedLink, recordClick } from "@services/index";
import type { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * Redirect to original URL and record click
 * GET /:shortCode
 */
export async function handleRedirect(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { shortCode } = req.params;

    // Try to get from cache first
    let linkData = await getCachedLink(shortCode);

    if (!linkData) {
      // Cache miss - get from database
      const link = await prisma.link.findUnique({
        where: { shortCode },
        select: { originalUrl: true },
      });

      if (!link) {
        res.status(404).json({
          error: "Ссылка не найдена",
        });
        return;
      }

      linkData = { originalUrl: link.originalUrl };

      // Cache for next time
      await cacheLink(shortCode, linkData);
    }

    // Record click asynchronously (don't wait for it)
    recordClick(shortCode, req).catch((err: Error) => {
      console.error("Error recording click:", err.message);
    });

    // Redirect to original URL
    res.redirect(302, linkData.originalUrl);
  } catch (error) {
    next(error);
  }
}
