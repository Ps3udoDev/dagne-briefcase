import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATION_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, error: 'REVALIDATION_SECRET is not configured' },
      { status: 500 }
    );
  }

  let bodySecret: string | undefined;
  try {
    const body = (await request.json()) as { secret?: unknown };
    if (typeof body?.secret === 'string') {
      bodySecret = body.secret;
    }
  } catch {
    // Empty or non-JSON body is allowed when secret is sent via header
  }

  const headerSecret = request.headers.get('x-revalidation-secret');
  const authHeader = request.headers.get('authorization');
  const bearerSecret = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined;

  const providedSecret = headerSecret ?? bearerSecret ?? bodySecret;

  if (!providedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  revalidatePath('/');
  revalidatePath('/articulos');
  revalidatePath('/articulos/[slug]', 'page');

  return NextResponse.json({
    revalidated: true,
    paths: ['/', '/articulos', '/articulos/[slug]'],
  });
}
