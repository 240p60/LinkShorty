import type { Request, Response, NextFunction } from "express";
import { isValidUrl, sanitizeUrl, isValidShortCode } from "@utils/validators";

/**
 * Middleware to validate URL in request body
 */
export function validateUrlMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { original_url } = req.body as { original_url?: string };

  if (!original_url) {
    res.status(400).json({
      error: "URL обязателен",
    });
    return;
  }

  const sanitized = sanitizeUrl(original_url);

  if (!sanitized || !isValidUrl(sanitized)) {
    res.status(400).json({
      error: "Неверный формат URL. URL должен начинаться с http:// или https://",
    });
    return;
  }

  // Store sanitized URL in request
  req.sanitizedUrl = sanitized;
  next();
}

/**
 * Middleware to validate custom short code (optional)
 */
export function validateCustomCode(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { custom_code } = req.body as { custom_code?: string };

  if (custom_code) {
    if (!isValidShortCode(custom_code)) {
      res.status(400).json({
        error:
          "Неверный формат кода. Код должен содержать только буквы, цифры и дефисы (3-20 символов)",
      });
      return;
    }
    req.customCode = custom_code;
  }

  next();
}

/**
 * Middleware to validate short code in URL params
 */
export function validateShortCodeParam(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { shortCode } = req.params;

  if (!shortCode || !isValidShortCode(shortCode)) {
    res.status(400).json({
      error: "Неверный формат короткого кода",
    });
    return;
  }

  next();
}
