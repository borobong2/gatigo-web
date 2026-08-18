'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const LocaleSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('LocaleSwitcher');

  return (
    <nav aria-label="Language" className="flex gap-2 text-xs">
      {['ko', 'en'].map((targetLocale) => (
        <Link
          className={
            targetLocale === locale
              ? 'text-foreground'
              : 'text-muted-foreground'
          }
          href={pathname}
          key={targetLocale}
          locale={targetLocale}
        >
          {t(targetLocale)}
        </Link>
      ))}
    </nav>
  );
};

export default LocaleSwitcher;
