import "express";

declare module "express" {
  interface Request {
    sanitizedUrl?: string;
    customCode?: string;
  }
}
