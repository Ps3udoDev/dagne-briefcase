'use client';

import dynamic from 'next/dynamic';

const AmbientCanvas = dynamic(
  () => import('@psicoiris/motion').then((mod) => mod.AmbientCanvas),
  { ssr: false }
);

export function HeroAmbient() {
  return (
    <AmbientCanvas
      particleCount={42}
      className="pointer-events-none absolute inset-0 z-0 opacity-75"
    />
  );
}
