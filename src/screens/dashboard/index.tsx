import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

type DashboardScreenProps = {
  email?: string;
};

const DashboardScreen = async ({ email }: DashboardScreenProps) => {
  const t = await getTranslations('Dashboard');

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12 sm:px-10">
      <header className="flex items-center justify-between">
        <Link className="text-sm font-semibold" href="/">
          JustRun Template
        </Link>
        <Button asChild variant="outline">
          <Link href="/">{t('backHome')}</Link>
        </Button>
      </header>
      <section className="mt-20 rounded-2xl border border-border bg-card p-8 sm:p-12">
        <p className="text-sm font-medium text-primary">{t('eyebrow')}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {email ? t('signedIn', { email }) : t('subtitle')}
        </p>
      </section>
    </main>
  );
};

export default DashboardScreen;
