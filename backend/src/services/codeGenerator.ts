import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Characters for short code generation (excluding ambiguous characters)
const CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
const DEFAULT_LENGTH = 7;
const MAX_RETRIES = 5;

/**
 * Generate a random short code
 */
function generateCode(length: number = DEFAULT_LENGTH): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return result;
}

/**
 * Generate a unique short code with collision detection
 */
export async function generateUniqueShortCode(customCode?: string): Promise<string> {
  // If custom code provided, check if available
  if (customCode) {
    const existing = await prisma.link.findUnique({
      where: { shortCode: customCode },
    });
    if (existing) {
      const error = new Error("Такой код уже существует");
      (error as Error & { status: number }).status = 409;
      throw error;
    }
    return customCode;
  }

  // Generate random code with collision retry
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const code = generateCode();
    const existing = await prisma.link.findUnique({
      where: { shortCode: code },
    });
    if (!existing) {
      return code;
    }
  }

  // If all retries failed, try with longer code
  const longerCode = generateCode(DEFAULT_LENGTH + 2);
  return longerCode;
}

/**
 * Build full short URL from code
 */
export function buildShortUrl(shortCode: string): string {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return `${baseUrl}/${shortCode}`;
}
