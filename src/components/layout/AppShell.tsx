import type { ReactNode } from 'react';

export interface AppShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-r border-border-base bg-bg-secondary">
        {sidebar}
      </aside>
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
