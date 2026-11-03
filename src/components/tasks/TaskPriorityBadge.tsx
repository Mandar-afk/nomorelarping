import type { Priority } from '../../types';

export interface TaskPriorityBadgeProps {
  priority: Priority;
}

const styles: Record<Priority, string> = {
  high: 'bg-accent/20 text-accent',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-bg-tertiary text-text-disabled',
};

const labels: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export default function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  return <span className={`rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${styles[priority]}`}>{labels[priority]}</span>;
}
