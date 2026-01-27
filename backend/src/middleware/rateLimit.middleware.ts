import rateLimit from "express-rate-limit";

/**
 * Rate limiter for API endpoints
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number.parseInt(process.env.RATE_LIMIT_MAX || "100", 10), // limit each IP
  message: {
    error: "Слишком много запросов. Пожалуйста, попробуйте позже.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Stricter rate limiter for link creation
 */
export const createLinkLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 links per hour per IP
  message: {
    error: "Достигнут лимит создания ссылок. Попробуйте через час.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Relaxed rate limiter for redirects
 */
export const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // 300 redirects per minute per IP
  message: {
    error: "Слишком много запросов",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
