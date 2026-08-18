'use client';

import { Button } from '@/components/ui/button';

type ErrorPageProps = { reset: () => void };

const ErrorPage = ({ reset }: ErrorPageProps) => {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <section>
        <p className="text-sm font-medium text-primary">SOMETHING WENT WRONG</p>
        <h1 className="mt-3 text-3xl font-semibold">Try that again.</h1>
        <Button className="mt-6" onClick={reset}>
          Retry
        </Button>
      </section>
    </main>
  );
};

export default ErrorPage;
