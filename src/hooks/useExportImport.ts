import { useCallback, useState } from 'react';
import { sectionRepository } from '../repositories/SectionRepository';
import { taskRepository } from '../repositories/TaskRepository';
import type { ExportPayload } from '../types';
import { createExportPayload, downloadJSON, validateImportPayload } from '../utils/export';
import { useAppContext } from '../context/AppContext';

export interface ExportImportFeedback {
  kind: 'success' | 'error';
  message: string;
}

export function useExportImport() {
  const { refreshData } = useAppContext();
  const [feedback, setFeedback] = useState<ExportImportFeedback | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const exportData = async (): Promise<void> => {
    setFeedback(null);
    try {
      const [sections, tasks] = await Promise.all([
        sectionRepository.getAll(),
        taskRepository.getAll(),
      ]);
      const payload: ExportPayload = createExportPayload(sections, tasks);
      const now = new Date();
      const date = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
      ].join('-');
      downloadJSON(payload, `nomorelarping-backup-${date}.json`);
      setFeedback({ kind: 'success', message: 'Backup exported.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to export backup.';
      setFeedback({ kind: 'error', message });
      throw new Error(message);
    }
  };

  const importData = async (file: File): Promise<void> => {
    setFeedback(null);
    setIsImporting(true);
    try {
      let parsedData: unknown;
      try {
        parsedData = JSON.parse(await file.text()) as unknown;
      } catch {
        throw new Error('The selected file is not valid JSON.');
      }

      if (!validateImportPayload(parsedData)) {
        throw new Error('This file is not a valid NOMORELARPING backup.');
      }

      await sectionRepository.replaceAll(parsedData.sections, parsedData.tasks);
      await refreshData();
      setFeedback({ kind: 'success', message: 'Backup imported successfully.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to import backup.';
      setFeedback({ kind: 'error', message });
      throw new Error(message);
    } finally {
      setIsImporting(false);
    }
  };

  const clearFeedback = useCallback(() => setFeedback(null), []);

  return { exportData, importData, feedback, clearFeedback, isImporting };
}
