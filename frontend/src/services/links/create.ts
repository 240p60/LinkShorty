import type { CreateLinkInput, Link } from "@app/types";
import api from "@services/api.service";

export async function createLink(input: CreateLinkInput): Promise<Link> {
  const response = await api.post<Link>("/links", input);

  if (!response.ok) {
    const error = response.data as { error?: string };
    throw new Error(error.error || "Не удалось создать ссылку");
  }

  return response.data;
}
