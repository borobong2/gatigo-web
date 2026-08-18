import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

const LocaleNotFoundPage = async () => {
  const t = await getTranslations('NotFound');

  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <section>
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold">{t('title')}</h1>
        <Button asChild className="mt-6">
          <Link href="/">{t('home')}</Link>
        </Button>
      </section>
    </main>
  );
};

export default LocaleNotFoundPage;
