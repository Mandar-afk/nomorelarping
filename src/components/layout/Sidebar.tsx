import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Download, Plus, Upload } from 'lucide-react';
import type { SectionItemData } from '../sections/SectionList';
import SectionList from '../sections/SectionList';
import SectionForm from '../sections/SectionForm';
import ConfirmDialog from '../ui/ConfirmDialog';
import Button from '../ui/Button';
import { useAppContext } from '../../context/AppContext';
import { useExportImport } from '../../hooks/useExportImport';

export default function Sidebar() {
  const { sections, activeSectionId, setActiveSectionId, createSection, renameSection, deleteSection, isLoadingSections, sectionsError } = useAppContext();
  const { exportData, importData, feedback, clearFeedback, isImporting } = useExportImport();
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<SectionItemData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(clearFeedback, 5000);
    return () => window.clearTimeout(timeout);
  }, [clearFeedback, feedback]);

  const handleImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    try {
      await importData(file);
    } catch {
      // The import hook exposes a user-readable error message.
    } finally {
      input.value = '';
    }
  };

  const handleCreateSection = async (name: string) => {
    try {
      const section = await createSection(name);
      setActiveSectionId(section.id);
      setShowNewSectionForm(false);
    } catch {
      // The provider exposes the database error in the sidebar.
    }
  };

  const handleRenameSection = async (id: string, name: string) => {
    try {
      await renameSection(id, name);
    } catch {
      // The provider exposes the database error in the sidebar.
    }
  };

  const handleDeleteSection = async () => {
    if (!sectionToDelete) return;
    try {
      await deleteSection(sectionToDelete.id);
      setSectionToDelete(null);
    } catch {
      // The provider exposes the database error in the sidebar.
    }
  };

  return (
    <>
      <div className="border-b border-border-base px-4 py-5">
        <div className="text-sm font-bold tracking-widest text-accent">NOMORELARPING</div>
        <p className="mt-1 text-xs text-text-disabled">task management</p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {sectionsError && <p className="px-4 py-2 text-xs text-accent" role="alert">{sectionsError}</p>}
        {isLoadingSections && <p className="px-4 py-2 text-xs text-text-disabled" role="status">Loading sections…</p>}
        <SectionList
          sections={sections}
          activeSectionId={activeSectionId}
          onSelect={setActiveSectionId}
          onRename={handleRenameSection}
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
        <Button variant="ghost" size="sm" className="flex-1" onClick={() => { void exportData().catch(() => undefined); }}>
          <Download aria-hidden="true" size={14} /> Export
        </Button>
        <Button variant="ghost" size="sm" className="flex-1" disabled={isImporting} onClick={() => fileInputRef.current?.click()}>
          <Upload aria-hidden="true" size={14} /> {isImporting ? 'Importing…' : 'Import'}
        </Button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportChange} className="hidden" aria-label="Import backup file" />
      </div>
      {feedback && (
        <p className={`px-4 pb-3 text-xs ${feedback.kind === 'error' ? 'text-accent' : 'text-text-secondary'}`} role={feedback.kind === 'error' ? 'alert' : 'status'}>
          {feedback.message}
        </p>
      )}

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
