import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import EmptyState from '../ui/EmptyState';
import TaskItem from './TaskItem';

interface SortableTaskItemProps {
  task: Task;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableTaskItem({ task, onComplete, onEdit, onDelete }: SortableTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-label={`Task ${task.name}`}
      aria-roledescription="sortable task"
    >
      <TaskItem
        task={task}
        onComplete={onComplete}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </li>
  );
}

export interface ActiveTaskListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onReorder: (ids: string[]) => void;
}

export default function ActiveTaskList({ tasks, onComplete, onEdit, onDelete, onReorder }: ActiveTaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex((task) => task.id === active.id);
    const newIndex = tasks.findIndex((task) => task.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(tasks, oldIndex, newIndex);
    onReorder(reordered.map((task) => task.id));
  };

  if (tasks.length === 0) {
    return <EmptyState title="No active tasks" description="Add a task to get started." />;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <ul className="divide-y divide-border-base/60" aria-label="Active tasks">
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              onComplete={() => onComplete(task.id)}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
