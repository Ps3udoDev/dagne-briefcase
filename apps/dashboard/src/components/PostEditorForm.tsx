'use client';

import { useState, useTransition, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ImagePlus, Plus, Save, Trash2 } from 'lucide-react';
import {
  createBrowserSupabaseClient,
  type PostCategory,
  type PostInput,
  type PostReference,
} from '@psicoiris/database';
import { Button, FormField, Input, Select, Textarea } from '@psicoiris/ui';
import { savePostAction } from '@/app/(protected)/posts/actions';

export interface PostEditorFormProps {
  postId?: string;
  initialData: PostInput;
  categories: PostCategory[];
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

export function PostEditorForm({
  postId,
  initialData,
  categories,
}: PostEditorFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PostInput>(initialData);
  const [slugTouched, setSlugTouched] = useState(Boolean(postId));
  const [tagsText, setTagsText] = useState(initialData.tags.join(', '));
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof PostInput>(key: K, value: PostInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : toSlug(title),
    }));
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus(null);
    try {
      const supabase = createBrowserSupabaseClient();
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const path = `posts/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('psicoiris-media')
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setStatus({
          ok: false,
          message: `Error al subir la imagen: ${uploadError.message}`,
        });
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('psicoiris-media').getPublicUrl(path);

      updateField('cover_image_url', publicUrl);
      setStatus({
        ok: true,
        message: 'Imagen de portada subida correctamente.',
      });
    } catch {
      setStatus({
        ok: false,
        message: 'No se pudo subir la imagen al bucket psicoiris-media.',
      });
    } finally {
      setUploading(false);
    }
  }

  function updateReference(
    index: number,
    patch: Partial<PostReference>
  ) {
    const next = [...form.references_list];
    const current = next[index] ?? { citation: '', url: '' };
    next[index] = { ...current, ...patch };
    updateField('references_list', next);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const parsedTags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    startTransition(async () => {
      const result = await savePostAction({
        ...form,
        id: postId,
        tags: parsedTags,
      });
      setStatus(result);

      if (result.ok && !postId && result.id) {
        router.push(`/posts/${result.id}`);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/posts"
          className="inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-primary hover:text-primary-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a publicaciones
        </Link>
      </div>

      {status && (
        <div
          role="status"
          aria-live="polite"
          className={
            status.ok
              ? 'rounded-2xl border border-mauve-border bg-lavender-soft/60 px-5 py-4 text-sm text-plum-ink'
              : 'rounded-2xl border border-error/30 bg-error/5 px-5 py-4 text-sm text-error'
          }
        >
          {status.message}
        </div>
      )}

      {/* Información principal */}
      <section className="space-y-5 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8">
        <h2 className="font-serif text-2xl font-normal text-plum-ink">
          Información del artículo
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField label="Título" htmlFor="post-title" required>
            <Input
              id="post-title"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </FormField>

          <FormField
            label="Slug (URL)"
            htmlFor="post-slug"
            hint="Solo minúsculas, números y guiones."
            required
          >
            <Input
              id="post-slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                updateField('slug', e.target.value);
              }}
              required
            />
          </FormField>
        </div>

        <FormField label="Resumen breve" htmlFor="post-excerpt" required>
          <Textarea
            id="post-excerpt"
            rows={2}
            value={form.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            required
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField label="Categoría" htmlFor="post-category">
            <Select
              id="post-category"
              value={form.category_id ?? ''}
              onChange={(e) =>
                updateField('category_id', e.target.value || null)
              }
            >
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Tiempo de lectura (min)"
            htmlFor="post-reading-time"
            required
          >
            <Input
              id="post-reading-time"
              type="number"
              min={1}
              max={120}
              value={form.reading_time_minutes}
              onChange={(e) =>
                updateField(
                  'reading_time_minutes',
                  Number(e.target.value) || 4
                )
              }
              required
            />
          </FormField>

          <FormField label="Estado" htmlFor="post-status" required>
            <Select
              id="post-status"
              value={form.status}
              onChange={(e) =>
                updateField(
                  'status',
                  e.target.value as PostInput['status']
                )
              }
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </Select>
          </FormField>
        </div>

        <FormField
          label="Etiquetas"
          htmlFor="post-tags"
          hint="Separa cada etiqueta con una coma (ej. ansiedad, mindfulness, sueño)."
        >
          <Input
            id="post-tags"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </FormField>
      </section>

      {/* Imagen de portada */}
      <section className="space-y-5 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8">
        <h2 className="font-serif text-2xl font-normal text-plum-ink">
          Imagen de portada
        </h2>

        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <FormField label="URL de imagen" htmlFor="post-cover-url">
              <Input
                id="post-cover-url"
                type="url"
                placeholder="https://..."
                value={form.cover_image_url ?? ''}
                onChange={(e) => updateField('cover_image_url', e.target.value)}
              />
            </FormField>
          </div>

          <label className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full border border-mauve-border bg-lavender-soft/65 px-5 py-3 text-sm font-medium text-plum-ink transition-colors hover:bg-lavender-soft">
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            <span>{uploading ? 'Subiendo...' : 'Subir archivo'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>
        </div>

        {form.cover_image_url && (
          <div className="overflow-hidden rounded-xl border border-mauve-border/50 bg-surface-container-low">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.cover_image_url}
              alt={form.cover_image_alt || 'Vista previa de portada'}
              className="max-h-64 w-full object-cover"
            />
          </div>
        )}

        <FormField
          label="Texto alternativo (accesibilidad)"
          htmlFor="post-cover-alt"
        >
          <Input
            id="post-cover-alt"
            value={form.cover_image_alt ?? ''}
            onChange={(e) => updateField('cover_image_alt', e.target.value)}
          />
        </FormField>
      </section>

      {/* Contenido Markdown */}
      <section className="space-y-5 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8">
        <h2 className="font-serif text-2xl font-normal text-plum-ink">
          Contenido del artículo (Markdown)
        </h2>

        <FormField
          label="Cuerpo en Markdown"
          htmlFor="post-content-md"
          hint="Puedes usar encabezados (##), listas, citas (>) y negritas."
          required
        >
          <Textarea
            id="post-content-md"
            rows={14}
            className="font-mono text-base"
            value={form.content_md}
            onChange={(e) => updateField('content_md', e.target.value)}
            required
          />
        </FormField>
      </section>

      {/* Referencias bibliográficas */}
      <section className="space-y-5 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-normal text-plum-ink">
            Referencias bibliográficas
          </h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              updateField('references_list', [
                ...form.references_list,
                { citation: '', url: '' },
              ])
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar referencia
          </Button>
        </div>

        {form.references_list.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            Aún no hay referencias agregadas.
          </p>
        ) : (
          <div className="space-y-4">
            {form.references_list.map((ref, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-xl border border-mauve-border/50 bg-surface-container-low/40 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-primary">
                    Referencia #{idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={`Eliminar referencia ${idx + 1}`}
                    onClick={() =>
                      updateField(
                        'references_list',
                        form.references_list.filter((_, i) => i !== idx)
                      )
                    }
                    className="px-3 text-error hover:bg-error/10"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>

                <FormField label="Cita (APA / texto)" required>
                  <Input
                    value={ref.citation}
                    onChange={(e) =>
                      updateReference(idx, { citation: e.target.value })
                    }
                    required
                  />
                </FormField>

                <FormField label="URL de respaldo (opcional)">
                  <Input
                    type="url"
                    placeholder="https://doi.org/..."
                    value={ref.url ?? ''}
                    onChange={(e) =>
                      updateReference(idx, { url: e.target.value })
                    }
                  />
                </FormField>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SEO */}
      <section className="space-y-5 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8">
        <h2 className="font-serif text-2xl font-normal text-plum-ink">
          Metadatos SEO (opcional)
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField label="Título SEO" htmlFor="post-seo-title">
            <Input
              id="post-seo-title"
              maxLength={70}
              value={form.seo_title ?? ''}
              onChange={(e) => updateField('seo_title', e.target.value)}
            />
          </FormField>
          <FormField label="Descripción SEO" htmlFor="post-seo-desc">
            <Input
              id="post-seo-desc"
              maxLength={160}
              value={form.seo_description ?? ''}
              onChange={(e) => updateField('seo_description', e.target.value)}
            />
          </FormField>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          <Save className="h-4 w-4" aria-hidden="true" />
          {isPending ? 'Guardando...' : 'Guardar publicación'}
        </Button>
      </div>
    </form>
  );
}
