'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resolveStationId, type StationOption } from '../_constants/stations';

type Candidate = {
  name: string;
  durations: number[];
  worstMinutes: number;
  totalMinutes: number;
};

type MeetingFormProps = { stationOptions: readonly StationOption[] };

const MeetingFormFields = ({ stationOptions }: MeetingFormProps) => {
  const t = useTranslations('Meeting');
  const [origins, setOrigins] = useState([
    stationOptions[0]?.name ?? '',
    stationOptions[1]?.name ?? '',
  ]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  const updateSelection = (value: string, index: number) => {
    requestRef.current?.abort();
    requestRef.current = null;
    setOrigins((current) =>
      current.map((origin, i) => (i === index ? value : origin)),
    );
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

    const originNames = origins.map(
      (origin) => resolveStationId(origin, stationOptions) ?? '',
    );
    if (
      originNames.length < 2 ||
      originNames.some((name) => !name) ||
      new Set(originNames).size !== originNames.length
    ) {
      setIsLoading(false);
      setError(t('errors.invalidOrigins'));
      return;
    }

    const controller = new AbortController();
    requestRef.current = controller;
    setIsLoading(true);
    try {
      const response = await fetch('/api/meeting-suggestions', {
        body: JSON.stringify({ originNames }),
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
          <label
            className="grid gap-2 text-sm font-medium"
            htmlFor={`station-${index}`}
            key={`origin-${index}`}
          >
            {index === 0
              ? t('firstOrigin')
              : index === 1
                ? t('secondOrigin')
                : `${index + 1}번째 사람 출발역`}
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
        ))}
        <Button
          className="sm:col-span-2"
          onClick={() => setOrigins((current) => [...current, ''])}
          type="button"
        >
          사람 추가
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
            {candidates.map((candidate) => (
              <article
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"
                key={candidate.name}
              >
                <div>
                  <h3 className="font-medium">{candidate.name}역</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {candidate.durations
                      .map((minutes, index) =>
                        t('duration', { minutes, person: index + 1 }),
                      )
                      .join(' · ')}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  최대 {candidate.worstMinutes}분 · 합계{' '}
                  {candidate.totalMinutes}분
                </p>
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
