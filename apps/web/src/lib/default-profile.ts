import type { SiteProfile } from '@psicoiris/database';

export const DEFAULT_SITE_PROFILE: SiteProfile = {
  id: 'default-profile',
  owner_id: 'default-owner',
  tenant_slug: 'psicoiris',
  brand_name: 'Psicoiris',
  clinician_name: 'Dra. Sofía Mendoza',
  clinician_title: 'Psicología Clínica',
  hero_badge: 'Psicología Clínica Independiente',
  hero_title: 'Un espacio para comprenderte y volver a ti.',
  hero_subtitle:
    'Acompañamiento psicológico individual para transitar momentos de cambio, gestionar el malestar emocional y construir una relación más amable y compasiva contigo mismo, en un entorno seguro y confidencial.',
  hero_image_url: null,
  modality_summary:
    'Atención individual para personas adultas · Modalidad online y presencial',
  about_title:
    'La terapia no es dar consejos, es acompañarte a clarificar tus propias respuestas.',
  about_paragraphs: [
    'Entiendo la relación terapéutica como un espacio colaborativo y simétrico. Mi labor no consiste en decirte cómo vivir tu vida, sino en proporcionarte un marco riguroso de reflexión para que logres identificar patrones desadaptativos y conectar con tus propios recursos.',
    'Integro aportes de la terapia cognitivo-conductual contemporánea de tercera generación con una mirada psicodinámica y humanista. Este enfoque integrativo me permite adaptar el encuadre a tu individualidad, reconociendo tu ritmo biológico, tus tiempos psicológicos y el contexto sociocultural en que habitas.',
    'Mantengo un compromiso constante con la formación científica actualizada, la docencia y la supervisión ética regular para ofrecerte una atención responsable, humana y honesta.',
  ],
  about_quote:
    'Cada proceso terapéutico es único; no hay fórmulas predeterminadas, sino un encuentro humano con rigor científico.',
  about_image_url: null,
  services: [
    {
      title: 'Terapia Individual para Adultos',
      tag: 'Individual',
      description:
        'Un espacio seguro y sostenido para explorar bloqueos internos, profundizar en el autoconocimiento y fortalecer herramientas sólidas de autorregulación emocional.',
    },
    {
      title: 'Ansiedad y Gestión del Estrés',
      tag: 'Regulación',
      description:
        'Comprensión del funcionamiento de tu sistema nervioso, identificación de detonantes específicos y estrategias prácticas para reducir la sobrecarga mental cotidiana.',
    },
    {
      title: 'Autoestima y Procesos de Cambio',
      tag: 'Transformación',
      description:
        'Reconstrucción compasiva del diálogo interno, establecimiento de límites claros y saludables, y acompañamiento en transiciones vitales significativas.',
    },
    {
      title: 'Duelo, Pérdidas y Vínculos',
      tag: 'Vínculos',
      description:
        'Procesamiento respetuoso y compasivo de rupturas afectivas, duelos significativos o dinámicas relacionales complejas que requieren una mirada analítica profunda.',
    },
  ],
  process_steps: [
    {
      step: '01',
      title: 'Primera conversación',
      description:
        'Un contacto inicial sin compromiso para conocer tus motivos de consulta, resolver dudas prácticas sobre el funcionamiento y acordar horarios disponibles.',
    },
    {
      step: '02',
      title: 'Definimos el camino',
      description:
        'En las primeras sesiones evaluamos en conjunto tus objetivos personales, tus fortalezas y trazamos una dirección terapéutica compartida y realista.',
    },
    {
      step: '03',
      title: 'Avanzamos a tu ritmo',
      description:
        'Sesiones regulares de profundización y consolidación, con revisiones periódicas y consensuadas sobre cómo te vas sintiendo y qué cambios percibes.',
    },
  ],
  contact_email: 'consulta@psicoiris.com',
  contact_phone: '+34 600 000 000',
  contact_hours: 'Lunes a Viernes con cita previa concertada.',
  professional_license: 'Colegiada Oficial de la Psicología Nº M-32891',
  is_published: true,
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
};
