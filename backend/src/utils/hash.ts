import crypto from "node:crypto";

/**
 * Hash an IP address for GDPR compliance
 * Uses SHA-256 with a daily rotating salt
 */
export function hashIp(ip: string): string {
  const date = new Date().toISOString().split("T")[0]; // Daily rotation
  const salt = process.env.IP_HASH_SALT || "default-salt";
  return crypto.createHash("sha256").update(`${ip}:${salt}:${date}`).digest("hex").substring(0, 32);
}

/**
 * Generate a random string
 */
export function randomString(length = 16): string {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
}
