import { notFound } from 'next/navigation';
import {
  createAdminSupabaseClient,
  getPostCategories,
  type Post,
  type PostInput,
} from '@psicoiris/database';
import { PostEditorForm } from '@/components/PostEditorForm';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();

  const [{ data }, categories] = await Promise.all([
    supabase.from('posts').select('*').eq('id', id).maybeSingle(),
    getPostCategories(),
  ]);

  if (!data) {
    notFound();
  }

  const post = data as Post;
  const initialData: PostInput = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content_md: post.content_md,
    category_id: post.category_id,
    cover_image_url: post.cover_image_url ?? '',
    cover_image_alt: post.cover_image_alt ?? '',
    reading_time_minutes: post.reading_time_minutes,
    tags: post.tags ?? [],
    references_list: post.references_list ?? [],
    status: post.status,
    seo_title: post.seo_title ?? '',
    seo_description: post.seo_description ?? '',
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Editar publicación
        </p>
        <h1 className="font-serif text-3xl font-normal text-plum-ink md:text-4xl">
          {post.title}
        </h1>
      </header>

      <PostEditorForm
        postId={post.id}
        initialData={initialData}
        categories={categories}
      />
    </div>
  );
}
