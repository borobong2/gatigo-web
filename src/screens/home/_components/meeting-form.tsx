'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { stationOptions, toOriginIds } from '../_constants/stations';

type Candidate = {
  station: { id: string; name: string };
  durations: [number, number];
  landingUrl: string;
};

const errorMessage = (status: number) =>
  status === 400
    ? '출발역을 확인해 주세요.'
    : status === 502
      ? '대중교통 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      : '추천을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';

const MeetingForm = () => {
  const [first, setFirst] = useState('gangnam');
  const [second, setSecond] = useState('hongik-university');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    let originIds: [string, string];
    try {
      originIds = toOriginIds({ first, second });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '추천을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/meeting-suggestions', {
        body: JSON.stringify({ originIds }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!response.ok) throw new Error(errorMessage(response.status));
      const data = (await response.json()) as { candidates: Candidate[] };
      setCandidates(data.candidates);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '추천을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-12 rounded-xl border border-border bg-card p-6 sm:p-8">
      <div>
        <p className="text-sm font-medium text-primary">GatiGo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          어디서 만날까요?
        </h1>
        <p className="mt-2 text-muted-foreground">
          두 사람의 출발역을 고르면 중간 만남역을 추천해 드릴게요.
        </p>
      </div>
      <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium" htmlFor="first-station">
          첫 번째 사람 출발역
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            id="first-station"
            onChange={(event) => setFirst(event.target.value)}
            value={first}
          >
            {stationOptions.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium" htmlFor="second-station">
          두 번째 사람 출발역
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            id="second-station"
            onChange={(event) => setSecond(event.target.value)}
            value={second}
          >
            {stationOptions.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </label>
        <Button className="sm:col-span-2" disabled={isLoading} type="submit">
          {isLoading ? '추천 찾는 중…' : '만남역 추천받기'}
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
            추천 만남역
          </h2>
          <div className="mt-3 grid gap-3">
            {candidates.map((candidate) => (
              <article
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"
                key={candidate.station.id}
              >
                <div>
                  <h3 className="font-medium">{candidate.station.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    첫 번째 사람 {Math.round(candidate.durations[0] / 60)}분 · 두 번째 사람{' '}
                    {Math.round(candidate.durations[1] / 60)}분
                  </p>
                </div>
                <a
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  href={candidate.landingUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  카카오맵에서 길찾기
                </a>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
};

export default MeetingForm;
