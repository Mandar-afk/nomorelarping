import Dexie, { type Table } from 'dexie';
import type { Section, Task } from '../types';

export class NMLDatabase extends Dexie {
  sections!: Table<Section, string>;
  tasks!: Table<Task, string>;

  constructor() {
    super('nomorelarping');
    this.version(1).stores({
      sections: 'id, order, createdAt',
      tasks: 'id, sectionId, order, completed, dueDate, priority, createdAt',
    });
  }
}

export const db = new NMLDatabase();
