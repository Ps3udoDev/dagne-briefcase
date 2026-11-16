# Arquitectura y Propuesta Técnica — Portafolio de Psicología Clínica & CRM

> **Estado:** Propuesta inicial (Fase 0 — Diagnóstico y Arquitectura)  
> **Diseño base:** [DESIGN.md](../propuesta/DESIGN.md) · [code.html](../propuesta/code.html) · [screen.png](../propuesta/screen.png)  
> **Identidad visual:** *Serenidad Editorial* (Mobile-First, tipografía *Newsreader* + *Plus Jakarta Sans*, paleta lavanda/rosa empolvado/berenjena).

---

## 1. Resumen Ejecutivo y Objetivos

El proyecto nace como un **portafolio web y blog editorial para psicología clínica** (Fase 1), diseñado con una estética cálida, serena y libre de frialdad hospitalaria, pero concebido desde el día uno para **escalar hacia un sistema CRM clínico y portal de gestión de pacientes** (Fase 2) sin reescribir la base de código.

### Capacidades por Fase
1. **Fase 1 — Landing & Publicaciones (MVP):**
   - Landing page *Mobile-First* fiel a la propuesta *Serenidad Editorial* (Hero, Pilares de confianza, Áreas de acompañamiento, Enfoque clínico, Proceso paso a paso, CTA, Artículos/Reflexiones, Formulario de contacto).
   - Animaciones sutiles, orgánicas y de alto rendimiento con **Three.js** (luz ambiental / partículas o shader orgánico sutil en el fondo) y **Anime.js** (transiciones editoriales y micro-interacciones), respetando `prefers-reduced-motion`.
   - Sección de Artículos conectada a **Supabase** (lectura pública de posts con imágenes, etiquetas, tiempo de lectura y referencias bibliográficas).
2. **Fase 2 — Dashboard Administrativo & CRM Clínico:**
   - **Gestor de Publicaciones (CMS):** Crear, editar, previsualizar y publicar posts con editor enriquecido, carga de imágenes a Supabase Storage y gestión de referencias/citas académicas.
   - **Agenda y Citas Disponibles:** Configuración de disponibilidad horaria y vista pública/privada para que pacientes consulten horarios y soliciten citas.
   - **Gestión de Pacientes e Historial:** Ficha de paciente, historial de sesiones, notas clínicas privadas (con RLS estricto) y seguimiento evolutivo.
   - **Tareas por Paciente:** Asignación y seguimiento de ejercicios terapéuticos o tareas entre sesiones.

---

## 2. Evaluación y Decisión del Stack Tecnológico

### 2.1 Comparativa de Frameworks Frontend

| Criterio | **Next.js (App Router) + TypeScript** (Recomendado) | Astro + React Islands | React SPA (Vite) |
| :--- | :--- | :--- | :--- |
| **SEO & Rendering (Blog/Landing)** | SSR, SSG e ISR nativos (`revalidatePath` / tags al publicar desde el dashboard). | Excelente SSG para landing/blog estático. | Pobre SEO sin SSR; requiere configuración adicional. |
| **Escalabilidad a CRM / Dashboard** | Nativo: Server Components, Server Actions, Middleware de Auth, rutas protegidas. | Limitado para apps altamente interactivas tipo CRM; termina delegando todo a islands React. | Bueno para SPA privada, pero malo para la landing pública. |
| **Reutilización en Monorepo** | 100% React + TypeScript compartido entre Landing y Dashboard. | Mezcla `.astro` y `.tsx`, menor cohesión con el CRM. | Mismo lenguaje, pero sin capa servidor integrada. |
| **Deploy en Vercel** | Soporte de primer nivel (Edge, ISR, Image Optimization, Preview Deploys por app). | Soportado, pero menos integrado con mutaciones dinámicas. | Soportado como estático. |

**Decisión:** **Next.js (App Router) + TypeScript** en modo estricto (`strict: true`). Permite unir lo mejor del renderizado estático/ISR para el SEO del portafolio y artículos con la potencia de React Server Components y Server Actions para el Dashboard/CRM.

### 2.2 Stack Completo Recomendado

- **Lenguaje:** TypeScript (strict mode) + Zod para validación de esquemas y formularios.
- **Monorepo:** **Turborepo** + **pnpm** workspaces (despliegue independiente en Vercel para cada app).
- **Estilos:** **Tailwind CSS** configurado con los tokens exactos de *Serenidad Editorial* (`surface`, `primary`, `secondary-container`, `Newsreader`, `Plus Jakarta Sans`).
- **Componentes Headless & Accesibles:** **Radix UI** (`@radix-ui/react-dialog`, `accordion`, `select`, `tabs`, `popover`, `toast`, `dropdown-menu`, etc.) — máxima accesibilidad (WAI-ARIA) sin imponer estilos ajenos al diseño editorial.
- **Tablas del Dashboard/CRM:** **TanStack Table (`@tanstack/react-table`)** — ordenamiento, filtrado, paginación y selección de filas headless para listados de posts, pacientes, citas y tareas.
- **Motion & Gráficos 3D:**
  - **Anime.js (`animejs`):** Coreografías de entrada, revelados tipográficos suaves, transiciones de tarjetas y micro-interacciones fluidas.
  - **Three.js (`three` / `@react-three/fiber`):** Fondo ambiental orgánico sutil (ondas/partículas difusas en tonos `#F4E6E5` / `#E8D3EC` / `#9F73AB` con baja opacidad) cargado de forma diferida (`dynamic import`, `ssr: false`) para no penalizar el LCP móvil.
- **Backend / BaaS:** **Supabase** (PostgreSQL, Auth, Storage, Row Level Security y Edge Functions).

---

## 3. Arquitectura del Monorepo (Turborepo + Vercel)

Separar la **Landing pública** del **Dashboard/CRM** en aplicaciones independientes dentro de un mismo monorepo evita que el bundle del panel administrativo (TanStack Table, editor de texto rico, lógica de pacientes) afecte el rendimiento de la web pública, y permite desplegar y proteger cada app por separado (ej. `tudominio.com` y `admin.tudominio.com`).

```text
briefcase/
├── apps/
│   ├── web/                      # App pública: Landing + Blog + Vista de Citas Disponibles (Next.js)
│   └── dashboard/                # App privada: CMS de Posts + CRM de Pacientes + Agenda + Tareas (Next.js)
├── packages/
│   ├── ui/                       # Design System "Serenidad Editorial" (Tailwind preset, Radix primitives, botones, cards)
│   ├── database/                 # Cliente Supabase tipado, tipos generados, queries/repositorios y esquemas Zod
│   ├── motion/                   # Wrappers reutilizables de Anime.js y escena ambiental Three.js (Mobile-First & reduced-motion)
│   └── config/                   # Configs compartidas de ESLint, TypeScript y Tailwind
├── supabase/
│   ├── migrations/               # Migraciones SQL versionadas (posts, pacientes, citas, RLS)
│   └── seed.sql                  # Datos iniciales de prueba
├── docs/
│   ├── propuesta/                # Diseño original (code.html, DESIGN.md, screen.png)
│   └── arquitercture/            # Documentación técnica y arquitectura
├── AGENTS.md                     # Instrucciones y convenciones universales para agentes IA
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### 3.1 Estrategia de Backend: ¿Supabase directo o Backend dedicado?

1. **Fase 1 y arranque de Fase 2 (Recomendado): Supabase + Next.js Server Actions / Route Handlers.**
   - Supabase provee PostgreSQL, Auth (JWT), Storage (imágenes de posts y avatares) y **Row Level Security (RLS)** a nivel de fila.
   - Todas las consultas y mutaciones se encapsulan en `packages/database` bajo un patrón **Repository / Service**, nunca dispersas en componentes UI.
2. **Escalado futuro (Si se requiere backend dedicado):**
   - Si más adelante necesitas integraciones complejas (facturación electrónica, recordatorios por WhatsApp/Twilio, webhooks pesados o cumplimiento HIPAA/GDPR estricto con cifrado de capa de aplicación), se puede añadir `apps/api/` (ej. **Hono** o **NestJS**) manteniendo intactos los contratos de `packages/database` y sin reescribir `apps/web` ni `apps/dashboard`.

---

## 4. Diseño Mobile-First, Motion y Accesibilidad

De acuerdo con `docs/propuesta/DESIGN.md`:
- **Enfoque Mobile-First obligatorio:** Todos los estilos base en Tailwind apuntan a móvil (`< 768px`, 1 columna, márgenes `1.25rem`), escalando progresivamente con `md:` (`768px–1024px`) y `lg:` (`>= 1024px`, grilla de 12 columnas, contenedor `max-w-[1200px]`).
- **Rendimiento en Móvil (Core Web Vitals):**
  - El canvas de **Three.js** en el Hero debe ser ligero (baja densidad de partículas/geometría, `dpr` limitado a `[1, 1.5]`), pausado cuando sale del viewport (`IntersectionObserver`) y omitido si el usuario tiene `prefers-reduced-motion: reduce` o conexión lenta.
  - Las animaciones con **Anime.js** deben animar únicamente propiedades compositoras (`transform`, `opacity`) para mantener 60fps sin *layout shifts* (CLS = 0).
  - Las imágenes usarán `next/image` con formatos WebP/AVIF y `priority` solo en el retrato principal del Hero.

---

## 5. Modelo de Datos Inicial en Supabase (PostgreSQL)

### 5.1 Fase 1: Módulo de Publicaciones (Posts)

Un post de psicología clínica requiere soporte para contenido editorial largo, imágenes (portada y galería/figuras), categorías terapéuticas y **referencias bibliográficas académicas** (autor, año, título, revista/DOI o enlace).

```sql
-- Categorías editoriales (ej. Psicoeducación, Primeros Pasos, Autocuidado, Vínculos)
create table public.post_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- Publicaciones del blog
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete restrict,
  category_id uuid references public.post_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text not null,                     -- Resumen corto para las tarjetas de la landing
  content_md text not null,                  -- Cuerpo en Markdown / MDX o JSON estructurado
  cover_image_url text,                      -- URL pública en Supabase Storage (bucket: post-media)
  cover_image_alt text,                      -- Texto alternativo accesible obligatorio si hay portada
  reading_time_minutes integer not null default 4,
  tags text[] not null default '{}',
  -- Referencias bibliográficas: [{ "citation": "APA...", "url": "https://doi.org/..." }]
  references jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Galería / imágenes adicionales asociadas a un post
create table public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  alt_text text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Índices recomendados
create index idx_posts_status_published_at on public.posts (status, published_at desc);
create index idx_posts_category on public.posts (category_id);
```

#### Seguridad (Row Level Security — RLS) para Posts
- **Lectura pública (`apps/web`):** `SELECT` permitido para `anon` y `authenticated` **únicamente** cuando `status = 'published'`.
- **Escritura / Gestión (`apps/dashboard`):** `INSERT`, `UPDATE`, `DELETE` y lectura de borradores permitidos solo al usuario autenticado con rol `clinician` / `admin` (`auth.uid() = author_id`).
- **Storage (`post-media` bucket):** Lectura pública de imágenes de posts publicados; subida/borrado restringido a usuarios autenticados con rol clínico.

### 5.2 Fase 2: Hoja de Ruta de Datos para CRM, Citas y Pacientes

Cuando se implemente el dashboard clínico, se añadirán las siguientes tablas bajo RLS estricto (solo el profesional autenticado accede a datos clínicos):

| Tabla | Propósito | Campos Clave |
| :--- | :--- | :--- |
| `patients` | Ficha del paciente | `id`, `full_name`, `email`, `phone`, `birth_date`, `modality` (`online`/`in_person`), `status` (`active`/`paused`/`discharged`), `emergency_contact`, `created_at` |
| `availability_slots` | Horarios disponibles publicados | `id`, `day_of_week` / `specific_date`, `start_time`, `end_time`, `modality`, `is_active` |
| `appointments` | Citas solicitadas y confirmadas | `id`, `patient_id` (nullable si es primera consulta), `prospect_name`, `prospect_email`, `starts_at`, `ends_at`, `modality`, `status` (`pending`/`confirmed`/`cancelled`/`completed`), `notes` |
| `clinical_sessions` | Historial clínico por sesión | `id`, `patient_id`, `appointment_id`, `session_date`, `summary_encrypted`, `observations`, `created_at` |
| `patient_tasks` | Tareas terapéuticas por paciente | `id`, `patient_id`, `title`, `description`, `due_date`, `status` (`pending`/`in_progress`/`completed`), `patient_feedback` |

> **Nota de Privacidad Clínica:** Los datos de `clinical_sessions` y `patients` son datos sensibles de salud. En Fase 2 se debe habilitar 2FA en Supabase Auth para el profesional, políticas RLS estrictas sin acceso anónimo y, de ser necesario por regulación local (LOPDP/GDPR/HIPAA), cifrado adicional de notas clínicas antes de persistir.

---

## 6. Plan de Implementación Sugerido (Roadmap)

1. **Paso 0 (Actual):** Validación de entorno, skills cross-agent (`AGENTS.md`) y aprobación de esta arquitectura.
2. **Paso 1 — Scaffold del Monorepo:** Inicializar Turborepo + `pnpm`, `packages/ui` con los tokens de *Serenidad Editorial* (`DESIGN.md`) y `apps/web` (Next.js App Router, Tailwind, Radix UI).
3. **Paso 2 — Landing Page Mobile-First:** Migrar e implementar las secciones de `docs/propuesta/code.html` en componentes React modulares y responsivos, integrando Anime.js y el fondo ambiental Three.js.
4. **Paso 3 — Conexión Supabase (Posts):** Configurar proyecto Supabase, ejecutar migración inicial de `posts`, conectar la sección de Artículos y la página `/articulos/[slug]` en `apps/web`.
5. **Paso 4 — Dashboard CMS (`apps/dashboard`):** Auth con Supabase, listado de posts con TanStack Table, editor con subida de imágenes y gestor de referencias bibliográficas.
6. **Paso 5 — CRM Clínico y Citas:** Módulos de disponibilidad, agenda de citas, ficha/historial de pacientes y gestión de tareas terapéuticas.
