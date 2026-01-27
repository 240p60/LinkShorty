export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_MESSAGES = {
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Access denied",
  VALIDATION_ERROR: "Validation failed",
  INTERNAL_ERROR: "Internal server error",
  RATE_LIMIT_EXCEEDED: "Too many requests, please try again later",
} as const;

export const LINK_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  EXPIRED: "expired",
} as const;

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
export type LinkStatus = (typeof LINK_STATUS)[keyof typeof LINK_STATUS];
export type CacheTtl = (typeof CACHE_TTL)[keyof typeof CACHE_TTL];
