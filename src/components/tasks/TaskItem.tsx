import { CheckCircle2, Circle, GripVertical, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import type { Task } from '../../types';
import { formatDueDate, isOverdue } from '../../utils/date';
import Button from '../ui/Button';
import TaskPriorityBadge from './TaskPriorityBadge';

export interface TaskItemProps {
  task: Task;
  onComplete?: () => void;
  onRestore?: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export default function TaskItem({ task, onComplete, onRestore, onEdit, onDelete, isDragging = false }: TaskItemProps) {
  if (task.completed) {
    return (
      <div className={`group flex items-center gap-3 rounded px-3 py-3 opacity-60 hover:bg-bg-tertiary ${isDragging ? 'opacity-40' : ''}`}>
        <CheckCircle2 aria-hidden="true" className="shrink-0 text-text-disabled" size={18} />
        <span className="flex-1 text-sm text-text-disabled line-through">{task.name}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
          <Button variant="ghost" size="sm" aria-label={`Restore ${task.name}`} onClick={onRestore} className="px-1.5 py-1 text-text-disabled hover:text-text-primary">
            <RotateCcw aria-hidden="true" size={16} />
          </Button>
          <Button variant="ghost" size="sm" aria-label={`Delete ${task.name}`} onClick={onDelete} className="px-1.5 py-1 text-text-disabled hover:text-accent">
            <Trash2 aria-hidden="true" size={16} />
          </Button>
        </div>
      </div>
    );
  }

  const overdue = task.dueDate ? isOverdue(task.dueDate) : false;

  return (
    <div className={`group flex items-center gap-3 rounded border border-transparent px-3 py-3 hover:border-border-base hover:bg-bg-tertiary ${isDragging ? 'opacity-40' : ''}`}>
      <GripVertical aria-hidden="true" className="shrink-0 cursor-grab text-text-disabled opacity-0 group-hover:opacity-100" size={16} />
      <Button variant="ghost" size="sm" aria-label={`Complete ${task.name}`} onClick={onComplete} className="shrink-0 px-0 text-text-secondary hover:text-accent">
        <Circle aria-hidden="true" size={19} />
      </Button>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
        <span className="min-w-0 flex-1 text-sm text-text-primary">{task.name}</span>
        {task.description && <p className="basis-full truncate text-xs text-text-secondary">{task.description}</p>}
        <TaskPriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className={`text-xs ${overdue ? 'text-accent' : 'text-text-secondary'}`}>
            {overdue && <span className="sr-only">Warning: </span>}{formatDueDate(task.dueDate)}
          </span>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
        {onEdit && (
          <Button variant="ghost" size="sm" aria-label={`Edit ${task.name}`} onClick={onEdit} className="px-1.5 py-1 text-text-disabled hover:text-text-primary">
            <Pencil aria-hidden="true" size={16} />
          </Button>
        )}
        <Button variant="ghost" size="sm" aria-label={`Delete ${task.name}`} onClick={onDelete} className="px-1.5 py-1 text-text-disabled hover:text-accent">
          <Trash2 aria-hidden="true" size={16} />
        </Button>
      </div>
    </div>
  );
}
