import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import {
  ContactRequestInputSchema,
  PostInputSchema,
  SiteProfileInputSchema,
  type ContactRequestInput,
  type PostInput,
  type PostReference,
  type SiteProfileInput,
} from './schemas';
import { createAdminSupabaseClient } from './server';

export interface ServiceItem {
  title: string;
  tag: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface SiteProfile {
  id: string;
  owner_id: string;
  tenant_slug: string;
  brand_name: string;
  clinician_name: string;
  clinician_title: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  modality_summary: string;
  about_title: string;
  about_paragraphs: string[];
  about_quote: string;
  about_image_url: string | null;
  services: ServiceItem[];
  process_steps: ProcessStep[];
  contact_email: string | null;
  contact_phone: string | null;
  contact_hours: string | null;
  professional_license: string | null;
  is_published: boolean;
  updated_at: string;
  created_at: string;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  reading_time_minutes: number;
  tags: string[];
  references_list: PostReference[];
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostWithCategory extends Post {
  post_categories: Pick<PostCategory, 'name' | 'slug'> | null;
}

export const ContactRequestStatusSchema = z.enum([
  'new',
  'reviewed',
  'scheduled',
  'archived',
]);

export type ContactRequestStatus = z.infer<typeof ContactRequestStatusSchema>;

export interface ContactRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  reason: string;
  message: string | null;
  consent_accepted: boolean;
  status: ContactRequestStatus;
  created_at: string;
}

function getPublicClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Faltan variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

function resolveAdminOrClient(client?: SupabaseClient): SupabaseClient {
  return client ?? createAdminSupabaseClient();
}

export async function getPublishedSiteProfile(
  client?: SupabaseClient
): Promise<SiteProfile | null> {
  const supabase = client ?? getPublicClient();
  const { data, error } = await supabase
    .from('site_profile')
    .select('*')
    .eq('tenant_slug', 'psicoiris')
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw error;
  return data as SiteProfile | null;
}

export async function updateSiteProfile(
  ownerId: string,
  data: SiteProfileInput,
  client?: SupabaseClient
): Promise<SiteProfile> {
  const parsed = SiteProfileInputSchema.parse(data);
  const supabase = resolveAdminOrClient(client);

  const { data: updated, error } = await supabase
    .from('site_profile')
    .upsert(
      {
        ...parsed,
        owner_id: ownerId,
        tenant_slug: 'psicoiris',
      },
      { onConflict: 'tenant_slug' }
    )
    .select('*')
    .single();

  if (error) throw error;
  return updated as SiteProfile;
}

export async function getPublishedPosts(
  limit?: number,
  client?: SupabaseClient
): Promise<PostWithCategory[]> {
  const supabase = client ?? getPublicClient();
  let query = supabase
    .from('posts')
    .select('*, post_categories(name, slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (typeof limit === 'number' && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as PostWithCategory[];
}

export async function getPostBySlug(
  slug: string,
  client?: SupabaseClient
): Promise<PostWithCategory | null> {
  const supabase = client ?? getPublicClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, post_categories(name, slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data as PostWithCategory | null;
}

export async function getAllPostsForAdmin(
  client?: SupabaseClient
): Promise<PostWithCategory[]> {
  const supabase = resolveAdminOrClient(client);
  const { data, error } = await supabase
    .from('posts')
    .select('*, post_categories(name, slug)')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as PostWithCategory[];
}

export async function upsertPost(
  authorId: string,
  data: PostInput & { id?: string },
  client?: SupabaseClient
): Promise<Post> {
  const { id, ...rest } = data;
  const parsed = PostInputSchema.parse(rest);
  const supabase = resolveAdminOrClient(client);

  const payload = {
    ...parsed,
    author_id: authorId,
    published_at:
      parsed.status === 'published' ? new Date().toISOString() : null,
  };

  const query = id
    ? supabase.from('posts').update(payload).eq('id', id)
    : supabase.from('posts').upsert(payload, { onConflict: 'slug' });

  const { data: saved, error } = await query.select('*').single();
  if (error) throw error;
  return saved as Post;
}

export async function deletePost(
  id: string,
  client?: SupabaseClient
): Promise<void> {
  const supabase = resolveAdminOrClient(client);
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

export async function getPostCategories(
  client?: SupabaseClient
): Promise<PostCategory[]> {
  const supabase = client ?? getPublicClient();
  const { data, error } = await supabase
    .from('post_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data ?? []) as PostCategory[];
}

export async function createContactRequest(
  data: ContactRequestInput,
  client?: SupabaseClient
): Promise<void> {
  const parsed = ContactRequestInputSchema.parse(data);
  const supabase = client ?? getPublicClient();

  const { error } = await supabase.from('contact_requests').insert({
    ...parsed,
    phone: parsed.phone || null,
    message: parsed.message || null,
  });

  if (error) throw error;
}

export async function getContactRequests(
  client?: SupabaseClient
): Promise<ContactRequest[]> {
  const supabase = resolveAdminOrClient(client);
  const { data, error } = await supabase
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ContactRequest[];
}

export async function updateContactRequestStatus(
  id: string,
  status: ContactRequestStatus,
  client?: SupabaseClient
): Promise<ContactRequest> {
  const validStatus = ContactRequestStatusSchema.parse(status);
  const supabase = resolveAdminOrClient(client);

  const { data, error } = await supabase
    .from('contact_requests')
    .update({ status: validStatus })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as ContactRequest;
}
