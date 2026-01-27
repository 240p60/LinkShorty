import { Card } from "@components/common/Card";
import { formatDateTime } from "@utils/formatters";
import type { Click } from "@app/types";

interface ClicksTableProps {
  clicks: Click[];
  maxRows?: number;
}

export function ClicksTable({ clicks, maxRows = 10 }: ClicksTableProps) {
  const displayClicks = clicks.slice(0, maxRows);

  if (clicks.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-medium text-gray-300 mb-4">Последние клики</h3>
        <p className="text-gray-500 text-sm text-center py-8">Кликов пока нет</p>
      </Card>
    );
  }

  return (
    <Card padding="none">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-300">
          Последние клики (всего {clicks.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-700">
              <th className="px-4 py-3 font-medium">Время</th>
              <th className="px-4 py-3 font-medium">Источник</th>
              <th className="px-4 py-3 font-medium">Устройство</th>
              <th className="px-4 py-3 font-medium">Тип</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {displayClicks.map((click, index) => (
              <tr key={`${click.timestamp}-${index}`} className="text-sm">
                <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                  {formatDateTime(click.timestamp)}
                </td>
                <td className="px-4 py-3 text-gray-400 truncate max-w-[150px]">
                  {parseReferrer(click.referrer)}
                </td>
                <td className="px-4 py-3 text-gray-400">{parseDevice(click.user_agent)}</td>
                <td className="px-4 py-3">
                  {click.is_unique ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/50 text-green-400">
                      Уникальный
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-400">
                      Повторный
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {clicks.length > maxRows && (
        <div className="p-3 text-center text-xs text-gray-500 border-t border-gray-700">
          Показано {maxRows} из {clicks.length} кликов
        </div>
      )}
    </Card>
  );
}

function parseReferrer(referrer: string | null): string {
  if (!referrer) return "Прямой";
  try {
    const url = new URL(referrer);
    return url.hostname.replace("www.", "");
  } catch {
    return referrer;
  }
}

function parseDevice(userAgent: string): string {
  if (userAgent.includes("iPhone")) return "iPhone";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Macintosh")) return "Mac";
  if (userAgent.includes("TelegramBot")) return "Telegram";
  return "Неизвестно";
}
