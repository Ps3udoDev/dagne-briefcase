import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from 'react';
import * as Label from '@radix-ui/react-label';
import { cn } from '../../lib/cn';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const fieldId = htmlFor ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const control = isValidElement(children)
    ? cloneElement(
        children as ReactElement<{
          id?: string;
          'aria-describedby'?: string;
          'aria-invalid'?: boolean;
        }>,
        {
          id: (children.props as { id?: string }).id ?? fieldId,
          'aria-describedby':
            (children.props as { 'aria-describedby'?: string })[
              'aria-describedby'
            ] ?? describedBy,
          'aria-invalid':
            (children.props as { 'aria-invalid'?: boolean })['aria-invalid'] ??
            (error ? true : undefined),
        }
      )
    : children;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label.Root
        htmlFor={fieldId}
        className="text-sm font-medium text-on-surface"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-primary">
            *
          </span>
        )}
      </Label.Root>

      {hint && (
        <p id={hintId} className="text-xs leading-relaxed text-on-surface-variant">
          {hint}
        </p>
      )}

      {control}

      {error && (
        <p id={errorId} role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
