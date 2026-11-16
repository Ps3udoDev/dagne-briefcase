'use server';

import { revalidatePath } from 'next/cache';
import {
  deletePost,
  PostInputSchema,
  upsertPost,
  type PostInput,
} from '@psicoiris/database';
import { requireAdminUser } from '@/lib/auth';
import { revalidateWeb } from '@/lib/revalidate';

export interface PostActionResult {
  ok: boolean;
  message: string;
  id?: string;
}

export async function savePostAction(
  input: PostInput & { id?: string }
): Promise<PostActionResult> {
  const user = await requireAdminUser();
  const { id, ...rest } = input;

  const parsed = PostInputSchema.safeParse({
    ...rest,
    category_id: rest.category_id || null,
    cover_image_url: rest.cover_image_url || '',
    cover_image_alt: rest.cover_image_alt || null,
    seo_title: rest.seo_title || null,
    seo_description: rest.seo_description || null,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      message: firstIssue
        ? `${firstIssue.path.join('.')}: ${firstIssue.message}`
        : 'Revisa los campos de la publicación.',
    };
  }

  try {
    const saved = await upsertPost(user.id, { id, ...parsed.data });
    await revalidateWeb();
    revalidatePath('/posts');
    revalidatePath(`/posts/${saved.id}`);
    revalidatePath('/');

    return {
      ok: true,
      id: saved.id,
      message: 'Publicación guardada correctamente.',
    };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? err.message
          : 'No se pudo guardar la publicación.',
    };
  }
}

export async function deletePostAction(id: string): Promise<PostActionResult> {
  await requireAdminUser();

  try {
    await deletePost(id);
    await revalidateWeb();
    revalidatePath('/posts');
    revalidatePath('/');
    return { ok: true, message: 'Publicación eliminada.' };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar la publicación.',
    };
  }
}
