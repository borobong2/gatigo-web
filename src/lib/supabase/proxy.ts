import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isProtectedRoute } from '@/lib/auth/route-policy';
import { routing } from '@/i18n/routing';
import { getSupabaseEnv, hasSupabaseEnv } from './env';

const getLoginPath = (pathname: string) => {
  const [firstSegment] = pathname.slice(1).split('/');

  return routing.locales.includes(
    firstSegment as (typeof routing.locales)[number],
  ) && firstSegment !== routing.defaultLocale
    ? `/${firstSegment}/login`
    : '/login';
};

export const updateSession = async (
  request: NextRequest,
  response = NextResponse.next({ request }),
) => {
  if (!hasSupabaseEnv()) {
    return response;
  }

  const supabaseResponse = response;
  const { publishableKey, url } = getSupabaseEnv();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        cookiesToSet.forEach(({ name, options, value }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });
  const { data } = await supabase.auth.getClaims();

  if (isProtectedRoute(request.nextUrl.pathname) && !data?.claims) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getLoginPath(request.nextUrl.pathname);
    redirectUrl.search = '';
    redirectUrl.searchParams.set(
      'next',
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
};
