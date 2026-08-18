import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { createSiteMetadata } from '@/lib/metadata';
import Providers from '@/providers';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const generateStaticParams = () =>
  routing.locales.map((locale) => ({ locale }));

export const generateMetadata = async ({
  params,
}: LocaleLayoutProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    ...createSiteMetadata({
      description: t('description'),
      locale: locale as (typeof routing.locales)[number],
      title: t('title'),
    }),
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`,
    },
  };
};

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
