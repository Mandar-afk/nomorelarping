import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  loading?: boolean;
}

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-muted',
  secondary: 'bg-bg-tertiary text-text-primary border border-border-base hover:bg-bg-secondary',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary',
  danger: 'bg-transparent text-accent border border-accent hover:bg-accent hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className = '', type = 'button', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

export default Button;
