# Plan de Tareas y Continuación — Psicoiris

> Usa este archivo si reinicias la sesión (por ejemplo, para precargar las nuevas skills globales) o para retomar el desarrollo paso a paso.
> Bóveda Obsidian asociada: `C:\Users\DELL\Documents\Obsidian\dagne-psicoiris`

---

## Estado Actual (Completado en Fase 0)

- [x] Skills instaladas a nivel universal (`~/.agents/skills/` y `~/.gemini/config/skills/`): `superpowers`, `ponytail`, `modern-web-guidance`, `elephant-goldfish-model`, `mobile-first-design`, `responsive-design`, `find-skills`.
- [x] Reglas multi-agente creadas en [`AGENTS.md`](../AGENTS.md).
- [x] Arquitectura documentada en [`docs/arquitercture/ARCHITECTURE.md`](./arquitercture/ARCHITECTURE.md).
- [x] Branding inicial **Psicoiris** creado en [`docs/brand/`](./brand/) (`BRAND.md`, `psicoiris-icon.svg`, `psicoiris-logo.svg`, `favicon.ico`, `psicoiris-icon-192.png`).
- [x] Plantilla de variables de entorno creada en [`.env.example`](../.env.example).
- [x] Migración SQL inicial lista en [`supabase/migrations/20261116000001_initial_schema.sql`](../supabase/migrations/20261116000001_initial_schema.sql) (`site_profile`, `post_categories`, `posts`, `post_images`, `contact_requests` + RLS + Storage `psicoiris-media`).
- [x] Análisis del proyecto previo `book-now-hub` completado y registrado en la bóveda Obsidian (`ADR-003`).
- [x] Scaffolding base del monorepo (`package.json`, `pnpm-workspace.yaml`, `turbo.json`, `packages/config`, `packages/ui`, `packages/database`).

---

## Próximas Tareas (Siguiente Sesión / Continuación)

### 1. Conexión a Supabase y Migración Inicial
- [ ] Recibir del usuario: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_PROJECT_REF`.
- [ ] Crear `.env.local` (no versionado) y vincular con `npx supabase link --project-ref <ref>`.
- [ ] Ejecutar migración `20261116000001_initial_schema.sql` y crear el registro inicial de `site_profile` vinculado al usuario `dagneraza123@gmail.com`.

### 2. Scaffolding de Aplicaciones (`apps/web` y `apps/dashboard`)
- [ ] Crear `apps/web` (Next.js App Router + Tailwind con `serenidadEditorialPreset` + Radix UI + `favicon.ico`).
- [ ] Crear `apps/dashboard` (Next.js App Router + Middleware de Auth Supabase + Login animado *Serenidad Editorial* + layout protegido).
- [ ] Crear `packages/motion` (wrappers Anime.js + escena ambiental Three.js con `prefers-reduced-motion`).
- [ ] Ejecutar `pnpm install` y verificar `pnpm typecheck` / `pnpm build`.

### 3. Implementación de la Landing (`apps/web`)
- [ ] Migrar las secciones de `docs/propuesta/code.html` a componentes React Mobile-First (`Hero`, `TrustPillars`, `Services`, `About`, `Process`, `CtaBanner`, `ArticlesPreview`, `ContactForm`, `Footer`).
- [ ] Conectar `apps/web` a `site_profile` y `posts` publicados (ISR + revalidación on-demand).
- [ ] Crear página de detalle de artículo `/articulos/[slug]` con renderizado de imágenes y referencias bibliográficas.

### 4. Dashboard Inicial (`apps/dashboard`)
- [ ] Implementar Login animado exclusivo para `dagneraza123@gmail.com` y middleware de protección.
- [ ] Editor de Portafolio (`site_profile`): editar textos, enfoque, servicios y contacto con revalidación automática en `apps/web`.
- [ ] Gestor de Publicaciones (`posts`): tabla con `@tanstack/react-table`, formulario con subida de portada/imágenes a `psicoiris-media` y lista dinámica de referencias bibliográficas.
