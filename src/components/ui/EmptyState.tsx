import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-text-disabled" aria-hidden="true">{icon}</div>}
      <h2 className="text-sm font-medium text-text-secondary">{title}</h2>
      {description && <p className="mt-1 text-sm text-text-disabled">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
