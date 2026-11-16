import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface EditorialCardProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
}

export function EditorialCard({
  eyebrow,
  title,
  description,
  footer,
  children,
  className,
  ...props
}: EditorialCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col justify-between rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8',
        className
      )}
      {...props}
    >
      <div className="space-y-3">
        {eyebrow && (
          <div className="text-xs font-medium uppercase tracking-wider text-primary">
            {eyebrow}
          </div>
        )}
        {title && (
          <h3 className="font-serif text-xl font-normal leading-snug text-plum-ink md:text-2xl">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
            {description}
          </p>
        )}
        {children}
      </div>
      {footer && (
        <div className="mt-6 border-t border-mauve-border/40 pt-4">
          {footer}
        </div>
      )}
    </article>
  );
}
