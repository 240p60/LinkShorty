import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";

interface AppError extends Error {
  status?: number;
  code?: string;
}

/**
 * Global error handler middleware
 */
export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Handle specific error types
  if (err.name === "ValidationError") {
    res.status(400).json({
      error: "Ошибка валидации",
      details: err.message,
    });
    return;
  }

  if (err.code === "P2025") {
    // Prisma record not found
    res.status(404).json({
      error: "Запись не найдена",
    });
    return;
  }

  if (err.code === "P2002") {
    // Prisma unique constraint violation
    res.status(409).json({
      error: "Такая запись уже существует",
    });
    return;
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.message || "Внутренняя ошибка сервера",
  });
};

/**
 * 404 handler for unknown routes
 */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: "Маршрут не найден",
  });
}
