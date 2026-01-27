import { Card } from "@components/common/Card";
import { ClicksChart } from "@components/stats/ClicksChart";
import { ClicksTable } from "@components/stats/ClicksTable";
import { formatNumber, truncateUrl } from "@utils/formatters";
import { buildShortUrl } from "@utils/generateShortCode";
import type { Link, Click, ChartDataPoint } from "@app/types";

interface StatsViewProps {
  link: Link;
  clicks: Click[];
  chartData: ChartDataPoint[];
}

export function StatsView({ link, clicks, chartData }: StatsViewProps) {
  const shortUrl = buildShortUrl(link.short_code);

  return (
    <div className="space-y-4">
      {/* Link Info */}
      <Card>
        <div className="space-y-2">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-medium block"
          >
            {shortUrl}
          </a>
          <p className="text-gray-500 text-sm truncate" title={link.original_url}>
            {truncateUrl(link.original_url, 60)}
          </p>
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-3xl font-bold text-white">{formatNumber(link.total_clicks)}</p>
          <p className="text-sm text-gray-400 mt-1">Всего кликов</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-white">{formatNumber(link.unique_clicks)}</p>
          <p className="text-sm text-gray-400 mt-1">Уникальных посетителей</p>
        </Card>
      </div>

      {/* Chart */}
      <ClicksChart data={chartData} />

      {/* Clicks Table */}
      <ClicksTable clicks={clicks} />
    </div>
  );
}
