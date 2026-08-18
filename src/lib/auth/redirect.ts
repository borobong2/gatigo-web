const DEFAULT_NEXT_PATH = '/dashboard';

export const getSafeNextPath = (
  nextPath: string | null,
  fallbackPath = DEFAULT_NEXT_PATH,
) => {
  const hasEncodedPathSeparator = /%2f|%5c/i.test(nextPath ?? '');

  if (
    !nextPath?.startsWith('/') ||
    nextPath.startsWith('//') ||
    nextPath.includes('\\') ||
    hasEncodedPathSeparator
  ) {
    return fallbackPath;
  }

  return nextPath;
};
