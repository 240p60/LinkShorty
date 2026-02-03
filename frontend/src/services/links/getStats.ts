import type { ChartDataPoint, Link } from "@app/types";
import api from "@services/api.service";

interface GetStatsResponse {
  link: Link;
  chart_data: ChartDataPoint[];
}

export async function getClicksOverTime(shortCode: string, days = 7): Promise<ChartDataPoint[]> {
  const response = await api.get<GetStatsResponse>(`/links/${shortCode}/stats`, {
    params: { days: days.toString() },
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить статистику");
  }

  return response.data.chart_data;
}
