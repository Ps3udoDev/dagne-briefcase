-- ==============================================================================
-- Psicoiris — Migración Inicial (Fase 1: Portafolio Dinámico + Publicaciones)
-- ==============================================================================
-- Diseñada con RLS estricto desde el día 1 y preparada para escalar a multitenant.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Perfil Dinámico del Portafolio (site_profile)
-- ------------------------------------------------------------------------------
-- Permite que el psicólogo autenticado edite textos, enfoque, servicios y contacto
-- desde el Dashboard y se reflejen automáticamente en la Landing.
create table if not exists public.site_profile (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  tenant_slug text not null unique default 'psicoiris',
  brand_name text not null default 'Psicoiris',
  clinician_name text not null default 'Dra. Sofía Mendoza',
  clinician_title text not null default 'Psicología Clínica',
  hero_badge text not null default 'Psicología Clínica Independiente',
  hero_title text not null default 'Un espacio para comprenderte y volver a ti.',
  hero_subtitle text not null default 'Acompañamiento psicológico individual para transitar momentos de cambio, gestionar el malestar emocional y construir una relación más amable y compasiva contigo mismo, en un entorno seguro y confidencial.',
  hero_image_url text,
  modality_summary text not null default 'Atención individual para personas adultas · Modalidad online y presencial',
  about_title text not null default 'La terapia no es dar consejos, es acompañarte a clarificar tus propias respuestas.',
  about_paragraphs jsonb not null default '[]'::jsonb,
  about_quote text not null default 'Cada proceso terapéutico es único; no hay fórmulas predeterminadas, sino un encuentro humano con rigor científico.',
  about_image_url text,
  services jsonb not null default '[]'::jsonb,       -- [{ title, tag, description }]
  process_steps jsonb not null default '[]'::jsonb,  -- [{ step, title, description }]
  contact_email text,
  contact_phone text,
  contact_hours text default 'Lunes a Viernes con cita previa concertada',
  professional_license text,
  is_published boolean not null default true,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 2. Categorías Editoriales (post_categories)
-- ------------------------------------------------------------------------------
create table if not exists public.post_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 3. Publicaciones / Artículos Clínicos (posts)
-- ------------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete restrict,
  category_id uuid references public.post_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content_md text not null,
  cover_image_url text,
  cover_image_alt text,
  reading_time_minutes integer not null default 4,
  tags text[] not null default '{}',
  -- Referencias bibliográficas: [{ "citation": "APA...", "url": "https://doi.org/..." }]
  references_list jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_status_published_at
  on public.posts (status, published_at desc);

create index if not exists idx_posts_category
  on public.posts (category_id);

-- ------------------------------------------------------------------------------
-- 4. Imágenes Adicionales por Post (post_images)
-- ------------------------------------------------------------------------------
create table if not exists public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  alt_text text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 5. Solicitudes de Primera Consulta / Contacto (contact_requests)
-- ------------------------------------------------------------------------------
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  reason text not null,
  message text,
  consent_accepted boolean not null default false,
  status text not null default 'new' check (status in ('new', 'reviewed', 'scheduled', 'archived')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 6. Trigger automático para updated_at
-- ------------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_site_profile_updated_at on public.site_profile;
create trigger trg_site_profile_updated_at
  before update on public.site_profile
  for each row execute function public.handle_updated_at();

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 7. Row Level Security (RLS)
-- ------------------------------------------------------------------------------
alter table public.site_profile enable row level security;
alter table public.post_categories enable row level security;
alter table public.posts enable row level security;
alter table public.post_images enable row level security;
alter table public.contact_requests enable row level security;

-- site_profile: lectura pública si está publicado; gestión completa solo para el propietario
create policy "Public can read published site_profile"
  on public.site_profile for select
  to anon, authenticated
  using (is_published = true);

create policy "Owner can manage own site_profile"
  on public.site_profile for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- post_categories: lectura pública; escritura autenticada
create policy "Public can read post_categories"
  on public.post_categories for select
  to anon, authenticated
  using (true);

create policy "Authenticated can manage post_categories"
  on public.post_categories for all
  to authenticated
  using (true)
  with check (true);

-- posts: lectura pública solo si status = 'published'; autor gestiona sus posts
create policy "Public can read published posts"
  on public.posts for select
  to anon, authenticated
  using (status = 'published');

create policy "Author can manage own posts"
  on public.posts for all
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- post_images: lectura pública si el post está publicado; autor gestiona
create policy "Public can read images of published posts"
  on public.post_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_images.post_id and p.status = 'published'
    )
  );

create policy "Author can manage images of own posts"
  on public.post_images for all
  to authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_images.post_id and p.author_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.posts p
      where p.id = post_images.post_id and p.author_id = auth.uid()
    )
  );

-- contact_requests: cualquiera puede enviar formulario; solo autenticados leen/actualizan
create policy "Public can insert contact_requests"
  on public.contact_requests for insert
  to anon, authenticated
  with check (consent_accepted = true);

create policy "Authenticated can read and update contact_requests"
  on public.contact_requests for select
  to authenticated
  using (true);

create policy "Authenticated can update contact_requests"
  on public.contact_requests for update
  to authenticated
  using (true)
  with check (true);

-- ------------------------------------------------------------------------------
-- 8. Storage Bucket para Imágenes de Portafolio y Posts (psicoiris-media)
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('psicoiris-media', 'psicoiris-media', true)
on conflict (id) do nothing;

create policy "Public read access for psicoiris-media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'psicoiris-media');

create policy "Authenticated upload to psicoiris-media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'psicoiris-media');

create policy "Authenticated update/delete own files in psicoiris-media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'psicoiris-media' and auth.uid() = owner);
