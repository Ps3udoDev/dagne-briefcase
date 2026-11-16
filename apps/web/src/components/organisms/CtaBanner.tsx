import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { Reveal } from '@psicoiris/motion';

export function CtaBanner() {
  return (
    <section className="w-full bg-surface py-space-lg">
      <div className="mx-auto w-full max-w-[1200px] px-margin md:px-gutter-desktop lg:px-margin-desktop">
        <Reveal>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-surface-container-high p-space-lg text-center shadow-calmed md:p-space-2xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-secondary-container/50 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-surface-bright/80 blur-2xl"
            />

            <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
              <span className="mb-space-sm flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary shadow-sm">
                <Heart aria-hidden="true" className="h-5 w-5" />
              </span>

              <h2 className="mb-space-xs font-serif text-[2rem] font-normal leading-[1.25] tracking-[-0.01em] text-plum-ink lg:text-[2.5rem]">
                Dar el primer paso también es una forma de cuidarte
              </h2>

              <p className="mb-space-lg text-base leading-relaxed text-on-surface-variant">
                Si sientes que es el momento de dedicarte un tiempo de escucha genuina,
                podemos agendar un primer encuentro para conocernos.
              </p>

              <Link
                href="/#contacto"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-on-primary shadow-calmed transition-colors hover:bg-primary-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <span>Solicitar una primera consulta</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
