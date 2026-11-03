import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Task } from '../../types';
import Button from '../ui/Button';
import TaskItem from './TaskItem';

export interface CompletedTaskListProps {
  tasks: Task[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CompletedTaskList({ tasks, onRestore, onDelete }: CompletedTaskListProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  if (tasks.length === 0) return null;

  return (
    <section className="mt-8 border-t border-border-base pt-4">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        aria-expanded={isExpanded}
        className="w-full justify-start px-1 py-2 text-sm font-medium"
      >
        {isExpanded ? <ChevronDown aria-hidden="true" size={16} /> : <ChevronRight aria-hidden="true" size={16} />}
        Completed ({tasks.length})
      </Button>
      {isExpanded && (
        <ul className="divide-y divide-border-base/60" aria-label="Completed tasks">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskItem task={task} onRestore={() => onRestore(task.id)} onDelete={() => onDelete(task.id)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
