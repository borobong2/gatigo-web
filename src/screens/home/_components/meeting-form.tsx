'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MAX_ORIGINS } from '@/lib/subway/constants';
import {
  addOrigin,
  candidateDisplayData,
  removeOrigin,
  toOriginIds,
  type StationOption,
} from '../_constants/stations';

type Candidate = {
  displayName: string;
  id: string;
  name: string;
  durations: number[];
  worstMinutes: number;
  totalMinutes: number;
};

type MeetingFormProps = { stationOptions: readonly StationOption[] };

const MeetingFormFields = ({ stationOptions }: MeetingFormProps) => {
  const locale = useLocale();
  const t = useTranslations('Meeting');
  const [origins, setOrigins] = useState([
    stationOptions[0]?.name ?? '',
    stationOptions[1]?.name ?? '',
  ]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  const updateOrigins = (next: (current: string[]) => string[]) => {
    requestRef.current?.abort();
    requestRef.current = null;
    setOrigins(next);
    setCandidates([]);
    setError('');
    setIsLoading(false);
  };

  const updateSelection = (value: string, index: number) =>
    updateOrigins((current) =>
      current.map((origin, currentIndex) =>
        currentIndex === index ? value : origin,
      ),
    );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    requestRef.current?.abort();
    requestRef.current = null;
    setCandidates([]);
    setError('');

    let originIds: string[];
    try {
      originIds = toOriginIds(origins, stationOptions);
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
        body: JSON.stringify({ locale, originIds }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        signal: controller.signal,
      });

      if (!response.ok) {
        const key =
          response.status === 400 ? 'errors.invalidOrigins' : 'errors.generic';
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
        {origins.map((origin, index) => (
          <div className="grid gap-2" key={`origin-${index}`}>
            <label
              className="grid gap-2 text-sm font-medium"
              htmlFor={`station-${index}`}
            >
              {t('originLabel', { person: index + 1 })}
              <Input
                autoComplete="off"
                id={`station-${index}`}
                list="station-options"
                onChange={(event) => updateSelection(event.target.value, index)}
                placeholder={t('searchPlaceholder')}
                required
                type="search"
                value={origin}
              />
            </label>
            {origins.length > 2 && (
              <Button
                aria-label={t('removePerson', { person: index + 1 })}
                onClick={() =>
                  updateOrigins((current) => removeOrigin(current, index))
                }
                type="button"
                variant="outline"
              >
                {t('remove')}
              </Button>
            )}
          </div>
        ))}
        <Button
          className="sm:col-span-2"
          disabled={origins.length >= MAX_ORIGINS}
          onClick={() => updateOrigins(addOrigin)}
          type="button"
        >
          {t('addPerson')}
        </Button>
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
            {candidates.map((candidate) => {
              const display = candidateDisplayData(candidate);
              return (
                <article
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"
                  key={candidate.id}
                >
                  <div>
                    <h3 className="font-medium">{display.displayName}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {display.durations
                        .map(({ minutes, person }) =>
                          t('duration', { minutes, person }),
                        )
                        .join(' · ')}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {t('summary', {
                        total: display.totalMinutes,
                        worst: display.worstMinutes,
                      })}
                    </p>
                    <p>{t('reason')}</p>
                  </div>
                </article>
              );
            })}
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
