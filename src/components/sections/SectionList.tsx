import SectionItem from './SectionItem';

export interface SectionItemData {
  id: string;
  name: string;
}

export interface SectionListProps {
  sections: SectionItemData[];
  activeSectionId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function SectionList({ sections, activeSectionId, onSelect, onRename, onDelete }: SectionListProps) {
  if (sections.length === 0) {
    return <p className="px-4 py-2 text-xs text-text-disabled">No sections yet.</p>;
  }

  return (
    <nav aria-label="Sections" className="space-y-1 px-1">
      {sections.map((section) => (
        <SectionItem
          key={section.id}
          {...section}
          isActive={section.id === activeSectionId}
          onSelect={() => onSelect(section.id)}
          onRename={(name) => onRename(section.id, name)}
          onDelete={() => onDelete(section.id)}
        />
      ))}
    </nav>
  );
}
