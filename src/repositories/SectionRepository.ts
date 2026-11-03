import { db } from '../db/schema';
import type { ISectionRepository, Section, Task } from '../types';

export class SectionRepository implements ISectionRepository {
  async getAll(): Promise<Section[]> {
    return db.sections.orderBy('order').toArray();
  }

  async getById(id: string): Promise<Section | undefined> {
    return db.sections.get(id);
  }

  async create(data: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>): Promise<Section> {
    return db.transaction('rw', db.sections, async () => {
      const lastSection = await db.sections.orderBy('order').last();
      const now = Date.now();
      const section: Section = {
        ...data,
        id: crypto.randomUUID(),
        order: (lastSection?.order ?? -1) + 1,
        createdAt: now,
        updatedAt: now,
      };
      await db.sections.add(section);
      return section;
    });
  }

  async update(id: string, data: Partial<Omit<Section, 'id' | 'createdAt'>>): Promise<Section> {
    const existing = await db.sections.get(id);
    if (!existing) throw new Error(`Section with id ${id} not found`);

    const updated: Section = { ...existing, ...data, updatedAt: Date.now() };
    await db.sections.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await db.transaction('rw', db.sections, db.tasks, async () => {
      await db.tasks.where('sectionId').equals(id).delete();
      await db.sections.delete(id);
    });
  }

  async reorder(ids: string[]): Promise<void> {
    await db.transaction('rw', db.sections, async () => {
      for (let order = 0; order < ids.length; order += 1) {
        await db.sections.update(ids[order], { order, updatedAt: Date.now() });
      }
    });
  }

  async replaceAll(sections: Section[], tasks: Task[]): Promise<void> {
    await db.transaction('rw', db.sections, db.tasks, async () => {
      await db.sections.clear();
      await db.tasks.clear();
      if (sections.length > 0) await db.sections.bulkAdd(sections);
      if (tasks.length > 0) await db.tasks.bulkAdd(tasks);
    });
  }
}

export const sectionRepository = new SectionRepository();
