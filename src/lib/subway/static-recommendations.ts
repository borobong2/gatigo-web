import { STATIC_STATIONS } from './static-network';

const normalizedName = (name: string) => name.trim().replace(/역$/, '');

export const getStaticStationNodes = (name: string) => {
  const normalized = normalizedName(name);
  return STATIC_STATIONS.filter((station) => station.name === normalized).map(
    (station) => station.id,
  );
};
