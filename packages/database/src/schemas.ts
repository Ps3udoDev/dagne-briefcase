import { z } from 'zod';

export const PostReferenceSchema = z.object({
  citation: z.string().min(3, 'La referencia debe tener al menos 3 caracteres'),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
});

export const PostStatusSchema = z.enum(['draft', 'published', 'archived']);

export const PostInputSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(180),
  slug: z
    .string()
    .min(3)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido (solo minúsculas, números y guiones)'),
  excerpt: z.string().min(10, 'El resumen es obligatorio').max(400),
  content_md: z.string().min(20, 'El contenido del artículo es obligatorio'),
  category_id: z.string().uuid().nullable().optional(),
  cover_image_url: z.string().url().nullable().optional().or(z.literal('')),
  cover_image_alt: z.string().max(200).nullable().optional(),
  reading_time_minutes: z.coerce.number().int().min(1).max(120).default(4),
  tags: z.array(z.string().min(1)).default([]),
  references_list: z.array(PostReferenceSchema).default([]),
  status: PostStatusSchema.default('draft'),
  seo_title: z.string().max(70).nullable().optional(),
  seo_description: z.string().max(160).nullable().optional(),
});

export const ServiceItemSchema = z.object({
  title: z.string().min(2),
  tag: z.string().min(2),
  description: z.string().min(10),
});

export const ProcessStepSchema = z.object({
  step: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10),
});

export const SiteProfileInputSchema = z.object({
  brand_name: z.string().min(2).default('Psicoiris'),
  clinician_name: z.string().min(2),
  clinician_title: z.string().min(2),
  hero_badge: z.string().min(2),
  hero_title: z.string().min(5),
  hero_subtitle: z.string().min(10),
  hero_image_url: z.string().url().nullable().optional().or(z.literal('')),
  modality_summary: z.string().min(5),
  about_title: z.string().min(5),
  about_paragraphs: z.array(z.string().min(5)).default([]),
  about_quote: z.string().min(5),
  about_image_url: z.string().url().nullable().optional().or(z.literal('')),
  services: z.array(ServiceItemSchema).default([]),
  process_steps: z.array(ProcessStepSchema).default([]),
  contact_email: z.string().email().nullable().optional().or(z.literal('')),
  contact_phone: z.string().max(40).nullable().optional(),
  contact_hours: z.string().max(160).nullable().optional(),
  professional_license: z.string().max(120).nullable().optional(),
  is_published: z.boolean().default(true),
});

export const ContactRequestInputSchema = z.object({
  full_name: z.string().min(2, 'Ingresa tu nombre completo').max(120),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().max(40).optional().or(z.literal('')),
  reason: z.string().min(2, 'Selecciona un motivo de consulta'),
  message: z.string().max(2000).optional().or(z.literal('')),
  consent_accepted: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar la política de privacidad' }),
  }),
});

export type PostReference = z.infer<typeof PostReferenceSchema>;
export type PostInput = z.infer<typeof PostInputSchema>;
export type SiteProfileInput = z.infer<typeof SiteProfileInputSchema>;
export type ContactRequestInput = z.infer<typeof ContactRequestInputSchema>;
