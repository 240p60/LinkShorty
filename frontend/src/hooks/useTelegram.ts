// Custom hook for Telegram Web App integration

import { useEffect, useState } from "react";
import {
  initTelegram,
  getTelegramUser,
  isRunningInTelegram,
  hapticFeedback,
  showConfirm,
  shareLink,
} from "@services/telegram";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface UseTelegramReturn {
  user: TelegramUser | undefined;
  isInTelegram: boolean;
  haptic: typeof hapticFeedback;
  confirm: typeof showConfirm;
  share: typeof shareLink;
}

export function useTelegram(): UseTelegramReturn {
  const [user, setUser] = useState<TelegramUser | undefined>();
  const [isInTelegram, setIsInTelegram] = useState(false);

  useEffect(() => {
    initTelegram();
    setUser(getTelegramUser());
    setIsInTelegram(isRunningInTelegram());
  }, []);

  return {
    user,
    isInTelegram,
    haptic: hapticFeedback,
    confirm: showConfirm,
    share: shareLink,
  };
}
