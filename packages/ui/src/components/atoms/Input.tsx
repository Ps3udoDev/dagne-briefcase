import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const fieldBaseClasses =
  'w-full min-h-[48px] rounded-xl border border-mauve-border bg-surface-container-lowest px-4 py-3 text-base text-on-surface placeholder:text-on-surface-variant/60 transition-colors duration-150 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 [&:user-invalid]:border-error [&:user-invalid]:bg-error/5 aria-[invalid=true]:border-error aria-[invalid=true]:bg-error/5 disabled:cursor-not-allowed disabled:opacity-50';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBaseClasses, className)} {...props} />
  )
);

Input.displayName = 'Input';
