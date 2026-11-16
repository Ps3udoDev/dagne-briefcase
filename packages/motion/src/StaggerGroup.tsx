'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import anime from 'animejs';

export interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  staggerMs?: number;
  duration?: number;
  y?: number;
}

/**
 * Anima en cascada los elementos hijos marcados con `data-stagger`
 * usando propiedades compositoras (opacity + transform) y respetando reduced-motion.
 */
export function StaggerGroup({
  children,
  className,
  staggerMs = 95,
  duration = 700,
  y = 22,
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>('[data-stagger]')
    );
    if (items.length === 0) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      items.forEach((item) => {
        item.style.opacity = '1';
        item.style.transform = 'none';
      });
      return;
    }

    items.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = `translateY(${y}px) scale(0.98)`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        anime({
          targets: items,
          opacity: [0, 1],
          translateY: [y, 0],
          scale: [0.98, 1],
          duration,
          delay: anime.stagger(staggerMs),
          easing: 'easeOutExpo',
        });
        observer.disconnect();
      },
      { threshold: 0.12 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [duration, staggerMs, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
