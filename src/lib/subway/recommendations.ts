import { shortestTravelTimes, type StaticNetwork } from './network';

export type MeetingCandidate = {
  stationId: string;
  durations: number[];
  worstMinutes: number;
  totalMinutes: number;
};

export const recommendMeetingStations = (
  network: StaticNetwork,
  originIds: readonly string[],
  candidateIds: readonly string[],
) => {
  const distances = originIds.map((origin) => shortestTravelTimes(network, origin));

  return candidateIds
    .map((stationId) => {
      const durations = distances.map((distance) => distance.get(stationId));
      if (durations.some((duration) => duration === undefined)) return undefined;
      const minutes = durations as number[];
      return {
        stationId,
        durations: minutes,
        worstMinutes: Math.max(...minutes),
        totalMinutes: minutes.reduce((total, duration) => total + duration, 0),
      };
    })
    .filter((candidate): candidate is MeetingCandidate => candidate !== undefined)
    .sort(
      (a, b) =>
        a.worstMinutes - b.worstMinutes ||
        a.totalMinutes - b.totalMinutes ||
        a.stationId.localeCompare(b.stationId),
    );
};
