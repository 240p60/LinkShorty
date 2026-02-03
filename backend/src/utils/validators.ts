/**
 * Validate URL format
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validate short code format
 * Only allows alphanumeric characters and hyphens
 */
export function isValidShortCode(code: unknown): boolean {
  if (!code || typeof code !== "string") return false;
  if (code.length < 3 || code.length > 20) return false;
  return /^[a-zA-Z0-9-]+$/.test(code);
}

/**
 * Sanitize URL (basic sanitization)
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // Trim whitespace
  let sanitized = url.trim();
  // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
  sanitized = sanitized.replace(/[\x00-\x1f\x7f]/g, "");
  return sanitized;
}
