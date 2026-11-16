import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import type { PostWithCategory } from '@psicoiris/database';
import { Reveal, StaggerGroup } from '@psicoiris/motion';
import { Badge } from '@psicoiris/ui';

export interface ArticlesPreviewProps {
  posts: PostWithCategory[];
}

export function ArticlesPreview({ posts }: ArticlesPreviewProps) {
  return (
    <section className="w-full bg-surface py-space-xl lg:py-space-2xl">
      <div className="mx-auto w-full max-w-[1200px] px-margin md:px-gutter-desktop lg:px-margin-desktop">
        <Reveal className="mb-space-xl flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              Reflexiones y Recursos
            </span>
            <h2 className="font-serif text-[2rem] font-normal leading-[1.25] tracking-[-0.01em] text-plum-ink lg:text-[2.5rem]">
              Lecturas para cultivar calma y perspectiva
            </h2>
          </div>
          <p className="max-w-md text-base leading-[1.65] text-on-surface-variant">
            Ensayos breves y herramientas de divulgación psicológica responsable escritas
            con sensibilidad y rigor.
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-mauve-border/60 bg-surface-container-low p-space-lg text-center">
            <p className="font-serif text-xl text-plum-ink">
              Próximamente nuevas lecturas y ensayos clínicos.
            </p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Estamos preparando artículos de divulgación psicológica para acompañarte.
            </p>
          </div>
        ) : (
          <StaggerGroup className="grid grid-cols-1 gap-gutter md:grid-cols-3 lg:gap-gutter-desktop">
            {posts.map((post) => (
              <article
                key={post.id}
                data-stagger
                className="flex h-full flex-col justify-between rounded-2xl bg-surface-container-low p-space-md transition-shadow duration-300 hover:shadow-calmed"
              >
                <div>
                  <div className="mb-space-sm flex items-center justify-between gap-2">
                    <Badge variant="lavender">
                      {post.post_categories?.name ?? 'Psicoeducación'}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-on-surface-variant">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                      <span>{post.reading_time_minutes} min</span>
                    </span>
                  </div>

                  <h3 className="mb-space-xs font-serif text-xl font-normal leading-snug text-plum-ink md:text-2xl">
                    <Link
                      href={`/articulos/${post.slug}`}
                      className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="mb-space-md text-sm leading-relaxed text-on-surface-variant">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  href={`/articulos/${post.slug}`}
                  className="inline-flex min-h-[48px] items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-accent"
                >
                  <span>Leer artículo</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </StaggerGroup>
        )}

        <div className="mt-space-lg text-center">
          <Link
            href="/articulos"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-mauve-border bg-lavender-soft/50 px-6 py-3 text-sm font-medium text-plum-ink transition-colors hover:bg-lavender-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>Ver todos los artículos</span>
            <BookOpen aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
