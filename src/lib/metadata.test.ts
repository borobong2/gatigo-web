import { describe, expect, it } from 'vitest';
import { createSiteMetadata } from '@/lib/metadata';

describe('createSiteMetadata', () => {
  it('uses localized copy for canonical and social metadata', () => {
    const metadata = createSiteMetadata({
      description: 'Korean description',
      locale: 'ko',
      title: 'Radar',
    });

    expect(metadata.alternates?.canonical).toBe('/');
    expect(metadata.openGraph?.locale).toBe('ko_KR');
    expect(metadata.twitter).toMatchObject({ card: 'summary' });
  });
});
