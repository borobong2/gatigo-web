'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  resolveStationId,
  toOriginIds,
  type StationOption,
} from '../_constants/stations';

type Candidate = {
  station: { id: string; name: string };
  durations: [number, number];
  landingUrl: string;
};

type MeetingFormProps = { stationOptions: readonly StationOption[] };

const MeetingFormFields = ({ stationOptions }: MeetingFormProps) => {
  const t = useTranslations('Meeting');
  const [first, setFirst] = useState(stationOptions[0]?.name ?? '');
  const [second, setSecond] = useState(stationOptions[1]?.name ?? '');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  const updateSelection = (
    value: string,
    setValue: (value: string) => void,
  ) => {
    requestRef.current?.abort();
    requestRef.current = null;
    setValue(value);
    setCandidates([]);
    setError('');
    setIsLoading(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    requestRef.current?.abort();
    requestRef.current = null;
    setCandidates([]);
    setError('');

    let originIds: [string, string];
    try {
      originIds = toOriginIds({
        first: resolveStationId(first, stationOptions) ?? '',
        second: resolveStationId(second, stationOptions) ?? '',
      });
    } catch {
      setIsLoading(false);
      setError(t('errors.invalidOrigins'));
      return;
    }

    const controller = new AbortController();
    requestRef.current = controller;
    setIsLoading(true);
    try {
      const response = await fetch('/api/meeting-suggestions', {
        body: JSON.stringify({ originIds }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        signal: controller.signal,
      });

      if (!response.ok) {
        const key =
          response.status === 400
            ? 'errors.invalidOrigins'
            : response.status === 429
              ? 'errors.rateLimited'
              : response.status === 502
                ? 'errors.upstream'
                : 'errors.generic';
        throw new Error(t(key));
      }
      const data = (await response.json()) as { candidates: Candidate[] };
      if (requestRef.current === controller) setCandidates(data.candidates);
    } catch (requestError) {
      if (!controller.signal.aborted && requestRef.current === controller) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : t('errors.generic'),
        );
      }
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="mt-12 rounded-xl border border-border bg-card p-6 sm:p-8">
      <div>
        <p className="text-sm font-medium text-primary">GatiGo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
      </div>
      <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label
          className="grid gap-2 text-sm font-medium"
          htmlFor="first-station"
        >
          {t('firstOrigin')}
          <Input
            autoComplete="off"
            id="first-station"
            list="station-options"
            onChange={(event) => updateSelection(event.target.value, setFirst)}
            placeholder={t('searchPlaceholder')}
            required
            type="search"
            value={first}
          />
        </label>
        <label
          className="grid gap-2 text-sm font-medium"
          htmlFor="second-station"
        >
          {t('secondOrigin')}
          <Input
            autoComplete="off"
            id="second-station"
            list="station-options"
            onChange={(event) => updateSelection(event.target.value, setSecond)}
            placeholder={t('searchPlaceholder')}
            required
            type="search"
            value={second}
          />
        </label>
        <datalist id="station-options">
          {stationOptions.map((station) => (
            <option key={station.id} value={station.name} />
          ))}
        </datalist>
        <Button className="sm:col-span-2" disabled={isLoading} type="submit">
          {isLoading ? t('loading') : t('submit')}
        </Button>
      </form>
      {error && (
        <p aria-live="polite" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
      {candidates.length > 0 && (
        <section aria-labelledby="suggestions-title" className="mt-8">
          <h2 className="text-lg font-semibold" id="suggestions-title">
            {t('suggestionsTitle')}
          </h2>
          <div className="mt-3 grid gap-3">
            {candidates.map((candidate) => (
              <article
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"
                key={candidate.station.id}
              >
                <div>
                  <h3 className="font-medium">
                    {stationOptions.find(
                      (station) => station.id === candidate.station.id,
                    )?.name ?? candidate.station.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('duration', {
                      minutes: Math.round(candidate.durations[0] / 60),
                      person: 1,
                    })}{' '}
                    ·{' '}
                    {t('duration', {
                      minutes: Math.round(candidate.durations[1] / 60),
                      person: 2,
                    })}
                  </p>
                </div>
                <a
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  href={candidate.landingUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('mapLink')}
                </a>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
};

const MeetingForm = (props: MeetingFormProps) => {
  const locale = useLocale();
  return <MeetingFormFields key={locale} {...props} />;
};

export default MeetingForm;
