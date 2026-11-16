import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';
import type { SiteProfile } from '@psicoiris/database';
import { Reveal, ScrollDrift } from '@psicoiris/motion';
import { BrandMark } from '@psicoiris/ui';

export interface AboutSectionProps {
  profile: SiteProfile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section
      id="sobre-mi"
      className="w-full bg-surface-container-low py-space-xl lg:py-space-2xl"
    >
      <div className="mx-auto w-full max-w-[1200px] px-margin md:px-gutter-desktop lg:px-margin-desktop">
        <div className="grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12">
          <Reveal className="flex flex-col items-start lg:col-span-7 lg:pr-space-md">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              Enfoque Clínico Integrativo
            </span>
            <h2 className="mb-space-md font-serif text-[2rem] font-normal leading-[1.2] tracking-[-0.01em] text-plum-ink lg:text-[2.5rem]">
              {profile.about_title}
            </h2>

            <div className="flex max-w-prose flex-col gap-space-sm text-base leading-[1.7] text-on-surface-variant">
              {profile.about_paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-space-md">
              <Link
                href="/#contacto"
                className="inline-flex min-h-[48px] items-center gap-2 text-sm font-semibold text-primary underline decoration-mauve-border underline-offset-8 transition-colors hover:text-primary-accent"
              >
                <span>Conoce más sobre mí y mi trayectoria</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex flex-col gap-space-md lg:col-span-5">
            <ScrollDrift>
              <div className="relative overflow-hidden rounded-3xl shadow-calmed">
              {profile.about_image_url ? (
                <Image
                  src={profile.about_image_url}
                  alt={`Consulta de ${profile.clinician_name}`}
                  width={600}
                  height={480}
                  className="h-[340px] w-full object-cover md:h-[420px]"
                />
              ) : (
                <div className="flex h-[340px] w-full flex-col items-center justify-center bg-gradient-to-br from-rose-dust via-surface-container-lowest to-lavender-soft/60 p-8 text-center md:h-[420px]">
                  <BrandMark size={64} showWordmark={false} className="mb-4" />
                  <p className="font-serif text-xl italic text-plum-ink">
                    Un encuentro humano con rigor clínico
                  </p>
                </div>
              )}
              </div>
            </ScrollDrift>

            <blockquote className="rounded-2xl bg-rose-dust p-space-md">
              <div className="flex items-start gap-3">
                <Quote
                  aria-hidden="true"
                  className="mt-0.5 h-6 w-6 shrink-0 text-primary"
                />
                <div>
                  <p className="font-serif text-xl italic leading-relaxed text-plum-ink">
                    “{profile.about_quote}”
                  </p>
                  <footer className="mt-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    — {profile.clinician_name}
                  </footer>
                </div>
              </div>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
