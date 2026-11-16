import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ServiceItem } from '@psicoiris/database';
import { Reveal, StaggerGroup } from '@psicoiris/motion';
import { Badge, EditorialCard } from '@psicoiris/ui';

export interface ServicesSectionProps {
  services: ServiceItem[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="acompanamiento" className="w-full bg-surface py-space-xl lg:py-space-2xl">
      <div className="mx-auto w-full max-w-[1200px] px-margin md:px-gutter-desktop lg:px-margin-desktop">
        <Reveal className="mb-space-xl max-w-2xl">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
            Áreas de Acompañamiento
          </span>
          <h2 className="mb-space-xs font-serif text-[2rem] font-normal leading-[1.25] tracking-[-0.01em] text-plum-ink lg:text-[2.5rem]">
            Un camino compartido hacia tu bienestar
          </h2>
          <p className="text-base leading-[1.65] text-on-surface-variant">
            Trabajamos sobre lo que te ocurre hoy, dotando de sentido tu historia para abrir
            posibilidades de acción más conscientes y equilibradas.
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:gap-gutter-desktop">
          {services.map((service) => (
            <div key={service.title} data-stagger>
              <EditorialCard
                className="h-full transition-colors duration-200 hover:border-primary/50"
                eyebrow={
                  <Badge variant="lavender" className="normal-case tracking-normal">
                    {service.tag}
                  </Badge>
                }
                title={service.title}
                description={service.description}
                footer={
                  <Link
                    href="/#contacto"
                    className="inline-flex min-h-[48px] items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-accent"
                  >
                    <span>Conocer más</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                }
              />
            </div>
          ))}
        </StaggerGroup>

        <p className="mt-space-lg text-center text-sm italic text-on-surface-variant">
          * Práctica basada en la evidencia clínica: sin diagnósticos reduccionistas ni
          promesas de soluciones milagrosas instantáneas.
        </p>
      </div>
    </section>
  );
}
