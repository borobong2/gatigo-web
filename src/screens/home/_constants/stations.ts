import { MAX_ORIGINS, MIN_ORIGINS } from '@/lib/subway/constants';

export type StationOption = { id: string; name: string };

export const resolveStationId = (
  name: string,
  options: readonly StationOption[],
) => options.find((station) => station.name === name)?.id;

export const toOriginIds = (
  selections: readonly string[],
  options: readonly StationOption[],
) => {
  const ids = selections.map(
    (selection) => resolveStationId(selection, options) ?? '',
  );
  if (
    ids.length < MIN_ORIGINS ||
    ids.length > MAX_ORIGINS ||
    ids.some((id) => !id) ||
    new Set(ids).size !== ids.length
  ) {
    throw new Error('Invalid origins');
  }
  return ids;
};

export const stationDisplayName = (name: string) =>
  name.endsWith('역') ? name : `${name}역`;

export const addOrigin = (origins: readonly string[]) =>
  origins.length < MAX_ORIGINS ? [...origins, ''] : [...origins];

export const removeOrigin = (origins: readonly string[], index: number) =>
  origins.length > MIN_ORIGINS
    ? origins.filter((_, currentIndex) => currentIndex !== index)
    : [...origins];

export const candidateDisplayData = <
  T extends {
    displayName: string;
    durations: readonly number[];
    totalMinutes: number;
    worstMinutes: number;
  },
>(
  candidate: T,
) => ({
  displayName: candidate.displayName,
  durations: candidate.durations.map((minutes, index) => ({
    minutes,
    person: index + 1,
  })),
  totalMinutes: candidate.totalMinutes,
  worstMinutes: candidate.worstMinutes,
});
