import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import type { SiteProfile } from '@psicoiris/database';
import { BrandMark } from '@psicoiris/ui';

export interface FooterProps {
  profile: SiteProfile;
}

export function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-surface-container bg-surface-container-low py-space-2xl text-on-surface">
      <div className="mx-auto w-full max-w-[1200px] px-margin md:px-gutter-desktop lg:px-margin-desktop">
        <div className="mb-space-xl grid grid-cols-1 gap-gutter-desktop md:grid-cols-12">
          <div className="flex flex-col gap-space-sm md:col-span-5">
            <Link href="/" className="inline-flex w-fit items-center">
              <BrandMark size={32} subtitle={profile.clinician_title} idPrefix="web-footer" />
            </Link>
            <p className="max-w-sm text-base leading-relaxed text-on-surface-variant">
              Un espacio de escucha analítica, contención serena y rigor profesional para
              acompañar procesos de transformación y bienestar psicológico.
            </p>
            <div className="mt-space-xs flex items-center gap-space-sm">
              {profile.contact_email && (
                <a
                  href={`mailto:${profile.contact_email}`}
                  aria-label="Enviar correo electrónico"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-primary hover:text-on-primary"
                >
                  <Mail aria-hidden="true" className="h-5 w-5" />
                </a>
              )}
              {profile.contact_phone && (
                <a
                  href={`tel:${profile.contact_phone.replace(/\s+/g, '')}`}
                  aria-label="Llamar por teléfono"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-primary hover:text-on-primary"
                >
                  <Phone aria-hidden="true" className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 md:col-span-3">
            <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-plum-ink">
              Navegación
            </span>
            <Link
              href="/#acompanamiento"
              className="inline-flex min-h-[40px] items-center text-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              Acompañamiento
            </Link>
            <Link
              href="/#sobre-mi"
              className="inline-flex min-h-[40px] items-center text-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              Sobre mí
            </Link>
            <Link
              href="/#proceso"
              className="inline-flex min-h-[40px] items-center text-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              Proceso terapéutico
            </Link>
            <Link
              href="/articulos"
              className="inline-flex min-h-[40px] items-center text-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              Artículos y Ensayos
            </Link>
            <Link
              href="/#contacto"
              className="inline-flex min-h-[40px] items-center text-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              Contacto y Citas
            </Link>
          </div>

          <div className="flex flex-col gap-space-xs md:col-span-4">
            <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-plum-ink">
              Deontología &amp; Confidencialidad
            </span>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Los datos enviados mediante el formulario se tratan bajo secreto profesional
              exclusivamente para coordinar tu consulta.
            </p>
            {profile.professional_license && (
              <div className="mt-space-xs rounded-xl bg-surface-container p-space-sm text-sm italic text-on-surface-variant">
                {profile.professional_license}. Consulta sanitaria autorizada.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-space-sm border-t border-surface-container pt-space-lg text-center">
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-on-surface-variant">
            Este sitio ofrece información general y no sustituye una evaluación
            psicológica profesional ni la atención de emergencia.
          </p>
          <div className="flex flex-col items-center justify-between gap-2 pt-space-xs text-xs font-semibold text-on-surface-variant sm:flex-row">
            <p>
              © {year} {profile.clinician_name} · {profile.brand_name}. Todos los
              derechos reservados.
            </p>
            <p>Atención Presencial &amp; Telepsicología</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
