'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

type ErrorPageProps = { reset: () => void };

const LocaleErrorPage = ({ reset }: ErrorPageProps) => {
  const t = useTranslations('Error');

  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <section>
        <p className="text-sm font-medium text-primary">{t('eyebrow')}</p>
        <h1 className="mt-3 text-3xl font-semibold">{t('title')}</h1>
        <Button className="mt-6" onClick={reset}>
          {t('retry')}
        </Button>
      </section>
    </main>
  );
};

export default LocaleErrorPage;
