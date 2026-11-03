import AppShell from './components/layout/AppShell';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import TaskBoard from './components/tasks/TaskBoard';
import { useAppContext } from './context/AppContext';

function AppContent() {
  const { sections, activeSectionId } = useAppContext();
  const activeSection = sections.find((section) => section.id === activeSectionId) ?? null;

  return (
    <AppShell sidebar={<Sidebar />}>
      <TopBar sectionName={activeSection?.name ?? null} />
      <div className="flex-1 overflow-y-auto p-6">
        <TaskBoard sectionId={activeSectionId} />
      </div>
    </AppShell>
  );
}

export default function App() {
  return <AppContent />;
}
