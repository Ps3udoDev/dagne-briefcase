'use server';

import {
  ContactRequestInputSchema,
  createContactRequest,
  type ContactRequestInput,
} from '@psicoiris/database/server';

export interface ContactActionResult {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof ContactRequestInput, string>>;
}

export async function submitContactRequest(
  input: ContactRequestInput
): Promise<ContactActionResult> {
  const parsed = ContactRequestInputSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactRequestInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactRequestInput | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      ok: false,
      message: 'Por favor revisa los campos señalados antes de continuar.',
      fieldErrors,
    };
  }

  try {
    await createContactRequest(parsed.data);
    return {
      ok: true,
      message:
        'Mensaje recibido con serenidad. Te responderé personalmente en un plazo de 24 a 48 horas hábiles.',
    };
  } catch {
    return {
      ok: false,
      message:
        'No fue posible enviar tu solicitud en este momento. Por favor intenta de nuevo o escribe directamente al correo de consulta.',
    };
  }
}
