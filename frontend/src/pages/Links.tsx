import { LinkList } from "@components/links/LinkList";
import { EmptyState } from "@components/EmptyState";
import { useLinks } from "@hooks/useLinks";

export function Links() {
  const { links, loading, removeLink } = useLinks();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (links.length === 0) {
    return <EmptyState />;
  }

  return <LinkList links={links} onDelete={removeLink} />;
}
