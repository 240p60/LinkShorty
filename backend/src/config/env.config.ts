import "dotenv/config";

export const config = {
  // Application settings
  app: {
    port: Number.parseInt(process.env.PORT || "3000", 10),
    env: process.env.NODE_ENV || "development",
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
  },

  // Telegram Bot settings
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    webhookUrl: process.env.TELEGRAM_WEBHOOK_URL,
  },

  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
} as const;

export type AppConfig = typeof config;
