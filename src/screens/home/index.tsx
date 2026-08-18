import { getTranslations } from 'next-intl/server';
import LocaleSwitcher from '@/components/locale-switcher';
import { stationIds } from '@/lib/subway/stations';
import MeetingForm from './_components/meeting-form';

const HomeScreen = async () => {
  const t = await getTranslations('Meeting');
  const names = t.raw('stations') as Record<string, string>;
  const stationOptions = stationIds.map((id) => ({ id, name: names[id] }));

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12 sm:px-10">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">GatiGo</span>
        <LocaleSwitcher />
      </header>
      <MeetingForm stationOptions={stationOptions} />
    </main>
  );
};

export default HomeScreen;
