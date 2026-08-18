import { Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import LocaleSwitcher from '@/components/locale-switcher';

const HomeScreen = async () => {
  const t = await getTranslations('Home');
  const modules = ['feature1', 'feature2', 'feature3', 'feature4'] as const;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12 sm:px-10">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">GatiGo</span>
        <LocaleSwitcher />
      </header>
      <section className="flex flex-1 flex-col justify-center py-20">
        <p className="mb-5 text-sm font-medium text-primary">{t('eyebrow')}</p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-7xl">
          {t('title')}
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t('subtitle')}
        </p>
      </section>
      <section className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
        {modules.map((module) => (
          <div
            className="flex items-center gap-3 bg-card p-5 text-sm"
            key={module}
          >
            <Check className="size-4 text-primary" />
            {t(module)}
          </div>
        ))}
      </section>
    </main>
  );
};

export default HomeScreen;
