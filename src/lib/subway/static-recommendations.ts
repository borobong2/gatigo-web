import { shortestTravelTimesFrom } from './network';
import { STATIC_NETWORK, STATIC_STATIONS } from './static-network';

const normalizedName = (name: string) => name.trim().replace(/역$/, '');

export const staticStationNames = [
  ...new Set(STATIC_STATIONS.map((station) => station.name)),
].sort((a, b) => a.localeCompare(b, 'ko'));

export const getStaticStationNodes = (name: string) => {
  const normalized = normalizedName(name);
  return STATIC_STATIONS.filter((station) => station.name === normalized).map(
    (station) => station.id,
  );
};

export const recommendStaticMeetingStations = (originNames: readonly string[]) => {
  const origins = originNames.map((name) => ({
    name: normalizedName(name),
    nodes: getStaticStationNodes(name),
  }));
  if (origins.length < 2 || origins.some((origin) => !origin.nodes.length)) {
    throw new Error('Unknown origin station');
  }

  const distances = origins.map((origin) =>
    shortestTravelTimesFrom(STATIC_NETWORK, origin.nodes),
  );
  const names = staticStationNames;

  return names
    .filter((name) => !origins.some((origin) => origin.name === name))
    .map((name) => {
      const nodes = getStaticStationNodes(name);
      const durations = distances.map((distance) =>
        Math.min(...nodes.map((node) => distance.get(node) ?? Infinity)),
      );
      return {
        name,
        durations,
        worstMinutes: Math.max(...durations),
        totalMinutes: durations.reduce((total, duration) => total + duration, 0),
      };
    })
    .filter((candidate) => Number.isFinite(candidate.worstMinutes))
    .sort(
      (a, b) =>
        a.worstMinutes - b.worstMinutes ||
        a.totalMinutes - b.totalMinutes ||
        a.name.localeCompare(b.name),
    )
    .slice(0, 3);
};
