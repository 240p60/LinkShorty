/**
 * Shared utility functions
 * Utilities used across both frontend and backend
 */

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format a number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Truncate a string to a certain length
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
};

/**
 * Check if a URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
