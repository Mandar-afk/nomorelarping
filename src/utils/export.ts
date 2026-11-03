import type { ExportPayload, Priority, Section, Task } from '../types';

export function createExportPayload(sections: Section[], tasks: Task[]): ExportPayload {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    sections,
    tasks,
  };
}

export function downloadJSON(payload: ExportPayload, filename: string): void {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPriority(value: unknown): value is Priority {
  return value === 'high' || value === 'medium' || value === 'low';
}

function isSection(value: unknown): value is Section {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.name === 'string'
    && value.name.trim().length > 0
    && Number.isInteger(value.order)
    && typeof value.createdAt === 'number'
    && Number.isFinite(value.createdAt)
    && typeof value.updatedAt === 'number'
    && Number.isFinite(value.updatedAt);
}

function isTask(value: unknown): value is Task {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.sectionId === 'string'
    && typeof value.name === 'string'
    && value.name.trim().length > 0
    && (value.description === undefined || typeof value.description === 'string')
    && isPriority(value.priority)
    && (value.dueDate === undefined || (typeof value.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.dueDate)))
    && typeof value.completed === 'boolean'
    && (value.completedAt === undefined || (typeof value.completedAt === 'number' && Number.isFinite(value.completedAt)))
    && Number.isInteger(value.order)
    && typeof value.createdAt === 'number'
    && Number.isFinite(value.createdAt)
    && typeof value.updatedAt === 'number'
    && Number.isFinite(value.updatedAt);
}

export function validateImportPayload(data: unknown): data is ExportPayload {
  if (!isRecord(data) || data.version !== 1 || typeof data.exportedAt !== 'string') return false;
  if (!Array.isArray(data.sections) || !Array.isArray(data.tasks)) return false;
  const sections = (data.sections as unknown[]).filter(isSection);
  const tasks = (data.tasks as unknown[]).filter(isTask);
  if (sections.length !== data.sections.length || tasks.length !== data.tasks.length) return false;

  const sectionIds = new Set(sections.map((section) => section.id));
  const taskIds = new Set<string>();
  if (sectionIds.size !== sections.length) return false;
  for (const task of tasks) {
    if (!sectionIds.has(task.sectionId) || taskIds.has(task.id)) return false;
    taskIds.add(task.id);
  }
  return true;
}
