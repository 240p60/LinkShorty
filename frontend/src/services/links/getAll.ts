import api from "@services/api.service";
import type { Link } from "@app/types";

interface GetAllLinksResponse {
  links: Link[];
  total: number;
  limit: number;
  offset: number;
}

export async function getAllLinks(): Promise<Link[]> {
  const response = await api.get<GetAllLinksResponse>("/links");

  if (!response.ok) {
    throw new Error("Не удалось загрузить ссылки");
  }

  return response.data.links;
}
