import { getAllPostsForAdmin, getPostCategories } from '@psicoiris/database';
import { PostsTable } from '@/components/PostsTable';

export const dynamic = 'force-dynamic';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ nuevo?: string }>;
}) {
  const [posts, categories, params] = await Promise.all([
    getAllPostsForAdmin(),
    getPostCategories(),
    searchParams,
  ]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
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
      </header>

      <PostsTable
        initialPosts={posts}
        categories={categories}
        initialOpenCreate={params.nuevo === '1'}
      />
    </div>
  );
}
