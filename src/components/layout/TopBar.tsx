interface TopBarProps {
  sectionName: string | null;
}

export default function TopBar({ sectionName }: TopBarProps) {
  return (
    <header className="flex items-center border-b border-border-base px-6 py-4">
      <h1 className={sectionName ? 'text-xl font-semibold text-text-primary' : 'text-xl font-semibold text-text-disabled'}>
        {sectionName ?? 'Select a section'}
      </h1>
    </header>
  );
}
