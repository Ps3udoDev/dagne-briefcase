export async function revalidateWeb(): Promise<void> {
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';
  const secret = process.env.REVALIDATION_SECRET || '';

  try {
    await fetch(`${webUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'x-revalidation-secret': secret,
      },
      cache: 'no-store',
    });
  } catch {
    // Ignorar errores de red si apps/web no está ejecutándose localmente.
  }
}
