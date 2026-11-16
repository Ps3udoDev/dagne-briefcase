# AGENTS.md — Portafolio de Psicología Clínica & CRM (*Serenidad Editorial*)

Este archivo define las reglas, convenciones y flujo de trabajo compartidos para cualquier agente de IA (**Claude Code, OpenAI Codex, Gemini CLI, Antigravity, Cursor**) que trabaje en este repositorio.

---

## 1. Contexto y Documentos de Referencia

- **Diseño Visual y Tokens:** [`docs/propuesta/DESIGN.md`](./docs/propuesta/DESIGN.md)
- **Maqueta HTML Base:** [`docs/propuesta/code.html`](./docs/propuesta/code.html)
- **Captura de Referencia:** [`docs/propuesta/screen.png`](./docs/propuesta/screen.png)
- **Arquitectura Técnica:** [`docs/arquitercture/ARCHITECTURE.md`](./docs/arquitercture/ARCHITECTURE.md)

---

## 2. Reglas de Ingeniería y Diseño

1. **Mobile-First Estricto:**
   - Todo layout y componente se diseña primero para móvil (`< 768px`, 1 columna, margen `1.25rem`) y escala progresivamente a `md:` y `lg:`.
   - Prohibido romper el layout horizontal (`overflow-x-hidden` no debe ocultar errores de maquetación).
2. **Identidad *Serenidad Editorial*:**
   - Respetar la paleta (`#fff7fc` / `#FFFFFF`, `#F4E6E5`, `#E8D3EC`, `#D4B2D8`, `#754d82` / `#9F73AB`, `#201924` / `#2D2531`) y la tipografía (*Newsreader* para títulos/citas, *Plus Jakarta Sans* para cuerpo/UI).
   - Evitar estética hospitalaria fría o lugares comunes visuales.
3. **Stack Tecnológico:**
   - Monorepo **Turborepo + pnpm** con **Next.js (App Router) + TypeScript (`strict: true`)**.
   - **Tailwind CSS** + **Radix UI** (primitivas accesibles headless) + **TanStack Table** (tablas en `apps/dashboard`).
   - **Anime.js** (transiciones editoriales y revelados suaves) y **Three.js** (fondo ambiental orgánico con carga diferida y respeto a `prefers-reduced-motion`).
   - **Supabase** (PostgreSQL + Auth + Storage + RLS) encapsulado en `packages/database`.
4. **Calidad y Seguridad:**
   - Validar entradas con **Zod**.
   - Nunca exponer `SERVICE_ROLE_KEY` en el cliente.
   - Toda tabla clínica o administrativa debe tener **RLS** habilitado antes de pasar a producción.

---

## 3. Skills Recomendadas por Tipo de Tarea (Cross-Agent)

Todas estas skills están instaladas a nivel universal en `~/.agents/skills/` (compatibles con Codex, Gemini, Claude, Antigravity y Cursor):

- **Flujo de trabajo y planificación:** `using-superpowers`, `brainstorming`, `writing-plans`, `executing-plans`, `test-driven-development`, `verification-before-completion`
- **Diseño y revisión de documentos (EGM):** `egm-brainstorm`, `egm-draft`, `egm-review`, `egm-review-loop`, `egm-drift-report`
- **Web moderna, rendimiento y CWV:** `modern-web-guidance` (ejecutar antes de implementar HTML/CSS/DOM/animaciones en cliente)
- **Diseño Responsive & Mobile-First:** `mobile-first-design`, `responsive-design`
- **Auditoría, seguridad y deuda técnica:** `security-audit`, `ponytail`, `ponytail-audit`, `ponytail-review`, `ponytail-debt`
- **Descubrimiento de nuevas skills:** `find-skills` (`npx skills find <query>`)
