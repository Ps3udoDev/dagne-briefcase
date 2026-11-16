import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@psicoiris/database';

const ADMIN_EMAIL = (
  process.env.CLINICIAN_ADMIN_EMAIL || 'dagneraza123@gmail.com'
)
  .trim()
  .toLowerCase();

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const appliedCookies = new Map<
    string,
    { value: string; options?: Record<string, unknown> }
  >();

  const supabase = createServerSupabaseClient({
    getAll() {
      return request.cookies.getAll();
    },
    set(name, value, options) {
      request.cookies.set(name, value);
      appliedCookies.set(name, { value, options });
      response = NextResponse.next({ request });
      for (const [key, cookie] of appliedCookies) {
        response.cookies.set(key, cookie.value, cookie.options);
      }
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthorizedAdmin =
    Boolean(user?.email) && user!.email!.toLowerCase() === ADMIN_EMAIL;
  const isLoginRoute = request.nextUrl.pathname.startsWith('/login');

  if (!isAuthorizedAdmin && !isLoginRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    if (user?.email) {
      loginUrl.searchParams.set('error', 'unauthorized');
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthorizedAdmin && isLoginRoute) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = '/';
    return NextResponse.redirect(homeUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
