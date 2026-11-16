'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from 'lucide-react';
import { createBrowserSupabaseClient } from '@psicoiris/database';
import { BrandMark, Button, cn } from '@psicoiris/ui';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  matchExact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Resumen', icon: LayoutDashboard, matchExact: true },
  { href: '/perfil', label: 'Portafolio', icon: UserRound },
  { href: '/posts', label: 'Publicaciones', icon: FileText },
  { href: '/solicitudes', label: 'Solicitudes', icon: Inbox },
];

export interface DashboardShellProps {
  userEmail: string;
  children: ReactNode;
}

export function DashboardShell({ userEmail, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  function isActive(item: NavItem): boolean {
    if (item.matchExact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  const navLinks = (
    <nav aria-label="Navegación principal" className="flex flex-col gap-1.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              active
                ? 'bg-lavender-soft/80 text-plum-ink'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-plum-ink'
            )}
          >
            <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      {/* Mobile / Tablet Topbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-mauve-border/60 bg-surface-container-lowest/95 px-5 py-3 backdrop-blur-sm lg:hidden">
        <Link
          href="/"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <BrandMark size={34} subtitle="Panel Clínico" />
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border border-mauve-border/70 bg-surface-container-lowest text-plum-ink transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          className="border-b border-mauve-border/60 bg-surface-container-lowest px-5 py-4 lg:hidden"
        >
          {navLinks}
          <div className="mt-4 flex flex-col gap-3 border-t border-mauve-border/50 pt-4">
            <p className="truncate text-xs text-on-surface-variant">
              Sesión: <span className="font-medium text-plum-ink">{userEmail}</span>
            </p>
            <Button
              variant="secondary"
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full justify-center"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {signingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-mauve-border/60 bg-surface-container-lowest px-5 py-6 lg:flex">
        <div className="space-y-8">
          <Link
            href="/"
            className="inline-block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <BrandMark size={38} subtitle="Panel Clínico" />
          </Link>
          {navLinks}
        </div>

        <div className="space-y-3 border-t border-mauve-border/50 pt-4">
          <p className="truncate text-xs text-on-surface-variant" title={userEmail}>
            {userEmail}
          </p>
          <Button
            variant="secondary"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full justify-center"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {signingOut ? 'Saliendo...' : 'Cerrar sesión'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
