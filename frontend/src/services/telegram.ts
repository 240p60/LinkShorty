// Telegram Web App service

import WebApp from "@twa-dev/sdk";
import type { WebAppUser } from "@twa-dev/types";

export function initTelegram(): void {
  // Expand the app to full height
  WebApp.expand();

  // Set header color to match our dark theme
  WebApp.setHeaderColor("#111827");
  WebApp.setBackgroundColor("#111827");
}

export function getTelegramUser(): WebAppUser | undefined {
  return WebApp.initDataUnsafe.user;
}

export function showAlert(message: string): void {
  WebApp.showAlert(message);
}

export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    WebApp.showConfirm(message, resolve);
  });
}

export function hapticFeedback(
  type: "light" | "medium" | "heavy" | "success" | "error" = "light",
): void {
  if (type === "success") {
    WebApp.HapticFeedback.notificationOccurred("success");
  } else if (type === "error") {
    WebApp.HapticFeedback.notificationOccurred("error");
  } else {
    WebApp.HapticFeedback.impactOccurred(type);
  }
}

export function shareLink(url: string, text?: string): void {
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}${text ? `&text=${encodeURIComponent(text)}` : ""}`;
  WebApp.openTelegramLink(shareUrl);
}

export function openLink(url: string): void {
  WebApp.openLink(url);
}

export function closeMiniApp(): void {
  WebApp.close();
}

export function isRunningInTelegram(): boolean {
  return Boolean(WebApp.initData);
}

export { WebApp };
