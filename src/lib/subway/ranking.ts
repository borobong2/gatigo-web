import type { Station } from './stations';

export type CandidateWithDurations = {
  station: Station;
  maxSeconds: number;
  totalSeconds: number;
};

export const rankActualCandidates = <T extends CandidateWithDurations>(
  candidates: readonly T[],
) =>
  [...candidates].sort(
    (a, b) =>
      a.maxSeconds - b.maxSeconds ||
      a.totalSeconds - b.totalSeconds ||
      a.station.id.localeCompare(b.station.id),
  );
