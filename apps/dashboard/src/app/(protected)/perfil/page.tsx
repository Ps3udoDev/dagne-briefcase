import {
  createAdminSupabaseClient,
  type SiteProfile,
  type SiteProfileInput,
} from '@psicoiris/database';
import { ProfileEditorForm } from '@/components/ProfileEditorForm';

export const dynamic = 'force-dynamic';

const DEFAULT_PROFILE: SiteProfileInput = {
  brand_name: 'Psicoiris',
  clinician_name: 'Iris Dagneraza',
  clinician_title: 'Psicóloga Clínica',
  hero_badge: 'Psicología Clínica · Atención Presencial y Online',
  hero_title: 'Un espacio sereno para comprender tu historia y habitar tu presente.',
  hero_subtitle:
    'Acompañamiento psicoterapéutico basado en evidencia, con calidez humana y rigor clínico.',
  hero_image_url: '',
  modality_summary: 'Sesiones individuales · Online y Presencial',
  about_title: 'Acompañamiento ético, cercano y a tu ritmo',
  about_paragraphs: [
    'Creo en una psicología clínica que escucha sin juicios y ofrece herramientas concretas para el bienestar emocional.',
  ],
  about_quote:
    'Cuidar la salud mental es abrir espacio para respirar con mayor claridad.',
  about_image_url: '',
  services: [
    {
      title: 'Psicoterapia Individual',
      tag: 'Adultos · 50 min',
      description:
        'Proceso terapéutico personalizado para abordar ansiedad, estado de ánimo, duelos y transiciones vitales.',
    },
  ],
  process_steps: [
    {
      step: '01',
      title: 'Primer contacto',
      description:
        'Envías tu solicitud con el motivo de consulta y coordinamos un horario.',
    },
  ],
  contact_email: 'dagneraza123@gmail.com',
  contact_phone: '',
  contact_hours: 'Lunes a Viernes · 9:00 a 18:00',
  professional_license: '',
  is_published: true,
};

export default async function ProfilePage() {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from('site_profile')
    .select('*')
    .eq('tenant_slug', 'psicoiris')
    .maybeSingle();

  const row = data as SiteProfile | null;

  const initialData: SiteProfileInput = row
    ? {
        brand_name: row.brand_name,
        clinician_name: row.clinician_name,
        clinician_title: row.clinician_title,
        hero_badge: row.hero_badge,
        hero_title: row.hero_title,
        hero_subtitle: row.hero_subtitle,
        hero_image_url: row.hero_image_url ?? '',
        modality_summary: row.modality_summary,
        about_title: row.about_title,
        about_paragraphs: row.about_paragraphs ?? [],
        about_quote: row.about_quote,
        about_image_url: row.about_image_url ?? '',
        services: row.services ?? [],
        process_steps: row.process_steps ?? [],
        contact_email: row.contact_email ?? '',
        contact_phone: row.contact_phone ?? '',
        contact_hours: row.contact_hours ?? '',
        professional_license: row.professional_license ?? '',
        is_published: row.is_published,
      }
    : DEFAULT_PROFILE;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Portafolio
        </p>
        <h1 className="font-serif text-3xl font-normal text-plum-ink md:text-4xl">
          Editor del sitio principal
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
          Actualiza los textos de portada, biografía, servicios y datos de
          contacto visibles en el portafolio público.
        </p>
      </header>

      <ProfileEditorForm initialData={initialData} />
    </div>
  );
}
