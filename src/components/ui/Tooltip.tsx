import type { ReactNode } from 'react';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const sides = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
};

export default function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded border border-border-base bg-bg-tertiary px-2 py-1 text-xs text-text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${sides[side]}`}
      >
        {content}
      </span>
    </span>
  );
}
