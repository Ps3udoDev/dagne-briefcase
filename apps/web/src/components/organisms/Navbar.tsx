'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { BrandMark } from '@psicoiris/ui';

const NAV_LINKS = [
  { href: '/#acompanamiento', label: 'Acompañamiento' },
  { href: '/#sobre-mi', label: 'Sobre mí' },
  { href: '/#proceso', label: 'Proceso' },
  { href: '/articulos', label: 'Artículos', matchPrefix: '/articulos' },
  { href: '/#contacto', label: 'Contacto' },
] as const;

export interface NavbarProps {
  brandName?: string;
  clinicianTitle?: string;
}

export function Navbar({ clinicianTitle = 'Psicología Clínica' }: NavbarProps) {
  const pathname = usePathname();
  const popoverRef = useRef<HTMLUListElement>(null);

  const closeMobileNav = () => {
    const el = popoverRef.current as (HTMLUListElement & { hidePopover?: () => void }) | null;
    if (el && typeof el.hidePopover === 'function') {
      try {
        el.hidePopover();
      } catch {
        // Ignore if already closed
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-container bg-surface-container-lowest/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between gap-space-md px-margin md:px-gutter-desktop lg:px-margin-desktop">
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          aria-label="Inicio · Psicoiris"
        >
          <BrandMark size={36} subtitle={clinicianTitle} />
        </Link>

        <nav aria-label="Navegación principal" className="flex items-center gap-space-sm">
          <div className="hidden lg:flex lg:items-center lg:gap-7">
            {NAV_LINKS.map((item) => {
              const isCurrent =
                'matchPrefix' in item && item.matchPrefix
                  ? pathname?.startsWith(item.matchPrefix)
                  : false;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={
                    isCurrent
                      ? 'text-sm font-semibold text-primary underline decoration-mauve-border decoration-2 underline-offset-8'
                      : 'text-sm font-medium text-on-surface-variant transition-colors hover:text-primary'
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/#contacto"
            className="hidden sm:inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary shadow-calmed transition-colors hover:bg-primary-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Solicitar consulta
          </Link>

          <button
            type="button"
            aria-controls="mobile-nav"
            {...({
              popoverTarget: 'mobile-nav',
              popoverTargetAction: 'toggle',
            } as Record<string, string>)}
            className="menu-trigger inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-full border border-mauve-border/70 bg-surface-container-low px-3.5 text-sm font-medium text-plum-ink transition-colors hover:bg-lavender-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
          >
            <Menu aria-hidden="true" className="h-5 w-5 text-primary" />
            <span>Menú</span>
          </button>

          <ul
            ref={popoverRef}
            id="mobile-nav"
            {...({ popover: 'auto' } as Record<string, string>)}
            className="mobile-nav-popover rounded-2xl border border-mauve-border/70 bg-surface-container-lowest p-4 shadow-calmed lg:hidden"
          >
            {NAV_LINKS.map((item) => {
              const isCurrent =
                'matchPrefix' in item && item.matchPrefix
                  ? pathname?.startsWith(item.matchPrefix)
                  : false;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobileNav}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={
                      isCurrent
                        ? 'flex min-h-[48px] items-center rounded-xl bg-lavender-soft/60 px-4 text-base font-semibold text-primary'
                        : 'flex min-h-[48px] items-center rounded-xl px-4 text-base font-medium text-on-surface transition-colors hover:bg-surface-container-low hover:text-primary'
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 border-t border-surface-container pt-3">
              <Link
                href="/#contacto"
                onClick={closeMobileNav}
                className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-base font-medium text-on-primary shadow-calmed transition-colors hover:bg-primary-accent"
              >
                Solicitar primera consulta
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
