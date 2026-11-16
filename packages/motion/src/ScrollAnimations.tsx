import type { ReactNode } from 'react';

export interface ScrollProgressBarProps {
  className?: string;
}

/**
 * Barra superior de progreso lector impulsada por CSS Scroll-Driven Animations
 * (animation-timeline: scroll()) sin listeners JS en scroll.
 */
export function ScrollProgressBar({ className = '' }: ScrollProgressBarProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-[#E8D3EC] via-[#9F73AB] to-[#754d82] scroll-progress-bar ${className}`}
    />
  );
}

export interface ScrollDriftProps {
  children: ReactNode;
  className?: string;
}

/**
 * Contenedor con desplazamiento editorial sutil ligado al scroll mediante
 * CSS animation-timeline: view() dentro de prefers-reduced-motion: no-preference.
 */
export function ScrollDrift({ children, className = '' }: ScrollDriftProps) {
  return <div className={`scroll-drift ${className}`}>{children}</div>;
}
