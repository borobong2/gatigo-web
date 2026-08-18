import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <section>
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold">
          This page does not exist.
        </h1>
        <Button asChild className="mt-6">
          <Link href="/">Go home</Link>
        </Button>
      </section>
    </main>
  );
};

export default NotFoundPage;
