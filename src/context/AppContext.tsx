import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { AppContextValue, Section } from '../types';

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isLoadingSections] = useState(false);

  const createSection = useCallback((name: string): Section => {
    const now = Date.now();
    const section: Section = {
      id: crypto.randomUUID(),
      name,
      order: sections.length,
      createdAt: now,
      updatedAt: now,
    };
    setSections((current) => [...current, section]);
    return section;
  }, [sections.length]);

  const renameSection = useCallback((id: string, name: string) => {
    setSections((current) => current.map((section) =>
      section.id === id ? { ...section, name, updatedAt: Date.now() } : section,
    ));
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections((current) => current.filter((section) => section.id !== id));
    setActiveSectionId((current) => current === id ? null : current);
  }, []);

  const reorderSections = useCallback((ids: string[]) => {
    setSections((current) => {
      const byId = new Map(current.map((section) => [section.id, section]));
      return ids.flatMap((id, order) => {
        const section = byId.get(id);
        return section ? [{ ...section, order }] : [];
      });
    });
  }, []);

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
