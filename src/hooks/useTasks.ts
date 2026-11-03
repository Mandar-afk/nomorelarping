import { useCallback, useEffect, useRef, useState } from 'react';
import type { Priority, Task } from '../types';
import { taskRepository } from '../repositories/TaskRepository';
import { useAppContext } from '../context/AppContext';

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
  const { dataRevision } = useAppContext();
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);

  const loadTasks = useCallback(async () => {
    const request = ++requestVersion.current;
    if (!sectionId) {
      setActiveTasks([]);
      setCompletedTasks([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const tasks = await taskRepository.getAllBySection(sectionId);
      if (request !== requestVersion.current) return;
      setActiveTasks(tasks.filter((task) => !task.completed).sort((a, b) => a.order - b.order));
      setCompletedTasks(tasks.filter((task) => task.completed).sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0)));
    } catch (cause) {
      if (request !== requestVersion.current) return;
      setError(cause instanceof Error ? cause.message : 'Unable to load tasks.');
      setActiveTasks([]);
      setCompletedTasks([]);
    } finally {
      if (request === requestVersion.current) setIsLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    setActiveTasks([]);
    setCompletedTasks([]);
    void loadTasks();
    return () => { requestVersion.current += 1; };
  }, [dataRevision, loadTasks]);

  const runMutation = useCallback(async (operation: () => Promise<void>) => {
    setError(null);
    try {
      await operation();
      await loadTasks();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save task changes.');
    }
  }, [loadTasks]);

  const createTask = useCallback(async (data: CreateTaskInput) => {
    if (!sectionId) return;
    await runMutation(async () => {
      await taskRepository.create({
        ...data,
        sectionId,
        completed: false,
        order: activeTasks.length,
      });
    });
  }, [activeTasks.length, runMutation, sectionId]);

  const updateTask = useCallback(async (id: string, data: UpdateTaskInput) => {
    await runMutation(async () => { await taskRepository.update(id, data); });
  }, [runMutation]);

  const deleteTask = useCallback(async (id: string) => {
    await runMutation(async () => { await taskRepository.delete(id); });
  }, [runMutation]);

  const completeTask = useCallback(async (id: string) => {
    await runMutation(async () => { await taskRepository.markComplete(id); });
  }, [runMutation]);

  const restoreTask = useCallback(async (id: string) => {
    await runMutation(async () => { await taskRepository.markActive(id); });
  }, [runMutation]);

  const reorderTasks = useCallback(async (ids: string[]) => {
    if (!sectionId) return;
    await runMutation(async () => { await taskRepository.reorder(sectionId, ids); });
  }, [runMutation, sectionId]);

  return {
    activeTasks,
    completedTasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    restoreTask,
    reorderTasks,
  };
}
