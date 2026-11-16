import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@psicoiris/database/server';

export const DEFAULT_ADMIN_EMAIL = 'dagneraza123@gmail.com';

export function getAdminEmail(): string {
  return (process.env.CLINICIAN_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
}

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || user.email.toLowerCase() !== getAdminEmail()) {
    return null;
  }

  return user;
}

export async function requireAdminUser() {
  const user = await getAuthenticatedAdmin();
  if (!user) {
    redirect('/login');
  }
  return user;
}
