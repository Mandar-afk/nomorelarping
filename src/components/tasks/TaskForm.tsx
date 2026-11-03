import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Priority, Task } from '../../types';
import Button from '../ui/Button';
import Input, { Textarea } from '../ui/Input';

export interface TaskFormData {
  name: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
}

export interface TaskFormProps {
  initialValues?: Partial<Task>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export default function TaskForm({ initialValues, onSubmit, onCancel }: TaskFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [priority, setPriority] = useState<Priority>(initialValues?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ?? '');
  const [error, setError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name is required');
      return;
    }
    onSubmit({
      name: trimmedName,
      ...(description.trim() ? { description: description.trim() } : {}),
      priority,
      ...(dueDate ? { dueDate } : {}),
    });
  };

  return (
    <form noValidate onSubmit={submit} className="mb-6 space-y-4 rounded-lg border border-border-base bg-bg-secondary p-4">
      <Input
        ref={nameRef}
        label="Task name"
        required
        value={name}
        error={error}
        onChange={(event) => { setName(event.target.value); setError(''); }}
      />
      <Textarea label="Description (optional)" rows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
      <div>
        <label htmlFor="task-priority" className="mb-1.5 block text-sm font-medium text-text-primary">Priority</label>
        <select id="task-priority" value={priority} onChange={(event) => setPriority(event.target.value as Priority)} className="w-full rounded border border-border-base bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <Input type="date" label="Due date (optional)" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialValues ? 'Save changes' : 'Save task'}</Button>
      </div>
    </form>
  );
}
