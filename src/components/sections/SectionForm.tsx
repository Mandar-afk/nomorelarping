import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Check, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export interface SectionFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export default function SectionForm({ onSubmit, onCancel }: SectionFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Section name is required');
      return;
    }
    onSubmit(trimmedName);
    setName('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') onCancel();
  };

  return (
    <form onSubmit={submit} className="mt-2 space-y-2 px-2">
      <Input
        ref={inputRef}
        aria-label="Section name"
        placeholder="Section name…"
        value={name}
        error={error}
        onChange={(event) => { setName(event.target.value); setError(''); }}
        onKeyDown={handleKeyDown}
      />
      <div className="flex justify-end gap-1">
        <Button aria-label="Create section" type="submit" size="sm"><Check aria-hidden="true" size={16} /></Button>
        <Button aria-label="Cancel section creation" variant="ghost" size="sm" onClick={onCancel}><X aria-hidden="true" size={16} /></Button>
      </div>
    </form>
  );
}
