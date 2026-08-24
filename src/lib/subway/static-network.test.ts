import { describe, expect, it } from 'vitest';
import { STATIC_NETWORK, STATIC_STATIONS } from './static-network';

describe('static metropolitan network data', () => {
  it('includes the supplied capital-area lines and only positive edge times', () => {
    expect(STATIC_STATIONS.some((station) => station.name === '강남')).toBe(true);
    expect(STATIC_STATIONS.some((station) => station.name === '홍대입구')).toBe(
      true,
    );
    expect(Object.values(STATIC_NETWORK).flat().every((edge) => edge.minutes > 0)).toBe(
      true,
    );
  });
});
