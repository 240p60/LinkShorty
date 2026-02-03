import type { Link } from "@app/types";
import api from "@services/api.service";

export async function getLink(shortCode: string): Promise<Link | null> {
  const response = await api.get<Link>(`/links/${shortCode}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Не удалось загрузить ссылку");
  }

  return response.data;
}
