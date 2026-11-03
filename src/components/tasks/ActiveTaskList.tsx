import type { Task } from '../../types';
import EmptyState from '../ui/EmptyState';
import TaskItem from './TaskItem';

export interface ActiveTaskListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onReorder: (ids: string[]) => void;
}

export default function ActiveTaskList({ tasks, onComplete, onEdit, onDelete }: ActiveTaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState title="No active tasks" description="Add a task to get started." />;
  }

  // TODO Phase 3: wrap in DndContext and SortableContext
  return (
    <ul className="divide-y divide-border-base/60" aria-label="Active tasks">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem
            task={task}
            onComplete={() => onComplete(task.id)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
          />
        </li>
      ))}
    </ul>
  );
}
