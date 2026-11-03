import { db } from '../db/schema';
import type { ITaskRepository, Task } from '../types';

export class TaskRepository implements ITaskRepository {
  async getAll(): Promise<Task[]> {
    return db.tasks.toArray();
  }

  async getAllBySection(sectionId: string): Promise<Task[]> {
    return db.tasks.where('sectionId').equals(sectionId).toArray();
  }

  async getById(id: string): Promise<Task | undefined> {
    return db.tasks.get(id);
  }

  async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return db.transaction('rw', db.tasks, async () => {
      const activeTasks = await db.tasks
        .where('sectionId')
        .equals(data.sectionId)
        .filter((task) => !task.completed)
        .toArray();
      const maxOrder = activeTasks.reduce((max, task) => Math.max(max, task.order), -1);
      const now = Date.now();
      const task: Task = {
        ...data,
        id: crypto.randomUUID(),
        order: maxOrder + 1,
        createdAt: now,
        updatedAt: now,
      };
      await db.tasks.add(task);
      return task;
    });
  }

  async update(id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    const existing = await db.tasks.get(id);
    if (!existing) throw new Error(`Task with id ${id} not found`);

    const updated: Task = { ...existing, ...data, updatedAt: Date.now() };
    await db.tasks.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await db.tasks.delete(id);
  }

  async deleteBySection(sectionId: string): Promise<void> {
    await db.tasks.where('sectionId').equals(sectionId).delete();
  }

  async reorder(sectionId: string, ids: string[]): Promise<void> {
    await db.transaction('rw', db.tasks, async () => {
      for (let order = 0; order < ids.length; order += 1) {
        const task = await db.tasks.get(ids[order]);
        if (task && task.sectionId === sectionId && !task.completed) {
          await db.tasks.update(task.id, { order, updatedAt: Date.now() });
        }
      }
    });
  }

  async markComplete(id: string): Promise<Task> {
    const now = Date.now();
    const count = await db.tasks.update(id, {
      completed: true,
      completedAt: now,
      updatedAt: now,
    });
    const updated = await db.tasks.get(id);
    if (!count || !updated) throw new Error(`Task ${id} not found after markComplete`);
    return updated;
  }

  async markActive(id: string): Promise<Task> {
    return db.transaction('rw', db.tasks, async () => {
      const existing = await db.tasks.get(id);
      if (!existing) throw new Error(`Task ${id} not found`);

      const activeTasks = await db.tasks
        .where('sectionId')
        .equals(existing.sectionId)
        .filter((task) => !task.completed && task.id !== id)
        .toArray();
      const maxOrder = activeTasks.reduce((max, task) => Math.max(max, task.order), -1);
      const now = Date.now();
      await db.tasks.update(id, {
        completed: false,
        completedAt: undefined,
        order: maxOrder + 1,
        updatedAt: now,
      });
      const updated = await db.tasks.get(id);
      if (!updated) throw new Error(`Task ${id} not found after markActive`);
      return updated;
    });
  }
}

export const taskRepository = new TaskRepository();
