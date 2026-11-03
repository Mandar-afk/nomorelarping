import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import type { Task } from '../../types';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import ActiveTaskList from './ActiveTaskList';
import CompletedTaskList from './CompletedTaskList';
import TaskForm, { type TaskFormData } from './TaskForm';

export interface TaskBoardProps {
  sectionId: string | null;
}

export default function TaskBoard({ sectionId }: TaskBoardProps) {
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    setActiveTasks([]);
    setCompletedTasks([]);
    setShowTaskForm(false);
    setEditingTask(null);
    setTaskToDelete(null);
  }, [sectionId]);

  if (sectionId === null) {
    return <EmptyState title="No section selected" description="Choose a section from the sidebar to get started." />;
  }

  const createTask = (data: TaskFormData) => {
    const now = Date.now();
    setActiveTasks((current) => [...current, {
      ...data,
      id: crypto.randomUUID(),
      sectionId,
      completed: false,
      order: current.length,
      createdAt: now,
      updatedAt: now,
    }]);
    setShowTaskForm(false);
  };

  const updateTask = (data: TaskFormData) => {
    if (!editingTask) return;
    setActiveTasks((current) => current.map((task) => task.id === editingTask.id ? { ...task, ...data, updatedAt: Date.now() } : task));
    setEditingTask(null);
  };

  const completeTask = (id: string) => {
    const task = activeTasks.find((item) => item.id === id);
    if (!task) return;
    const completedAt = Date.now();
    setActiveTasks((current) => current.filter((item) => item.id !== id));
    setCompletedTasks((current) => [{ ...task, completed: true, completedAt, updatedAt: completedAt }, ...current]);
  };

  const restoreTask = (id: string) => {
    const task = completedTasks.find((item) => item.id === id);
    if (!task) return;
    const { completedAt: _completedAt, ...restoredTask } = task;
    setCompletedTasks((current) => current.filter((item) => item.id !== id));
    setActiveTasks((current) => [...current, {
      ...restoredTask,
      completed: false,
      order: current.length,
      updatedAt: Date.now(),
    }]);
  };

  const deleteTask = () => {
    if (!taskToDelete) return;
    setActiveTasks((current) => current.filter((task) => task.id !== taskToDelete.id));
    setCompletedTasks((current) => current.filter((task) => task.id !== taskToDelete.id));
    setTaskToDelete(null);
  };

  const reorderTasks = (ids: string[]) => {
    const byId = new Map(activeTasks.map((task) => [task.id, task]));
    setActiveTasks(ids.flatMap((id, order) => {
      const task = byId.get(id);
      return task ? [{ ...task, order }] : [];
    }));
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => { setEditingTask(null); setShowTaskForm(true); }}>
          <Plus aria-hidden="true" size={16} /> New Task
        </Button>
      </div>

      {showTaskForm && <TaskForm onSubmit={createTask} onCancel={() => setShowTaskForm(false)} />}
      {editingTask && <TaskForm key={editingTask.id} initialValues={editingTask} onSubmit={updateTask} onCancel={() => setEditingTask(null)} />}

      <ActiveTaskList
        tasks={activeTasks}
        onComplete={completeTask}
        onEdit={(task) => { setShowTaskForm(false); setEditingTask(task); }}
        onDelete={(id) => setTaskToDelete(activeTasks.find((task) => task.id === id) ?? null)}
        onReorder={reorderTasks}
      />
      <CompletedTaskList
        tasks={completedTasks}
        onRestore={restoreTask}
        onDelete={(id) => setTaskToDelete(completedTasks.find((task) => task.id === id) ?? null)}
      />

      <ConfirmDialog
        isOpen={taskToDelete !== null}
        title="Delete task?"
        message={taskToDelete ? `“${taskToDelete.name}” will be removed.` : ''}
        confirmLabel="Delete task"
        isDangerous
        onConfirm={deleteTask}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}
