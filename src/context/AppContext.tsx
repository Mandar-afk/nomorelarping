import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { sectionRepository } from '../repositories/SectionRepository';
import type { AppContextValue, Section } from '../types';

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [dataRevision, setDataRevision] = useState(0);
  const [sectionsError, setSectionsError] = useState<string | null>(null);

  const loadSections = useCallback(async (selectFirstWhenNone: boolean) => {
    setIsLoadingSections(true);
    try {
      const loadedSections = await sectionRepository.getAll();
      setSections(loadedSections);
      setActiveSectionId((current) => {
        if (current && loadedSections.some((section) => section.id === current)) return current;
        return selectFirstWhenNone ? loadedSections[0]?.id ?? null : null;
      });
      setSectionsError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load sections.';
      setSectionsError(message);
      throw error;
    } finally {
      setIsLoadingSections(false);
    }
  }, []);

  useEffect(() => {
    void loadSections(true).catch(() => undefined);
  }, [loadSections]);

  const createSection = useCallback(async (name: string): Promise<Section> => {
    try {
      const section = await sectionRepository.create({ name, order: sections.length });
      await loadSections(false);
      setActiveSectionId(section.id);
      return section;
    } catch (error) {
      setSectionsError(error instanceof Error ? error.message : 'Unable to create section.');
      throw error;
    }
  }, [loadSections, sections.length]);

  const renameSection = useCallback(async (id: string, name: string): Promise<void> => {
    try {
      await sectionRepository.update(id, { name });
      await loadSections(false);
    } catch (error) {
      setSectionsError(error instanceof Error ? error.message : 'Unable to rename section.');
      throw error;
    }
  }, [loadSections]);

  const deleteSection = useCallback(async (id: string): Promise<void> => {
    try {
      await sectionRepository.delete(id);
      await loadSections(false);
    } catch (error) {
      setSectionsError(error instanceof Error ? error.message : 'Unable to delete section.');
      throw error;
    }
  }, [loadSections]);

  const reorderSections = useCallback(async (ids: string[]): Promise<void> => {
    try {
      await sectionRepository.reorder(ids);
      await loadSections(false);
    } catch (error) {
      setSectionsError(error instanceof Error ? error.message : 'Unable to reorder sections.');
      throw error;
    }
  }, [loadSections]);

  const refreshData = useCallback(async () => {
    await loadSections(true);
    setDataRevision((revision) => revision + 1);
  }, [loadSections]);

  return (
    <AppContext.Provider value={{
      sections,
      activeSectionId,
      setActiveSectionId,
      isLoadingSections,
      createSection,
      renameSection,
      deleteSection,
      reorderSections,
      refreshData,
      dataRevision,
      sectionsError,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
}
