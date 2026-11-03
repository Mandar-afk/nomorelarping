export type Priority = 'high' | 'medium' | 'low';

export interface Section {
  id: string;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: string;
  sectionId: string;
  name: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  completed: boolean;
  completedAt?: number;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface ISectionRepository {
  getAll(): Promise<Section[]>;
  getById(id: string): Promise<Section | undefined>;
  create(data: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>): Promise<Section>;
  update(id: string, data: Partial<Omit<Section, 'id' | 'createdAt'>>): Promise<Section>;
  delete(id: string): Promise<void>;
  reorder(ids: string[]): Promise<void>;
}

export interface ITaskRepository {
  getAllBySection(sectionId: string): Promise<Task[]>;
  getById(id: string): Promise<Task | undefined>;
  create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  update(id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task>;
  delete(id: string): Promise<void>;
  deleteBySection(sectionId: string): Promise<void>;
  reorder(sectionId: string, ids: string[]): Promise<void>;
  markComplete(id: string): Promise<Task>;
  markActive(id: string): Promise<Task>;
}

export interface AppContextValue {
  sections: Section[];
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
  isLoadingSections: boolean;
  createSection: (name: string) => Section;
  renameSection: (id: string, name: string) => void;
  deleteSection: (id: string) => void;
  reorderSections: (ids: string[]) => void;
}

export interface ExportPayload {
  version: number;
  exportedAt: string;
  sections: Section[];
  tasks: Task[];
}
