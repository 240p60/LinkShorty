import { Card } from "@components/common/Card";
import { LinkGenerator } from "@components/links/LinkGenerator";
import { useLinks } from "@hooks/useLinks";
import { formatNumber } from "@utils/formatters";

export function Home() {
  const { links, addLink } = useLinks();

  const totalClicks = links.reduce((sum, link) => sum + link.total_clicks, 0);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold text-white">{formatNumber(links.length)}</p>
          <p className="text-xs text-gray-400 mt-1">Всего ссылок</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-white">{formatNumber(totalClicks)}</p>
          <p className="text-xs text-gray-400 mt-1">Всего кликов</p>
        </Card>
      </div>

      {/* Link Generator */}
      <LinkGenerator onCreateLink={addLink} />
    </div>
  );
}
