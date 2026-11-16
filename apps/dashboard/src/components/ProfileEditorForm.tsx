'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { SiteProfileInput } from '@psicoiris/database';
import { Button, FormField, Input, Textarea } from '@psicoiris/ui';
import { saveProfileAction } from '@/app/(protected)/perfil/actions';

export interface ProfileEditorFormProps {
  initialData: SiteProfileInput;
}

export function ProfileEditorForm({ initialData }: ProfileEditorFormProps) {
  const [form, setForm] = useState<SiteProfileInput>(initialData);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof SiteProfileInput>(
    key: K,
    value: SiteProfileInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    startTransition(async () => {
      const result = await saveProfileAction(form);
      setStatus(result);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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

      {/* 1. Identidad */}
      <section className="space-y-5 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8">
        <h2 className="font-serif text-2xl font-normal text-plum-ink">
          Identidad profesional
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField label="Nombre de marca" htmlFor="brand_name" required>
            <Input
              id="brand_name"
              value={form.brand_name}
              onChange={(e) => updateField('brand_name', e.target.value)}
              required
            />
          </FormField>

          <FormField
            label="Nombre de la psicóloga"
            htmlFor="clinician_name"
            required
          >
            <Input
              id="clinician_name"
              value={form.clinician_name}
              onChange={(e) => updateField('clinician_name', e.target.value)}
              required
            />
          </FormField>

          <FormField label="Título clínico" htmlFor="clinician_title" required>
            <Input
              id="clinician_title"
              value={form.clinician_title}
              onChange={(e) => updateField('clinician_title', e.target.value)}
              required
            />
          </FormField>

          <FormField
            label="Registro / Cédula profesional"
            htmlFor="professional_license"
          >
            <Input
              id="professional_license"
              value={form.professional_license ?? ''}
              onChange={(e) =>
                updateField('professional_license', e.target.value)
              }
            />
          </FormField>
        </div>

        <label className="inline-flex min-h-[48px] cursor-pointer items-center gap-3 text-sm font-medium text-plum-ink">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => updateField('is_published', e.target.checked)}
            className="h-5 w-5 rounded border-mauve-border text-primary focus:ring-primary"
          />
          Portafolio visible al público
        </label>
      </section>

      {/* 2. Hero */}
      <section className="space-y-5 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8">
        <h2 className="font-serif text-2xl font-normal text-plum-ink">
          Portada principal (Hero)
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField label="Etiqueta superior" htmlFor="hero_badge" required>
            <Input
              id="hero_badge"
              value={form.hero_badge}
              onChange={(e) => updateField('hero_badge', e.target.value)}
              required
            />
          </FormField>

          <FormField
            label="Resumen de modalidad"
            htmlFor="modality_summary"
            required
          >
            <Input
              id="modality_summary"
              value={form.modality_summary}
              onChange={(e) => updateField('modality_summary', e.target.value)}
              required
            />
          </FormField>
        </div>

        <FormField label="Titular principal" htmlFor="hero_title" required>
          <Input
            id="hero_title"
            value={form.hero_title}
            onChange={(e) => updateField('hero_title', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Subtítulo" htmlFor="hero_subtitle" required>
          <Textarea
            id="hero_subtitle"
            rows={3}
            value={form.hero_subtitle}
            onChange={(e) => updateField('hero_subtitle', e.target.value)}
            required
          />
        </FormField>

        <FormField label="URL de imagen de portada" htmlFor="hero_image_url">
          <Input
            id="hero_image_url"
            type="url"
            placeholder="https://..."
            value={form.hero_image_url ?? ''}
            onChange={(e) => updateField('hero_image_url', e.target.value)}
          />
        </FormField>
      </section>

      {/* 3. Sobre mí */}
      <section className="space-y-5 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8">
        <h2 className="font-serif text-2xl font-normal text-plum-ink">
          Sobre mí y enfoque clínico
        </h2>

        <FormField label="Título de sección" htmlFor="about_title" required>
          <Input
            id="about_title"
            value={form.about_title}
            onChange={(e) => updateField('about_title', e.target.value)}
            required
          />
        </FormField>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-on-surface">
              Párrafos biográficos
            </span>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                updateField('about_paragraphs', [...form.about_paragraphs, ''])
              }
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Agregar párrafo
            </Button>
          </div>

          {form.about_paragraphs.map((paragraph, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Textarea
                aria-label={`Párrafo ${idx + 1}`}
                rows={3}
                value={paragraph}
                onChange={(e) => {
                  const next = [...form.about_paragraphs];
                  next[idx] = e.target.value;
                  updateField('about_paragraphs', next);
                }}
                required
              />
              <Button
                type="button"
                variant="ghost"
                aria-label={`Eliminar párrafo ${idx + 1}`}
                onClick={() =>
                  updateField(
                    'about_paragraphs',
                    form.about_paragraphs.filter((_, i) => i !== idx)
                  )
                }
                className="shrink-0 px-3 text-error hover:bg-error/10"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>

        <FormField label="Cita destacada" htmlFor="about_quote" required>
          <Textarea
            id="about_quote"
            rows={2}
            value={form.about_quote}
            onChange={(e) => updateField('about_quote', e.target.value)}
            required
          />
        </FormField>

        <FormField label="URL de retrato profesional" htmlFor="about_image_url">
          <Input
            id="about_image_url"
            type="url"
            placeholder="https://..."
            value={form.about_image_url ?? ''}
            onChange={(e) => updateField('about_image_url', e.target.value)}
          />
        </FormField>
      </section>

      {/* 4. Servicios */}
      <section className="space-y-5 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-normal text-plum-ink">
            Áreas de acompañamiento
          </h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              updateField('services', [
                ...form.services,
                { title: '', tag: '', description: '' },
              ])
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar servicio
          </Button>
        </div>

        <div className="space-y-5">
          {form.services.map((service, idx) => (
            <div
              key={idx}
              className="space-y-4 rounded-xl border border-mauve-border/50 bg-surface-container-low/40 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-primary">
                  Servicio #{idx + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label={`Eliminar servicio ${idx + 1}`}
                  onClick={() =>
                    updateField(
                      'services',
                      form.services.filter((_, i) => i !== idx)
                    )
                  }
                  className="px-3 text-error hover:bg-error/10"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Título" required>
                  <Input
                    value={service.title}
                    onChange={(e) => {
                      const next = [...form.services];
                      next[idx] = { ...service, title: e.target.value };
                      updateField('services', next);
                    }}
                    required
                  />
                </FormField>
                <FormField label="Etiqueta / Modalidad" required>
                  <Input
                    value={service.tag}
                    onChange={(e) => {
                      const next = [...form.services];
                      next[idx] = { ...service, tag: e.target.value };
                      updateField('services', next);
                    }}
                    required
                  />
                </FormField>
              </div>

              <FormField label="Descripción" required>
                <Textarea
                  rows={2}
                  value={service.description}
                  onChange={(e) => {
                    const next = [...form.services];
                    next[idx] = { ...service, description: e.target.value };
                    updateField('services', next);
                  }}
                  required
                />
              </FormField>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Proceso terapéutico */}
      <section className="space-y-5 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-normal text-plum-ink">
            Pasos del proceso terapéutico
          </h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              updateField('process_steps', [
                ...form.process_steps,
                {
                  step: String(form.process_steps.length + 1).padStart(2, '0'),
                  title: '',
                  description: '',
                },
              ])
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar paso
          </Button>
        </div>

        <div className="space-y-5">
          {form.process_steps.map((item, idx) => (
            <div
              key={idx}
              className="space-y-4 rounded-xl border border-mauve-border/50 bg-surface-container-low/40 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-primary">
                  Paso #{idx + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label={`Eliminar paso ${idx + 1}`}
                  onClick={() =>
                    updateField(
                      'process_steps',
                      form.process_steps.filter((_, i) => i !== idx)
                    )
                  }
                  className="px-3 text-error hover:bg-error/10"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <FormField label="Número" required>
                  <Input
                    value={item.step}
                    onChange={(e) => {
                      const next = [...form.process_steps];
                      next[idx] = { ...item, step: e.target.value };
                      updateField('process_steps', next);
                    }}
                    required
                  />
                </FormField>
                <div className="md:col-span-3">
                  <FormField label="Título del paso" required>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const next = [...form.process_steps];
                        next[idx] = { ...item, title: e.target.value };
                        updateField('process_steps', next);
                      }}
                      required
                    />
                  </FormField>
                </div>
              </div>

              <FormField label="Descripción" required>
                <Textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const next = [...form.process_steps];
                    next[idx] = { ...item, description: e.target.value };
                    updateField('process_steps', next);
                  }}
                  required
                />
              </FormField>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Contacto */}
      <section className="space-y-5 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-6 shadow-calmed md:p-8">
        <h2 className="font-serif text-2xl font-normal text-plum-ink">
          Datos de contacto
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField label="Correo de contacto" htmlFor="contact_email">
            <Input
              id="contact_email"
              type="email"
              value={form.contact_email ?? ''}
              onChange={(e) => updateField('contact_email', e.target.value)}
            />
          </FormField>

          <FormField label="Teléfono / WhatsApp" htmlFor="contact_phone">
            <Input
              id="contact_phone"
              value={form.contact_phone ?? ''}
              onChange={(e) => updateField('contact_phone', e.target.value)}
            />
          </FormField>

          <FormField label="Horario de atención" htmlFor="contact_hours">
            <Input
              id="contact_hours"
              value={form.contact_hours ?? ''}
              onChange={(e) => updateField('contact_hours', e.target.value)}
            />
          </FormField>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          <Save className="h-4 w-4" aria-hidden="true" />
          {isPending ? 'Guardando cambios...' : 'Guardar portafolio'}
        </Button>
      </div>
    </form>
  );
}
