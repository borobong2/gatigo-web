'use client';

import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { getSafeNextPath } from '@/lib/auth/redirect';

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('Login');
  const dashboardPath = locale === 'ko' ? '/dashboard' : `/${locale}/dashboard`;
  const nextPath = getSafeNextPath(searchParams.get('next'), dashboardPath);

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const { error } = await createClient().auth.signInWithPassword({
        email: String(formData.get('email')),
        password: String(formData.get('password')),
      });
      if (error) throw error;
      window.location.assign(nextPath);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to sign in.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const { error } = await createClient().auth.signInWithOAuth({
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to continue with Google.',
      );
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-12">
      <section className="w-full rounded-xl border border-border bg-card p-6 shadow-2xl shadow-black/20">
        <p className="text-sm font-medium text-primary">JUST RUN DEV</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('subtitle')}</p>
        <form className="mt-7 space-y-4" onSubmit={handleEmailLogin}>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              autoComplete="email"
              id="email"
              name="email"
              required
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              autoComplete="current-password"
              id="password"
              name="password"
              required
              type="password"
            />
          </div>
          <Button className="w-full" disabled={isLoading} type="submit">
            {t('emailButton')}
          </Button>
        </form>
        <div className="my-5 h-px bg-border" />
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={handleGoogleLogin}
          variant="outline"
        >
          {t('googleButton')}
        </Button>
      </section>
    </main>
  );
};

export default LoginScreen;
