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

export type StaticLocale = 'en' | 'ko';

const englishLineNames: Readonly<Record<string, string>> = {
  경의중앙선: 'Gyeongui-Jungang Line',
  '서울 도시철도 2호선': 'Line 2',
  '서울 도시철도 5호선': 'Line 5',
};

const stationLabel = (name: string, locale: StaticLocale) =>
  locale === 'ko'
    ? name.endsWith('역')
      ? name
      : `${name}역`
    : / station$/i.test(name)
      ? name
      : `${name} Station`;

export const getStaticStationOptions = (locale: StaticLocale) =>
  [...nodesByPlace]
    .map(([id, nodes]) => {
      const { englishName, name } = nodes[0];
      const suffix =
        placesByName.get(name) === 1
          ? ''
          : ` (${nodes
              .map(({ line }) =>
                locale === 'en' ? (englishLineNames[line] ?? line) : line,
              )
              .join(', ')})`;
      const localizedName = locale === 'en' ? englishName : name;
      return {
        displayName: `${stationLabel(localizedName, locale)}${suffix}`,
        id,
        name,
      };
    })
    .sort((a, b) =>
      a.displayName.localeCompare(b.displayName, locale === 'ko' ? 'ko' : 'en'),
    );

const placeByAlias = new Map<string, string>();
const ambiguousAliases = new Set<string>();
for (const [id, nodes] of nodesByPlace) {
  const { englishName, name } = nodes[0];
  for (const alias of [
    name,
    stationLabel(name, 'ko'),
    englishName,
    stationLabel(englishName, 'en'),
  ]) {
    const existing = placeByAlias.get(alias);
    if (existing && existing !== id) ambiguousAliases.add(alias);
    else placeByAlias.set(alias, id);
  }
}
for (const alias of ambiguousAliases) placeByAlias.delete(alias);

export const resolveStaticStationId = (value: string) => {
  const normalized = value.trim();
  return nodesByPlace.has(normalized)
    ? normalized
    : placeByAlias.get(normalized);
};

export const getStaticStationNodes = (value: string) => {
  const id = resolveStaticStationId(value);
  return (id ? (nodesByPlace.get(id) ?? []) : []).map(({ id }) => id);
};

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
  locale: StaticLocale = 'ko',
) => {
  const origins = originIds.map((value) => {
    const id = resolveStaticStationId(value);
    return { id, nodes: id ? getStaticStationNodes(id) : [] };
  });
  if (origins.length < 2 || origins.some((origin) => !origin.nodes.length)) {
    throw new Error('Unknown origin station');
  }
  if (new Set(origins.map(({ id }) => id)).size !== origins.length) {
    throw new Error('Duplicate origin station');
  }

  const distances = origins.map((origin) =>
    shortestTravelTimesFrom(STATIC_NETWORK, origin.nodes),
  );

  return rankStaticCandidates(
    getStaticStationOptions(locale)
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
