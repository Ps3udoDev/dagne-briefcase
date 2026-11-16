import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, Calendar, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import type { SiteProfile } from '@psicoiris/database';
import { Reveal, ScrollDrift } from '@psicoiris/motion';
import { Badge, BrandMark } from '@psicoiris/ui';
import { HeroAmbient } from './HeroAmbient';

export interface HeroSectionProps {
  profile: SiteProfile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-surface py-space-xl lg:py-space-2xl">
      <HeroAmbient />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-secondary-container/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-surface-container-high/60 blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-margin md:px-gutter-desktop lg:px-margin-desktop">
        <div className="grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12">
          <Reveal className="flex flex-col items-start lg:col-span-7">
            <Badge variant="lavender" className="mb-space-sm gap-2 px-3.5 py-1.5 uppercase tracking-widest text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              <span>{profile.hero_badge}</span>
            </Badge>

            <h1 className="mb-space-md font-serif text-[2.5rem] font-normal leading-[1.15] tracking-[-0.015em] text-plum-ink lg:text-[3.5rem] lg:tracking-[-0.02em]">
              {profile.hero_title}
            </h1>

            <p className="mb-space-lg max-w-xl text-base leading-[1.7] text-on-surface-variant md:text-lg">
              {profile.hero_subtitle}
            </p>

            <div className="flex w-full flex-col items-stretch gap-space-sm sm:w-auto sm:flex-row sm:items-center">
              <Link
                href="/#contacto"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-on-primary shadow-calmed transition-colors hover:bg-primary-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <span>Solicitar una primera consulta</span>
                <Calendar aria-hidden="true" className="h-4 w-4" />
              </Link>

              <Link
                href="/#sobre-mi"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-mauve-border bg-lavender-soft/50 px-6 py-3.5 text-base font-medium text-plum-ink transition-colors hover:bg-lavender-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <span>Conoce mi enfoque</span>
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-space-lg flex flex-wrap items-center gap-x-space-md gap-y-2 text-xs font-semibold tracking-wide text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" />
                <span>{profile.professional_license || 'Colegiada Oficial'}</span>
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-outline-variant" />
              <span className="inline-flex items-center gap-1.5">
                <Lock aria-hidden="true" className="h-4 w-4 text-primary" />
                <span>100% Confidencial</span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative mt-space-md lg:col-span-5 lg:mt-0">
            <ScrollDrift>
              <div className="relative rounded-3xl bg-surface-container-low p-3 shadow-calmed">
              <div className="relative overflow-hidden rounded-2xl">
                {profile.hero_image_url ? (
                  <Image
                    src={profile.hero_image_url}
                    alt={`${profile.clinician_name} - ${profile.clinician_title}`}
                    width={640}
                    height={720}
                    priority
                    className="h-[380px] w-full object-cover md:h-[480px]"
                  />
                ) : (
                  <div className="flex h-[380px] w-full flex-col items-center justify-center bg-gradient-to-br from-surface-container-lowest via-rose-dust to-lavender-soft/70 p-8 text-center md:h-[480px]">
                    <BrandMark size={84} showWordmark={false} className="mb-6" />
                    <p className="font-serif text-2xl italic text-plum-ink">
                      {profile.clinician_name}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                      {profile.clinician_title}
                    </p>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-surface-container-highest/90 via-surface-container-highest/40 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-surface/95 px-4 py-3 shadow-sm backdrop-blur-md">
                  <p className="text-sm leading-snug text-on-surface-variant">
                    {profile.modality_summary}
                  </p>
                </div>
              </div>

              <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-medium text-plum-ink shadow-calmed absolute -left-4 -top-4">
                <Sparkles aria-hidden="true" className="h-4 w-4 text-primary" />
                <span>Espacio sereno &amp; seguro</span>
              </div>
            </div>
            </ScrollDrift>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
