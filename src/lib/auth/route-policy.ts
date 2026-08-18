import { routing } from '@/i18n/routing';

const PROTECTED_PATH_PREFIXES = ['/dashboard'];

const withoutLocale = (pathname: string) => {
  const [firstSegment] = pathname.slice(1).split('/');

  if (
    !routing.locales.includes(firstSegment as (typeof routing.locales)[number])
  ) {
    return pathname;
  }

  return pathname.slice(firstSegment.length + 1) || '/';
};

export const isProtectedRoute = (pathname: string) => {
  const pathWithoutLocale = withoutLocale(pathname);

  return PROTECTED_PATH_PREFIXES.some(
    (prefix) =>
      pathWithoutLocale === prefix ||
      pathWithoutLocale.startsWith(`${prefix}/`),
  );
};
