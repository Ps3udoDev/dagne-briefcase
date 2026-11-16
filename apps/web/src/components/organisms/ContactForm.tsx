'use client';

import { useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, Clock, Info, Mail, MapPin, Phone, Send } from 'lucide-react';
import {
  ContactRequestInputSchema,
  type ContactRequestInput,
  type SiteProfile,
} from '@psicoiris/database';
import { Button, FormField, Input, Select, Textarea } from '@psicoiris/ui';
import { submitContactRequest } from '@/app/actions';

export interface ContactFormProps {
  profile: SiteProfile;
}

type FieldKey = keyof ContactRequestInput;
type FieldErrors = Partial<Record<FieldKey, string>>;

const INITIAL_VALUES = {
  full_name: '',
  email: '',
  phone: '',
  reason: 'Terapia individual para adultos',
  message: '',
  consent_accepted: false,
};

const REASON_OPTIONS = [
  'Terapia individual para adultos',
  'Ansiedad y gestión del estrés',
  'Procesos de cambio y autoestima',
  'Duelo o dinámicas relacionales',
  'Otra consulta o duda general',
] as const;

export function ContactForm({ profile }: ContactFormProps) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const validateSingleField = (key: FieldKey, rawValue: unknown): string | undefined => {
    const schema = ContactRequestInputSchema.shape[key];
    const result = schema.safeParse(rawValue);
    return result.success ? undefined : result.error.issues[0]?.message;
  };

  const handleFieldChange = <K extends FieldKey>(
    key: K,
    nextValue: (typeof INITIAL_VALUES)[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: nextValue }));
    setTouched((prev) => ({ ...prev, [key]: true }));
    if (errors[key]) {
      const nextError = validateSingleField(key, nextValue);
      setErrors((prev) => ({ ...prev, [key]: nextError }));
    }
  };

  const handleFieldBlur = (key: FieldKey) => {
    if (!touched[key] && !values[key]) return;
    const nextError = validateSingleField(key, values[key]);
    setErrors((prev) => ({ ...prev, [key]: nextError }));
  };

  const focusFirstInvalid = (fieldErrors: FieldErrors) => {
    const order: FieldKey[] = [
      'full_name',
      'email',
      'phone',
      'reason',
      'message',
      'consent_accepted',
    ];
    const firstKey = order.find((k) => Boolean(fieldErrors[k]));
    if (!firstKey || !formRef.current) return;
    const target = formRef.current.querySelector<HTMLElement>(
      `[name="${firstKey}"]`
    );
    target?.focus();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    const parsed = ContactRequestInputSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldKey | undefined;
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setErrors(nextErrors);
      focusFirstInvalid(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitContactRequest(parsed.data);
      if (!result.ok) {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
          focusFirstInvalid(result.fieldErrors);
        }
        setStatusMessage({ ok: false, text: result.message });
        return;
      }

      setErrors({});
      setTouched({});
      setValues(INITIAL_VALUES);
      setStatusMessage({ ok: true, text: result.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contacto"
      className="w-full bg-surface-container py-space-xl lg:py-space-2xl"
    >
      <div className="mx-auto w-full max-w-[1200px] px-margin md:px-gutter-desktop lg:px-margin-desktop">
        <div className="grid grid-cols-1 items-start gap-gutter-desktop lg:grid-cols-12">
          <div className="flex flex-col gap-space-md lg:col-span-5">
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
                Contacto Directo
              </span>
              <h2 className="font-serif text-[2rem] font-normal leading-[1.25] tracking-[-0.01em] text-plum-ink lg:text-[2.5rem]">
                Iniciemos la conversación
              </h2>
              <p className="mt-2 text-base leading-relaxed text-on-surface-variant">
                Puedes escribirme para consultar disponibilidad, resolver cualquier duda
                sobre los honorarios o agendar nuestra primera sesión.
              </p>
            </div>

            <div className="flex flex-col gap-space-sm rounded-2xl bg-surface p-space-md shadow-calmed">
              {profile.contact_email && (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-primary">
                    <Mail aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Correo electrónico
                    </span>
                    <p className="text-base font-medium text-on-surface">
                      {profile.contact_email}
                    </p>
                  </div>
                </div>
              )}

              {profile.contact_phone && (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-primary">
                    <Phone aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Teléfono / WhatsApp
                    </span>
                    <p className="text-base font-medium text-on-surface">
                      {profile.contact_phone}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-primary">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Modalidad de atención
                  </span>
                  <p className="text-base text-on-surface">
                    {profile.modality_summary}
                  </p>
                </div>
              </div>

              {profile.contact_hours && (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-primary">
                    <Clock aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Horarios
                    </span>
                    <p className="text-base text-on-surface">
                      {profile.contact_hours}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-surface-container-highest p-space-md text-on-surface-variant">
              <div className="flex items-start gap-2.5">
                <Info
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                />
                <p className="text-sm leading-relaxed">
                  <strong className="font-semibold text-on-surface">
                    Aviso importante:
                  </strong>{' '}
                  Este formulario está destinado a coordinar citas y consultas
                  informativas. No es una vía adecuada para situaciones de urgencia o
                  emergencia médica o psiquiátrica.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-surface p-space-lg shadow-calmed md:p-space-xl lg:col-span-7">
            <form
              ref={formRef}
              noValidate
              onSubmit={handleSubmit}
              className="flex flex-col gap-space-sm"
            >
              <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
                <FormField
                  label="Nombre y apellidos"
                  htmlFor="contact-full-name"
                  required
                  error={errors.full_name}
                >
                  <Input
                    id="contact-full-name"
                    name="full_name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Tu nombre completo"
                    value={values.full_name}
                    aria-invalid={Boolean(errors.full_name)}
                    onChange={(e) => handleFieldChange('full_name', e.target.value)}
                    onBlur={() => handleFieldBlur('full_name')}
                  />
                </FormField>

                <FormField
                  label="Correo electrónico"
                  htmlFor="contact-email"
                  required
                  error={errors.email}
                >
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    value={values.email}
                    aria-invalid={Boolean(errors.email)}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
                <FormField
                  label="Teléfono (opcional)"
                  htmlFor="contact-phone"
                  error={errors.phone}
                >
                  <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+34 600 000 000"
                    value={values.phone}
                    aria-invalid={Boolean(errors.phone)}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    onBlur={() => handleFieldBlur('phone')}
                  />
                </FormField>

                <FormField
                  label="Motivo general de consulta"
                  htmlFor="contact-reason"
                  required
                  error={errors.reason}
                >
                  <Select
                    id="contact-reason"
                    name="reason"
                    required
                    value={values.reason}
                    aria-invalid={Boolean(errors.reason)}
                    onChange={(e) => handleFieldChange('reason', e.target.value)}
                    onBlur={() => handleFieldBlur('reason')}
                  >
                    {REASON_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <FormField
                label="Mensaje opcional"
                htmlFor="contact-message"
                error={errors.message}
              >
                <Textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder="Cuéntame brevemente qué te gustaría trabajar o resolver..."
                  value={values.message}
                  aria-invalid={Boolean(errors.message)}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  onBlur={() => handleFieldBlur('message')}
                />
              </FormField>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="contact-consent"
                  className="flex min-h-[48px] cursor-pointer items-start gap-3 py-1.5 text-sm leading-relaxed text-on-surface-variant"
                >
                  <input
                    id="contact-consent"
                    name="consent_accepted"
                    type="checkbox"
                    required
                    checked={values.consent_accepted}
                    aria-invalid={Boolean(errors.consent_accepted)}
                    aria-describedby={
                      errors.consent_accepted ? 'contact-consent-error' : undefined
                    }
                    onChange={(e) =>
                      handleFieldChange('consent_accepted', e.target.checked)
                    }
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-mauve-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <span>
                    He leído y acepto la política de privacidad y el tratamiento
                    confidencial de mis datos con el único propósito de coordinar mi
                    cita.
                  </span>
                </label>
                {errors.consent_accepted && (
                  <p
                    id="contact-consent-error"
                    role="alert"
                    className="text-sm text-error"
                  >
                    {errors.consent_accepted}
                  </p>
                )}
              </div>

              <div className="mt-space-xs flex flex-col gap-2">
                <Button type="submit" disabled={submitting} className="w-full">
                  <span>
                    {submitting
                      ? 'Enviando solicitud...'
                      : 'Enviar mensaje y solicitar cita'}
                  </span>
                  <Send aria-hidden="true" className="h-4 w-4" />
                </Button>
                <p className="mt-1 text-center text-sm text-on-surface-variant">
                  Responderé a tu mensaje en un plazo máximo de 24 a 48 horas hábiles
                  con total confidencialidad.
                </p>
              </div>

              <div aria-live="polite" className="mt-2">
                {statusMessage && (
                  <div
                    role="status"
                    className={
                      statusMessage.ok
                        ? 'rounded-2xl bg-surface-container-high p-4 text-center text-plum-ink'
                        : 'rounded-2xl border border-error/40 bg-error/5 p-4 text-center text-error'
                    }
                  >
                    {statusMessage.ok && (
                      <CheckCircle2
                        aria-hidden="true"
                        className="mx-auto mb-1.5 h-6 w-6 text-primary"
                      />
                    )}
                    <p className="text-sm font-medium">{statusMessage.text}</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
