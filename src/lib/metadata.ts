import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';

type CreateSiteMetadataOptions = {
  description: string;
  locale: (typeof routing.locales)[number];
  title: string;
};

export const createSiteMetadata = ({
  description,
  locale,
  title,
}: CreateSiteMetadataOptions): Metadata => {
  const path = locale === routing.defaultLocale ? '/' : `/${locale}`;
  const images = siteConfig.ogImage ? [siteConfig.ogImage] : undefined;

  return {
    alternates: { canonical: path },
    description,
    openGraph: {
      description,
      images,
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      siteName: siteConfig.name,
      title,
      type: 'website',
      url: path,
    },
    title,
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      description,
      images,
      title,
    },
  };
};
