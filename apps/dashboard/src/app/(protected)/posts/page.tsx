import Link from 'next/link';
import { FilePlus2 } from 'lucide-react';
import { getAllPostsForAdmin } from '@psicoiris/database';
import { PostsTable } from '@/components/PostsTable';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Blog Clínico
          </p>
          <h1 className="font-serif text-3xl font-normal text-plum-ink md:text-4xl">
            Publicaciones
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
            Crea, edita y organiza artículos psicoeducativos con referencias
            bibliográficas.
          </p>
        </div>

        <Link
          href="/posts/nuevo"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-on-primary shadow-calmed transition-colors hover:bg-primary-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          Nueva publicación
        </Link>
      </header>

      <PostsTable initialPosts={posts} />
    </div>
  );
}
