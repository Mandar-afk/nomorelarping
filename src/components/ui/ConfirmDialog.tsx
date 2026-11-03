import Modal from './Modal';
import Button from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} maxWidth="sm">
      <p className="text-sm text-text-secondary">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant={isDangerous ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
