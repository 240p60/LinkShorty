// Short code generation utility

const CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

export function generateShortCode(length = 7): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return result;
}

export function buildShortUrl(shortCode: string, baseUrl = "https://short.link"): string {
  return `${baseUrl}/${shortCode}`;
}
