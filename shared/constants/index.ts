/**
 * Shared constants
 * Constants used across both frontend and backend
 */

export const APP_NAME = "Telegram Mini App";

export const LINK_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  EXPIRED: "expired",
} as const;

export const API_ENDPOINTS = {
  LINKS: "/api/links",
  STATS: "/api/stats",
  REDIRECT: "/",
} as const;

export const CACHE_KEYS = {
  LINKS: "links",
  STATS: "stats",
  USER: "user",
} as const;
