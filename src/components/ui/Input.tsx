import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = '', ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-primary">{label}</label>}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        className={`w-full bg-bg-tertiary border ${error ? 'border-accent' : 'border-border-base'} rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${className}`}
        {...props}
      />
      {error && <p id={messageId} className="mt-1 text-xs text-accent" role="alert">{error}</p>}
      {!error && hint && <p id={messageId} className="mt-1 text-xs text-text-secondary">{hint}</p>}
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, id, className = '', rows = 3, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-primary">{label}</label>}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        className={`w-full resize-none bg-bg-tertiary border ${error ? 'border-accent' : 'border-border-base'} rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${className}`}
        {...props}
      />
      {error && <p id={messageId} className="mt-1 text-xs text-accent" role="alert">{error}</p>}
      {!error && hint && <p id={messageId} className="mt-1 text-xs text-text-secondary">{hint}</p>}
    </div>
  );
});

export default Input;
