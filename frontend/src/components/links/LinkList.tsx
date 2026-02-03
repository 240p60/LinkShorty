import type { Link } from "../../types";
import { LinkCard } from "./LinkCard";

interface LinkListProps {
  links: Link[];
  onDelete: (shortCode: string) => Promise<void>;
}

export function LinkList({ links, onDelete }: LinkListProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white">Ваши ссылки ({links.length})</h2>
      <div className="space-y-3">
        {links.map((link) => (
          <LinkCard key={link.id} link={link} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
