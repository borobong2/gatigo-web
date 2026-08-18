export type Station = {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
};

const STATIONS: readonly Station[] = [
  { id: 'gangnam', name: '강남역', longitude: 127.02758, latitude: 37.49794 },
  {
    id: 'hongik-university',
    name: '홍대입구역',
    longitude: 126.92365,
    latitude: 37.55679,
  },
  {
    id: 'euljiro-3ga',
    name: '을지로3가역',
    longitude: 126.99195,
    latitude: 37.5663,
  },
  { id: 'city-hall', name: '시청역', longitude: 126.97712, latitude: 37.56583 },
  { id: 'seoul', name: '서울역', longitude: 126.9726, latitude: 37.55468 },
];

const STATION_GRAPH: Readonly<Record<string, readonly string[]>> = {
  gangnam: ['euljiro-3ga'],
  'hongik-university': ['city-hall'],
  'euljiro-3ga': ['gangnam', 'seoul'],
  'city-hall': ['hongik-university', 'seoul'],
  seoul: ['euljiro-3ga', 'city-hall'],
};

export const getStation = (id: string) =>
  STATIONS.find((station) => station.id === id);

const distancesFrom = (originId: string) => {
  const distances = new Map([[originId, 0]]);
  const queue = [originId];

  for (const stationId of queue) {
    const distance = distances.get(stationId)!;
    for (const nextId of STATION_GRAPH[stationId]) {
      if (!distances.has(nextId)) {
        distances.set(nextId, distance + 1);
        queue.push(nextId);
      }
    }
  }

  return distances;
};

export const prefilterMeetingStations = (
  originIds: readonly [string, string],
) => {
  for (const id of originIds) {
    if (!getStation(id)) throw new Error(`Unknown station: ${id}`);
  }

  const [firstDistances, secondDistances] = originIds.map(distancesFrom);

  return STATIONS.filter(
    (station) => !originIds.includes(station.id),
  )
    .sort(
      (a, b) =>
        Math.max(firstDistances.get(a.id)!, secondDistances.get(a.id)!) -
          Math.max(firstDistances.get(b.id)!, secondDistances.get(b.id)!) ||
        firstDistances.get(a.id)! +
          secondDistances.get(a.id)! -
          (firstDistances.get(b.id)! + secondDistances.get(b.id)!) ||
        a.id.localeCompare(b.id),
    )
    .slice(0, 3);
};
