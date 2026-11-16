import {
  getPostBySlug,
  getPublishedPosts,
  getPublishedSiteProfile,
  type PostWithCategory,
  type SiteProfile,
} from '@psicoiris/database';
import { DEFAULT_SITE_PROFILE } from './default-profile';

export async function fetchSiteProfileSafe(): Promise<SiteProfile> {
  try {
    const profile = await getPublishedSiteProfile();
    return profile ?? DEFAULT_SITE_PROFILE;
  } catch {
    return DEFAULT_SITE_PROFILE;
  }
}

export async function fetchPublishedPostsSafe(
  limit?: number
): Promise<PostWithCategory[]> {
  try {
    return await getPublishedPosts(limit);
  } catch {
    return [];
  }
}

export async function fetchPostBySlugSafe(
  slug: string
): Promise<PostWithCategory | null> {
  try {
    return await getPostBySlug(slug);
  } catch {
    return null;
  }
}
