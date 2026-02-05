import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { TelegramUser } from "../types/express";

const prisma = new PrismaClient();

/**
 * Validates Telegram Mini App initData using HMAC-SHA256
 * @param initData - The raw initData string from Telegram
 * @param botToken - The bot token for validation
 * @returns true if valid, false otherwise
 */
function validateInitData(initData: string, botToken: string): boolean {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");

    if (!hash) {
      return false;
    }

    // Remove hash from params and sort alphabetically
    params.delete("hash");
    const dataCheckArr: string[] = [];

    params.forEach((value, key) => {
      dataCheckArr.push(`${key}=${value}`);
    });

    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join("\n");

    // Create secret key using HMAC-SHA256 with "WebAppData" as key
    const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    return calculatedHash === hash;
  } catch {
    return false;
  }
}

/**
 * Parses user data from initData string
 * @param initData - The raw initData string from Telegram
 * @returns TelegramUser object or null if parsing fails
 */
function parseUserFromInitData(initData: string): TelegramUser | null {
  try {
    const params = new URLSearchParams(initData);
    const userParam = params.get("user");

    if (!userParam) {
      return null;
    }

    const user = JSON.parse(userParam) as TelegramUser;

    if (!user.id || !user.first_name) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Authentication middleware for Telegram Mini App
 * Parses Authorization: tma <initData> header
 * Validates initData using HMAC-SHA256 with bot token
 * Extracts user info and attaches to request
 * Creates/updates user in database (upsert)
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: "Требуется авторизация",
      });
      return;
    }

    // Parse "tma <initData>" format
    const [scheme, initData] = authHeader.split(" ", 2);

    if (scheme?.toLowerCase() !== "tma" || !initData) {
      res.status(401).json({
        error: "Неверный формат авторизации. Ожидается: tma <initData>",
      });
      return;
    }

    // Get bot token from environment
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      console.error("TELEGRAM_BOT_TOKEN is not configured");
      res.status(500).json({
        error: "Ошибка конфигурации сервера",
      });
      return;
    }

    // Validate initData
    if (!validateInitData(initData, botToken)) {
      res.status(401).json({
        error: "Недействительные данные авторизации",
      });
      return;
    }

    // Parse user from initData
    const telegramUser = parseUserFromInitData(initData);

    if (!telegramUser) {
      res.status(401).json({
        error: "Не удалось получить данные пользователя",
      });
      return;
    }

    // Attach telegram user to request
    req.telegramUser = telegramUser;

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: {
        telegramId: BigInt(telegramUser.id),
      },
      update: {
        username: telegramUser.username || null,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name || null,
      },
      create: {
        id: crypto.randomUUID(),
        telegramId: BigInt(telegramUser.id),
        username: telegramUser.username || null,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name || null,
      },
    });

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      error: "Ошибка авторизации",
    });
  }
}

/**
 * Optional authentication middleware
 * Same as authMiddleware but allows unauthenticated requests
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  // If auth header is present, validate it
  await authMiddleware(req, res, next);
}
