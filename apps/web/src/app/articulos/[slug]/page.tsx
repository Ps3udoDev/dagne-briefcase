import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookMarked, Clock, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@psicoiris/ui';
import { ResilientImage } from '@/components/atoms/ResilientImage';
import { Footer } from '@/components/organisms/Footer';
import { Navbar } from '@/components/organisms/Navbar';
import { fetchPostBySlugSafe, fetchSiteProfileSafe } from '@/lib/queries';

export const revalidate = 3600;

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlugSafe(slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado',
    };
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([
    fetchPostBySlugSafe(slug),
    fetchSiteProfileSafe(),
  ]);

  if (!post) {
    notFound();
  }

  const publishedDate = post.published_at
    ? new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(post.published_at))
    : null;

  return (
    <>
      <Navbar
        brandName={profile.brand_name}
        clinicianTitle={profile.clinician_title}
      />
      <main className="min-h-[calc(100dvh-5rem)] w-full bg-surface py-space-xl lg:py-space-2xl">
        <article className="mx-auto w-full max-w-[820px] px-margin md:px-gutter-desktop">
          <Link
            href="/articulos"
            className="mb-space-lg inline-flex min-h-[48px] items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-accent"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            <span>Volver a artículos</span>
          </Link>

          <header className="mb-space-lg">
            <div className="mb-space-sm flex flex-wrap items-center gap-3">
              <Badge variant="lavender">
                {post.post_categories?.name ?? 'Psicoeducación'}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                <span>{post.reading_time_minutes} min de lectura</span>
              </span>
              {publishedDate && (
                <time
                  dateTime={post.published_at ?? undefined}
                  className="text-xs font-medium text-on-surface-variant"
                >
                  · {publishedDate}
                </time>
              )}
            </div>

            <h1 className="mb-space-md font-serif text-[2.25rem] font-normal leading-[1.2] tracking-[-0.015em] text-plum-ink lg:text-[3rem]">
              {post.title}
            </h1>

            <p className="text-lg leading-relaxed text-on-surface-variant">
              {post.excerpt}
            </p>
          </header>

          {post.cover_image_url && (
            <figure className="mb-space-xl overflow-hidden rounded-3xl shadow-calmed">
              <ResilientImage
                src={post.cover_image_url}
                alt={post.cover_image_alt || post.title}
                width={1200}
                height={675}
                priority
                className="h-auto max-h-[440px] w-full object-cover"
              />
            </figure>
          )}

          <div className="editorial-prose max-w-prose">
            <ReactMarkdown>{post.content_md}</ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <section
              aria-label="Etiquetas del artículo"
              className="mt-space-xl border-t border-mauve-border/50 pt-space-md"
            >
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {post.references_list && post.references_list.length > 0 && (
            <section
              aria-labelledby="references-heading"
              className="mt-space-xl rounded-2xl bg-surface-container-low p-space-lg"
            >
              <div className="mb-space-sm flex items-center gap-2 text-plum-ink">
                <BookMarked aria-hidden="true" className="h-5 w-5 text-primary" />
                <h2
                  id="references-heading"
                  className="font-serif text-xl font-medium md:text-2xl"
                >
                  Referencias académicas
                </h2>
              </div>
              <ol className="list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-on-surface-variant">
                {post.references_list.map((ref, idx) => (
                  <li key={idx}>
                    <span>{ref.citation}</span>
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-1 font-medium text-primary underline decoration-mauve-border underline-offset-4 hover:text-primary-accent"
                      >
                        <span>Consultar fuente</span>
                        <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </article>
      </main>
      <Footer profile={profile} />
    </>
  );
}
