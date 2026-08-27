import { getLocale } from 'next-intl/server';
import LocaleSwitcher from '@/components/locale-switcher';
import {
  getStaticStationOptions,
  type StaticLocale,
} from '@/lib/subway/static-recommendations';
import MeetingForm from './_components/meeting-form';

const HomeScreen = async () => {
  const locale = (await getLocale()) as StaticLocale;
  const stationOptions = getStaticStationOptions(locale).map(
    ({ displayName, id }) => ({ id, name: displayName }),
  );

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
