import { useState } from 'react';
import { Download, Plus, Upload } from 'lucide-react';
import type { SectionItemData } from '../sections/SectionList';
import SectionList from '../sections/SectionList';
import SectionForm from '../sections/SectionForm';
import ConfirmDialog from '../ui/ConfirmDialog';
import Button from '../ui/Button';
import { useAppContext } from '../../context/AppContext';

export default function Sidebar() {
  const { sections, activeSectionId, setActiveSectionId, createSection, renameSection, deleteSection } = useAppContext();
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<SectionItemData | null>(null);

  const handleCreateSection = (name: string) => {
    const section = createSection(name);
    setActiveSectionId(section.id);
    setShowNewSectionForm(false);
  };

  const handleDeleteSection = () => {
    if (!sectionToDelete) return;
    deleteSection(sectionToDelete.id);
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
          onSelect={setActiveSectionId}
          onRename={renameSection}
          onDelete={(id) => setSectionToDelete(sections.find((section) => section.id === id) ?? null)}
        />
      </div>

      <div className="border-t border-border-base px-3 py-2">
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setShowNewSectionForm(true)}>
          <Plus aria-hidden="true" size={16} /> New Section
        </Button>
        {showNewSectionForm && (
          <SectionForm onSubmit={handleCreateSection} onCancel={() => setShowNewSectionForm(false)} />
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
        onConfirm={handleDeleteSection}
        onCancel={() => setSectionToDelete(null)}
      />
    </>
  );
}
