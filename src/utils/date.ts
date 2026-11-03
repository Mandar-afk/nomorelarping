export function formatDueDate(isoDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${isoDate}T00:00:00`);

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 0) return `Overdue · ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isOverdue(isoDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${isoDate}T00:00:00`);
  return due < today;
}
