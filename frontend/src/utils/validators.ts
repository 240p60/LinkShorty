// URL validation utilities

const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export function isValidUrl(url: string): boolean {
  return URL_REGEX.test(url);
}

export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url.trim()) {
    return { valid: false, error: "URL обязателен" };
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return { valid: false, error: "URL должен начинаться с http:// или https://" };
  }

  if (!isValidUrl(url)) {
    return { valid: false, error: "Пожалуйста, введите корректный URL" };
  }

  return { valid: true };
}
