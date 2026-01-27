import api from "@services/api.service";

export async function deleteLink(shortCode: string): Promise<void> {
  const response = await api.delete(`/links/${shortCode}`);

  if (!response.ok) {
    const error = response.data as { error?: string };
    throw new Error(error.error || "Не удалось удалить ссылку");
  }
}
