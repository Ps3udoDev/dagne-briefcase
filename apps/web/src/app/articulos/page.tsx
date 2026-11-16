import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@psicoiris/ui';
import { Footer } from '@/components/organisms/Footer';
import { Navbar } from '@/components/organisms/Navbar';
import { fetchPublishedPostsSafe, fetchSiteProfileSafe } from '@/lib/queries';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Artículos y Ensayos',
  description:
    'Lecturas y herramientas de divulgación psicológica responsable escritas con sensibilidad y rigor clínico.',
};

export default async function ArticlesPage() {
  const [profile, posts] = await Promise.all([
    fetchSiteProfileSafe(),
    fetchPublishedPostsSafe(),
  ]);

  return (
    <>
      <Navbar
        brandName={profile.brand_name}
        clinicianTitle={profile.clinician_title}
      />
      <main className="min-h-[calc(100dvh-5rem)] w-full bg-surface py-space-xl lg:py-space-2xl">
        <div className="mx-auto w-full max-w-[1200px] px-margin md:px-gutter-desktop lg:px-margin-desktop">
          <header className="mb-space-xl max-w-2xl">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              Reflexiones y Recursos
            </span>
            <h1 className="mb-space-sm font-serif text-[2.25rem] font-normal leading-[1.2] tracking-[-0.015em] text-plum-ink lg:text-[3rem]">
              Artículos para cultivar calma y perspectiva
            </h1>
            <p className="text-base leading-[1.7] text-on-surface-variant md:text-lg">
              Ensayos breves y guías de psicoeducación basadas en la evidencia clínica
              para acompañarte en tu bienestar cotidiano.
            </p>
          </header>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-mauve-border/60 bg-surface-container-low p-space-xl text-center">
              <p className="font-serif text-2xl text-plum-ink">
                Aún no hay artículos publicados.
              </p>
              <p className="mt-2 text-base text-on-surface-variant">
                Pronto compartiremos nuevas lecturas sobre salud emocional y
                psicoterapia.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 lg:gap-gutter-desktop">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-mauve-border/60 bg-surface-container-lowest shadow-calmed transition-colors duration-200 hover:border-primary/50"
                >
                  <div>
                    {post.cover_image_url && (
                      <Link
                        href={`/articulos/${post.slug}`}
                        className="block overflow-hidden"
                      >
                        <Image
                          src={post.cover_image_url}
                          alt={post.cover_image_alt || post.title}
                          width={640}
                          height={360}
                          className="h-48 w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                        />
                      </Link>
                    )}

                    <div className="p-space-md">
                      <div className="mb-space-sm flex items-center justify-between gap-2">
                        <Badge variant="lavender">
                          {post.post_categories?.name ?? 'Psicoeducación'}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-on-surface-variant">
                          <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                          <span>{post.reading_time_minutes} min</span>
                        </span>
                      </div>

                      <h2 className="mb-space-xs font-serif text-xl font-normal leading-snug text-plum-ink md:text-2xl">
                        <Link
                          href={`/articulos/${post.slug}`}
                          className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
                        >
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-sm leading-relaxed text-on-surface-variant">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-mauve-border/40 px-space-md py-3">
                    <Link
                      href={`/articulos/${post.slug}`}
                      className="inline-flex min-h-[48px] items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-accent"
                    >
                      <span>Leer artículo</span>
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
