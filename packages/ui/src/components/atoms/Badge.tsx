import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type BadgeVariant = 'lavender' | 'rose' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  lavender: 'bg-lavender-soft text-plum-ink',
  rose: 'bg-rose-dust text-plum-ink',
  outline: 'border border-mauve-border bg-surface-container-lowest text-on-surface-variant',
};

export function Badge({
  className,
  variant = 'lavender',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3.5 py-1 text-xs font-medium tracking-wide',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
