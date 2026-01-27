/**
 * Shared TypeScript types/interfaces
 * Types used across both frontend and backend
 */

export interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  createdAt: Date;
  expiresAt?: Date;
  clicks: number;
  isActive: boolean;
}

export interface Click {
  id: string;
  linkId: string;
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
  country?: string;
  city?: string;
}

export interface User {
  id: string;
  telegramId: string;
  username?: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
