import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

export interface SectionItemProps {
  id: string;
  name: string;
  isActive: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

export default function SectionItem({ name, isActive, onSelect, onRename, onDelete }: SectionItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (isRenaming) inputRef.current?.focus();
  }, [isRenaming]);

  const commitRename = () => {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      return;
    }
    const trimmedName = draft.trim();
    if (trimmedName) onRename(trimmedName);
    else setDraft(name);
    setIsRenaming(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      inputRef.current?.blur();
    } else if (event.key === 'Escape') {
      cancelledRef.current = true;
      setDraft(name);
      setIsRenaming(false);
    }
  };

  return (
    <div className={`group mx-1 flex items-center rounded px-3 py-2 ${isActive ? 'border-l-2 border-accent bg-bg-tertiary text-text-primary' : 'cursor-pointer text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}`}>
      {isRenaming ? (
        <input
          ref={inputRef}
          aria-label={`Rename ${name}`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitRename}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 rounded border border-border-base bg-bg-primary px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        />
      ) : (
        <>
          <button type="button" onClick={onSelect} className="min-w-0 flex-1 truncate text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-current={isActive ? 'page' : undefined}>
            {name}
          </button>
          <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
            <Button variant="ghost" size="sm" aria-label={`Rename ${name}`} onClick={() => { setDraft(name); setIsRenaming(true); }} className="px-1.5 py-1">
              <Pencil aria-hidden="true" size={14} />
            </Button>
            <Button variant="ghost" size="sm" aria-label={`Delete ${name}`} onClick={onDelete} className="px-1.5 py-1 hover:text-accent">
              <Trash2 aria-hidden="true" size={14} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
