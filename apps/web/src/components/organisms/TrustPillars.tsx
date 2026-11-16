import { Compass, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Reveal } from '@psicoiris/motion';

const PILLARS = [
  {
    icon: HeartHandshake,
    title: 'Escucha sin juicio',
    description:
      'Un espacio seguro donde cada experiencia y emoción es acogida con respeto absoluto y escucha atenta.',
  },
  {
    icon: Compass,
    title: 'Acompañamiento personalizado',
    description:
      'Planes terapéuticos adaptados a tu historia personal, tus necesidades específicas y tus tiempos particulares.',
  },
  {
    icon: ShieldCheck,
    title: 'Espacio confidencial',
    description:
      'Privacidad rigurosa y código deontológico estricto que garantizan la reserva de cada sesión de consulta.',
  },
] as const;

export function TrustPillars() {
  return (
    <section className="w-full bg-surface-container-lowest py-space-lg lg:py-space-xl">
      <div className="mx-auto w-full max-w-[1200px] px-margin md:px-gutter-desktop lg:px-margin-desktop">
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={index * 80}>
                <div className="flex h-full flex-col gap-space-xs rounded-2xl bg-surface-container-low p-space-md transition-shadow duration-300 hover:shadow-calmed">
                  <div className="mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif text-xl font-medium leading-snug text-plum-ink md:text-2xl">
                    {pillar.title}
                  </h2>
                  <p className="text-base leading-[1.65] text-on-surface-variant">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
