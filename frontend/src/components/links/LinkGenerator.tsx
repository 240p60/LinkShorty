import type { CreateLinkInput, Link } from "@app/types";
import { Button } from "@components/common/Button";
import { Card } from "@components/common/Card";
import { CopyButton } from "@components/common/CopyButton";
import { Input } from "@components/common/Input";
import { useTelegram } from "@hooks/useTelegram";
import { validateUrl } from "@utils/validators";
import { type FormEvent, useCallback, useState } from "react";

interface LinkGeneratorProps {
  onCreateLink: (input: CreateLinkInput) => Promise<Link>;
}

export function LinkGenerator({ onCreateLink }: LinkGeneratorProps) {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<Link | null>(null);
  const { haptic } = useTelegram();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");

      const validation = validateUrl(url);
      if (!validation.valid) {
        setError(validation.error || "Неверный URL");
        haptic("error");
        return;
      }

      try {
        setLoading(true);
        const link = await onCreateLink({
          original_url: url,
          custom_code: customCode || undefined,
        });
        setCreatedLink(link);
        setUrl("");
        setCustomCode("");
        haptic("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось создать ссылку");
        haptic("error");
      } finally {
        setLoading(false);
      }
    },
    [url, customCode, onCreateLink, haptic],
  );

  const shortUrl = createdLink ? createdLink.short_url : "";

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Создать короткую ссылку</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="URL для сокращения"
          placeholder="https://example.com/ваша-длинная-ссылка"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={error}
        />

        <Input
          label="Свой код (необязательно)"
          placeholder="мой-код"
          value={customCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomCode(e.target.value)}
          helperText="Оставьте пустым для автогенерации"
        />

        <Button type="submit" loading={loading} className="w-full">
          Сократить URL
        </Button>
      </form>

      {createdLink && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-green-500/30">
          <p className="text-sm text-gray-400 mb-2">Ваша короткая ссылка готова!</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-green-400 text-sm truncate">{shortUrl}</code>
            <CopyButton text={shortUrl} onCopy={() => haptic("light")} />
          </div>
        </div>
      )}
    </Card>
  );
}
