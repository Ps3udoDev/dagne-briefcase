import Link from 'next/link';
import { ArrowRight, FilePlus2, FileText, Inbox, UserRound } from 'lucide-react';
import { getAllPostsForAdmin, getContactRequests } from '@psicoiris/database';
import { EditorialCard } from '@psicoiris/ui';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  const [posts, requests] = await Promise.all([
    getAllPostsForAdmin(),
    getContactRequests(),
  ]);

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const newRequestsCount = requests.filter((r) => r.status === 'new').length;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Serenidad Editorial
        </p>
        <h1 className="font-serif text-3xl font-normal text-plum-ink md:text-4xl">
          Resumen del consultorio
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
          Administra el contenido de tu portafolio clínico, publica artículos
          psicoeducativos y da seguimiento a las solicitudes de contacto.
        </p>
      </header>

      <section
        aria-label="Métricas principales"
        className="grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        <EditorialCard
          eyebrow="Publicaciones activas"
          title={
            <span className="font-serif text-4xl text-plum-ink">
              {publishedCount}
            </span>
          }
          description="Artículos publicados y visibles en el blog."
          footer={
            <Link
              href="/posts"
              className="inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-primary hover:text-primary-accent"
            >
              Gestionar publicaciones
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <EditorialCard
          eyebrow="Borradores"
          title={
            <span className="font-serif text-4xl text-plum-ink">
              {draftCount}
            </span>
          }
          description="Artículos en preparación pendientes de publicación."
          footer={
            <Link
              href="/posts?nuevo=1"
              className="inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-primary hover:text-primary-accent"
            >
              Redactar nuevo artículo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <EditorialCard
          eyebrow="Solicitudes nuevas"
          title={
            <span className="font-serif text-4xl text-plum-ink">
              {newRequestsCount}
            </span>
          }
          description={`${requests.length} solicitudes registradas en total.`}
          footer={
            <Link
              href="/solicitudes"
              className="inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-primary hover:text-primary-accent"
            >
              Revisar solicitudes
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
      </section>

      <section aria-label="Accesos rápidos" className="space-y-4">
        <h2 className="font-serif text-2xl font-normal text-plum-ink">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/perfil"
            className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-5 shadow-calmed transition-colors hover:bg-surface-container-low"
          >
            <UserRound className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-plum-ink">
              Editar portafolio
            </span>
          </Link>

          <Link
            href="/posts?nuevo=1"
            className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-5 shadow-calmed transition-colors hover:bg-surface-container-low"
          >
            <FilePlus2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-plum-ink">
              Nueva publicación
            </span>
          </Link>

          <Link
            href="/posts"
            className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-5 shadow-calmed transition-colors hover:bg-surface-container-low"
          >
            <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-plum-ink">
              Ver publicaciones
            </span>
          </Link>

          <Link
            href="/solicitudes"
            className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-5 shadow-calmed transition-colors hover:bg-surface-container-low"
          >
            <Inbox className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-plum-ink">
              Bandeja de solicitudes
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
