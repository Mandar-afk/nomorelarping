import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';
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
  const { activeTasks, completedTasks, isLoading, error, createTask, updateTask, deleteTask, completeTask, restoreTask, reorderTasks } = useTasks(sectionId);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  if (sectionId === null) {
    return <EmptyState title="No section selected" description="Choose a section from the sidebar to get started." />;
  }

  const handleCreate = (data: TaskFormData) => {
    createTask(data);
    setShowTaskForm(false);
  };

  const handleUpdate = (data: TaskFormData) => {
    if (!editingTask) return;
    updateTask(editingTask.id, { ...data, description: data.description, dueDate: data.dueDate });
    setEditingTask(null);
  };

  const handleDelete = () => {
    if (!taskToDelete) return;
    deleteTask(taskToDelete.id);
    setTaskToDelete(null);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => { setEditingTask(null); setShowTaskForm(true); }}>
          <Plus aria-hidden="true" size={16} /> New Task
        </Button>
      </div>

      {showTaskForm && <TaskForm onSubmit={handleCreate} onCancel={() => setShowTaskForm(false)} />}
      {editingTask && <TaskForm key={editingTask.id} initialValues={editingTask} onSubmit={handleUpdate} onCancel={() => setEditingTask(null)} />}

      {error && <p className="mb-4 text-sm text-accent" role="alert">{error}</p>}
      {isLoading && activeTasks.length === 0 && completedTasks.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary" role="status">Loading tasks…</p>
      ) : (
        <>
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
        </>
      )}

      <ConfirmDialog
        isOpen={taskToDelete !== null}
        title="Delete task?"
        message={taskToDelete ? `“${taskToDelete.name}” will be removed.` : ''}
        confirmLabel="Delete task"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}
