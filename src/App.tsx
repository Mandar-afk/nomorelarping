import { useState } from 'react';
import AppShell from './components/layout/AppShell';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import TaskBoard from './components/tasks/TaskBoard';

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeSectionName, setActiveSectionName] = useState<string | null>(null);

  return (
    <AppShell
      sidebar={
        <Sidebar
          onSectionSelect={(id, name) => {
            setActiveSectionId(id || null);
            setActiveSectionName(name || null);
          }}
        />
      }
    >
      <TopBar sectionName={activeSectionName} />
      <div className="flex-1 overflow-y-auto p-6">
        <TaskBoard sectionId={activeSectionId} />
      </div>
    </AppShell>
  );
}
