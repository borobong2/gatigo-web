import { NextResponse, type NextRequest } from 'next/server';
import { getSafeNextPath } from '@/lib/auth/redirect';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

export const GET = async (request: NextRequest) => {
  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get('next'));
  const redirectUrl = request.nextUrl.clone();
  const nextUrl = new URL(nextPath, request.url);
  redirectUrl.pathname = hasSupabaseEnv() ? nextUrl.pathname : '/login';
  redirectUrl.search = hasSupabaseEnv() ? nextUrl.search : '?error=config';

  const code = request.nextUrl.searchParams.get('code');
  if (!code || !hasSupabaseEnv()) {
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirectUrl.pathname = '/login';
    redirectUrl.search = '?error=callback';
  }

  return NextResponse.redirect(redirectUrl);
};
