import { Button } from "@components/common/Button";
import { StatsView } from "@components/stats/StatsView";
import { useLinkDetails } from "@hooks/useLinks";
import { useNavigate, useParams } from "react-router-dom";

export function Stats() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const { link, clicks, chartData, loading, error } = useLinkDetails(shortCode || "");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">{error || "Ссылка не найдена"}</p>
        <Button onClick={() => navigate("/links")}>К ссылкам</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => navigate("/links")} className="mb-2">
        <BackIcon />К ссылкам
      </Button>

      <StatsView link={link} clicks={clicks} chartData={chartData} />
    </div>
  );
}

function BackIcon() {
  return (
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <title>Back Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}
