import { Compass, MessageCircle, TrendingUp } from 'lucide-react';
import type { ProcessStep } from '@psicoiris/database';
import { Reveal, StaggerGroup } from '@psicoiris/motion';

const STEP_ICONS = [MessageCircle, Compass, TrendingUp] as const;

export interface ProcessSectionProps {
  steps: ProcessStep[];
}

export function ProcessSection({ steps }: ProcessSectionProps) {
  return (
    <section id="proceso" className="w-full bg-surface py-space-xl lg:py-space-2xl">
      <div className="mx-auto w-full max-w-[1200px] px-margin md:px-gutter-desktop lg:px-margin-desktop">
        <Reveal className="mx-auto mb-space-xl max-w-2xl text-center">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
            Paso a paso
          </span>
          <h2 className="font-serif text-[2rem] font-normal leading-[1.25] tracking-[-0.01em] text-plum-ink lg:text-[2.5rem]">
            Un proceso claro y transparente
          </h2>
          <p className="mt-2 text-base leading-[1.65] text-on-surface-variant">
            Comenzar terapia suele suscitar dudas. Así es como transitamos desde el primer
            contacto hasta el desarrollo de tus sesiones.
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-gutter md:grid-cols-3 lg:gap-gutter-desktop">
          {steps.map((item, idx) => {
            const Icon = STEP_ICONS[idx % STEP_ICONS.length]!;
            return (
              <div
                key={item.step}
                data-stagger
                className="flex h-full flex-col gap-space-sm rounded-2xl bg-surface-container-low p-space-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-4xl font-normal text-primary/40">
                    {item.step}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high text-primary">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="font-serif text-xl font-medium text-plum-ink md:text-2xl">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
