import { useCallback, useEffect, useState } from 'react';
import type { Priority, Task } from '../types';

export interface CreateTaskInput {
  name: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
}

export interface UpdateTaskInput {
  name?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
}

export function useTasks(sectionId: string | null) {
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isLoading] = useState(false);

  useEffect(() => {
    setActiveTasks([]);
    setCompletedTasks([]);
  }, [sectionId]);

  const createTask = useCallback((data: CreateTaskInput) => {
    if (!sectionId) return;
    const now = Date.now();
    const task: Task = {
      id: crypto.randomUUID(),
      sectionId,
      completed: false,
      order: activeTasks.length,
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    setActiveTasks((current) => [...current, task]);
  }, [sectionId, activeTasks.length]);

  const updateTask = useCallback((id: string, data: UpdateTaskInput) => {
    setActiveTasks((current) => current.map((task) => {
      if (task.id !== id) return task;
      const updatedTask = { ...task, ...data, updatedAt: Date.now() };
      if (Object.prototype.hasOwnProperty.call(data, 'description') && data.description === undefined) {
        delete updatedTask.description;
      }
      if (Object.prototype.hasOwnProperty.call(data, 'dueDate') && data.dueDate === undefined) {
        delete updatedTask.dueDate;
      }
      return updatedTask;
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setActiveTasks((current) => current.filter((task) => task.id !== id));
    setCompletedTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const completeTask = useCallback((id: string) => {
    const task = activeTasks.find((item) => item.id === id);
    if (!task) return;
    const completedAt = Date.now();
    setActiveTasks((current) => current.filter((item) => item.id !== id));
    setCompletedTasks((current) => [
      { ...task, completed: true, completedAt, updatedAt: completedAt },
      ...current,
    ]);
  }, [activeTasks]);

  const restoreTask = useCallback((id: string) => {
    const task = completedTasks.find((item) => item.id === id);
    if (!task) return;
    const { completedAt: _completedAt, ...rest } = task;
    setCompletedTasks((current) => current.filter((item) => item.id !== id));
    setActiveTasks((current) => [
      ...current,
      { ...rest, completed: false, order: current.length, updatedAt: Date.now() },
    ]);
  }, [completedTasks]);

  const reorderTasks = useCallback((ids: string[]) => {
    setActiveTasks((current) => {
      const byId = new Map(current.map((task) => [task.id, task]));
      return ids.flatMap((id, order) => {
        const task = byId.get(id);
        return task ? [{ ...task, order }] : [];
      });
    });
  }, []);

  return {
    activeTasks,
    completedTasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    restoreTask,
    reorderTasks,
  };
}
