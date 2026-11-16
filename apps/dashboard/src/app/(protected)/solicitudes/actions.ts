'use server';

import { revalidatePath } from 'next/cache';
import {
  updateContactRequestStatus,
  type ContactRequestStatus,
} from '@psicoiris/database/server';
import { requireAdminUser } from '@/lib/auth';

export interface ContactActionResult {
  ok: boolean;
  message: string;
}

export async function updateContactStatusAction(
  id: string,
  status: ContactRequestStatus
): Promise<ContactActionResult> {
  await requireAdminUser();

  try {
    await updateContactRequestStatus(id, status);
    revalidatePath('/solicitudes');
    revalidatePath('/');
    return { ok: true, message: 'Estado actualizado.' };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el estado de la solicitud.',
    };
  }
}
