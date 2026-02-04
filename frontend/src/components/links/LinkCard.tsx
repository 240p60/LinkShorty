import type { Link } from "@app/types";
import { Button } from "@components/common/Button";
import { Card } from "@components/common/Card";
import { CopyButton } from "@components/common/CopyButton";
import { useTelegram } from "@hooks/useTelegram";
import { formatNumber, getRelativeTime, truncateUrl } from "@utils/formatters";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface LinkCardProps {
  link: Link;
  onDelete: (shortCode: string) => Promise<void>;
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  const navigate = useNavigate();
  const { haptic, confirm, share } = useTelegram();
  const shortUrl = link.short_url;

  const handleDelete = useCallback(async () => {
    const confirmed = await confirm("Вы уверены, что хотите удалить эту ссылку?");
    if (confirmed) {
      await onDelete(link.short_code);
      haptic("success");
    }
  }, [link.short_code, onDelete, confirm, haptic]);

  const handleViewStats = useCallback(() => {
    haptic("light");
    navigate(`/stats/${link.short_code}`);
  }, [navigate, link.short_code, haptic]);

  const handleShare = useCallback(() => {
    haptic("light");
    share(shortUrl, `Посмотри эту ссылку: ${shortUrl}`);
  }, [share, shortUrl, haptic]);

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-medium text-sm"
          >
            {shortUrl}
          </a>
          <p className="text-gray-400 text-xs mt-1 truncate" title={link.original_url}>
            {truncateUrl(link.original_url, 50)}
          </p>
        </div>
        <CopyButton text={shortUrl} onCopy={() => haptic("light")} />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{getRelativeTime(link.created_at)}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <ClickIcon />
            {formatNumber(link.total_clicks)} кликов
          </span>
          <span className="flex items-center gap-1">
            <UserIcon />
            {formatNumber(link.unique_clicks)} уник.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
        <Button variant="ghost" size="sm" onClick={handleViewStats} className="flex-1">
          <ChartIcon />
          Статистика
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare} className="flex-1">
          <ShareIcon />
          Поделиться
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300"
        >
          <TrashIcon />
        </Button>
      </div>
    </Card>
  );
}

function ClickIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <title>Click Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <title>User Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <title>Chart Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <title>Share Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <title>Trash Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
