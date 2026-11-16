import { getPostCategories, type PostInput } from '@psicoiris/database';
import { PostEditorForm } from '@/components/PostEditorForm';

export const dynamic = 'force-dynamic';

const EMPTY_POST: PostInput = {
  title: '',
  slug: '',
  excerpt: '',
  content_md: '',
  category_id: null,
  cover_image_url: '',
  cover_image_alt: '',
  reading_time_minutes: 4,
  tags: [],
  references_list: [],
  status: 'draft',
  seo_title: '',
  seo_description: '',
};

export default async function NewPostPage() {
  const categories = await getPostCategories();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Blog Clínico
        </p>
        <h1 className="font-serif text-3xl font-normal text-plum-ink md:text-4xl">
          Nueva publicación
        </h1>
      </header>

      <PostEditorForm initialData={EMPTY_POST} categories={categories} />
    </div>
  );
}
