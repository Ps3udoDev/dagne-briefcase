'use server';

import { revalidatePath } from 'next/cache';
import {
  SiteProfileInputSchema,
  updateSiteProfile,
  type SiteProfileInput,
} from '@psicoiris/database/server';
import { requireAdminUser } from '@/lib/auth';
import { revalidateWeb } from '@/lib/revalidate';

export interface ProfileActionResult {
  ok: boolean;
  message: string;
}

export async function saveProfileAction(
  input: SiteProfileInput
): Promise<ProfileActionResult> {
  const user = await requireAdminUser();
  const parsed = SiteProfileInputSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      message: firstIssue
        ? `${firstIssue.path.join('.')}: ${firstIssue.message}`
        : 'Revisa los campos del portafolio antes de guardar.',
    };
  }

  try {
    await updateSiteProfile(user.id, parsed.data);
    await revalidateWeb();
    revalidatePath('/perfil');
    revalidatePath('/');
    return {
      ok: true,
      message: 'Portafolio actualizado y publicado correctamente.',
    };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? err.message
          : 'No se pudo guardar el perfil del portafolio.',
    };
  }
}
