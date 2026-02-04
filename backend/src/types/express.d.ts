import "express";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface AuthenticatedUser {
  id: string;
  telegramId: bigint;
  username: string | null;
  firstName: string;
  lastName: string | null;
}

declare module "express" {
  interface Request {
    sanitizedUrl?: string;
    customCode?: string;
    telegramUser?: TelegramUser;
    user?: AuthenticatedUser;
  }
}
