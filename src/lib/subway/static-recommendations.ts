import { shortestTravelTimesFrom } from './network';
import { STATIC_NETWORK, STATIC_STATIONS } from './static-network';

const nodesByPlace = new Map<string, (typeof STATIC_STATIONS)[number][]>();
for (const station of STATIC_STATIONS) {
  const nodes = nodesByPlace.get(station.placeId) ?? [];
  nodes.push(station);
  nodesByPlace.set(station.placeId, nodes);
}
const placesByName = new Map<string, number>();
for (const nodes of nodesByPlace.values()) {
  placesByName.set(nodes[0].name, (placesByName.get(nodes[0].name) ?? 0) + 1);
}

export const staticStationOptions = [...nodesByPlace].map(([id, nodes]) => {
  const { name } = nodes[0];
  const suffix =
    placesByName.get(name) === 1
      ? ''
      : ` (${nodes.map(({ line }) => line).join(', ')})`;
  return { displayName: `${name}역${suffix}`, id, name };
});
staticStationOptions.sort((a, b) =>
  a.displayName.localeCompare(b.displayName, 'ko'),
);

export const getStaticStationNodes = (placeId: string) =>
  (
    nodesByPlace.get(placeId.trim()) ??
    nodesByPlace.get(placeId.trim().replace(/역$/, '')) ??
    []
  ).map(({ id }) => id);

type StaticCandidate = {
  displayName?: string;
  id?: string;
  name: string;
  durations: number[];
  worstMinutes: number;
  totalMinutes: number;
};

export const rankStaticCandidates = (candidates: readonly StaticCandidate[]) =>
  [...candidates].sort(
    (a, b) =>
      a.worstMinutes - b.worstMinutes ||
      a.totalMinutes - b.totalMinutes ||
      a.name.localeCompare(b.name, 'ko'),
  );

export const recommendStaticMeetingStations = (
  originIds: readonly string[],
) => {
  const origins = originIds.map((id) => ({
    id,
    nodes: getStaticStationNodes(id),
  }));
  if (origins.length < 2 || origins.some((origin) => !origin.nodes.length)) {
    throw new Error('Unknown origin station');
  }

  const distances = origins.map((origin) =>
    shortestTravelTimesFrom(STATIC_NETWORK, origin.nodes),
  );

  return rankStaticCandidates(
    staticStationOptions
      .filter(({ id }) => !origins.some((origin) => origin.id === id))
      .map(({ displayName, id, name }) => {
        const nodes = getStaticStationNodes(id);
        const durations = distances.map((distance) =>
          Math.min(...nodes.map((node) => distance.get(node) ?? Infinity)),
        );
        return {
          displayName,
          id,
          name,
          durations,
          worstMinutes: Math.max(...durations),
          totalMinutes: durations.reduce(
            (total, duration) => total + duration,
            0,
          ),
        };
      })
      .filter((candidate) => Number.isFinite(candidate.worstMinutes)),
  ).slice(0, 3);
};
