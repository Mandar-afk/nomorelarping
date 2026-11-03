import { useState } from 'react';
import { Download, Plus, Upload } from 'lucide-react';
import type { SectionItemData } from '../sections/SectionList';
import SectionList from '../sections/SectionList';
import SectionForm from '../sections/SectionForm';
import ConfirmDialog from '../ui/ConfirmDialog';
import Button from '../ui/Button';

interface SidebarProps {
  onSectionSelect: (id: string, name: string) => void;
}

export default function Sidebar({ onSectionSelect }: SidebarProps) {
  // Temporary in-memory section state for Phase 2 — will be replaced in Phase 3
  const [sections, setSections] = useState<SectionItemData[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<SectionItemData | null>(null);

  const createSection = (name: string) => {
    const section = { id: crypto.randomUUID(), name };
    setSections((current) => [...current, section]);
    setActiveSectionId(section.id);
    onSectionSelect(section.id, section.name);
    setShowNewSectionForm(false);
  };

  const renameSection = (id: string, name: string) => {
    setSections((current) => current.map((section) => section.id === id ? { ...section, name } : section));
    if (activeSectionId === id) onSectionSelect(id, name);
  };

  const deleteSection = () => {
    if (!sectionToDelete) return;
    setSections((current) => current.filter((section) => section.id !== sectionToDelete.id));
    if (activeSectionId === sectionToDelete.id) {
      setActiveSectionId(null);
      onSectionSelect('', '');
    }
    setSectionToDelete(null);
  };

  return (
    <>
      <div className="border-b border-border-base px-4 py-5">
        <div className="text-sm font-bold tracking-widest text-accent">NOMORELARPING</div>
        <p className="mt-1 text-xs text-text-disabled">task management</p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <SectionList
          sections={sections}
          activeSectionId={activeSectionId}
          onSelect={(id) => {
            const section = sections.find((item) => item.id === id);
            if (!section) return;
            setActiveSectionId(id);
            onSectionSelect(id, section.name);
          }}
          onRename={renameSection}
          onDelete={(id) => setSectionToDelete(sections.find((section) => section.id === id) ?? null)}
        />
      </div>

      <div className="border-t border-border-base px-3 py-2">
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setShowNewSectionForm(true)}>
          <Plus aria-hidden="true" size={16} /> New Section
        </Button>
        {showNewSectionForm && (
          <SectionForm onSubmit={createSection} onCancel={() => setShowNewSectionForm(false)} />
        )}
      </div>

      <div className="flex gap-1 border-t border-border-base px-3 py-3">
        <Button variant="ghost" size="sm" className="flex-1" onClick={() => { /* wired in Phase 4 */ }}>
          <Download aria-hidden="true" size={14} /> Export
        </Button>
        <Button variant="ghost" size="sm" className="flex-1" onClick={() => { /* wired in Phase 4 */ }}>
          <Upload aria-hidden="true" size={14} /> Import
        </Button>
      </div>

      <ConfirmDialog
        isOpen={sectionToDelete !== null}
        title="Delete section?"
        message={sectionToDelete ? `“${sectionToDelete.name}” will be removed.` : ''}
        confirmLabel="Delete section"
        isDangerous
        onConfirm={deleteSection}
        onCancel={() => setSectionToDelete(null)}
      />
    </>
  );
}
