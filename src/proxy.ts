import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { updateSession } from '@/lib/supabase/proxy';

const handleI18nRouting = createMiddleware(routing);

export const proxy = async (request: NextRequest) => {
  const intlResponse = handleI18nRouting(request);

  if (intlResponse.headers.get('location')) {
    return intlResponse;
  }

  return updateSession(request, intlResponse);
};

export const config = {
  matcher: [
    '/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
