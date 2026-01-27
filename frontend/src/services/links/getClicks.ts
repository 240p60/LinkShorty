import api from "@services/api.service";
import type { Click } from "@app/types";

interface GetClicksResponse {
  clicks: Click[];
  total: number;
  limit: number;
  offset: number;
}

export async function getClicksForLink(shortCode: string): Promise<Click[]> {
  const response = await api.get<GetClicksResponse>(`/links/${shortCode}/clicks`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить клики");
  }

  return response.data.clicks;
}
