import { Card } from "@components/common/Card";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "Ссылок пока нет",
  description = "Создайте свою первую короткую ссылку!",
}: EmptyStateProps) {
  return (
    <Card className="text-center py-12">
      <div className="mb-4">
        <EmptyIcon />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </Card>
  );
}

function EmptyIcon() {
  return (
    <svg
      className="w-16 h-16 mx-auto text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <title>Empty Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}
