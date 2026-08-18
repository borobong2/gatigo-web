import { describe, expect, it } from 'vitest';
import { getStation, prefilterMeetingStations, stationIds } from './stations';

describe('station catalog', () => {
  it('looks up stations by their stable IDs', () => {
    expect(getStation('gangnam')).toMatchObject({ name: '강남역' });
    expect(getStation('jamsil')).toMatchObject({ name: '잠실역' });
    expect(getStation('yeouido')).toMatchObject({ name: '여의도역' });
    expect(getStation('강남역')).toBeUndefined();
  });

  it('returns three non-origin candidates from the station graph', () => {
    const candidates = prefilterMeetingStations([
      'gangnam',
      'hongik-university',
    ]);

    expect(candidates).toHaveLength(3);
    expect(candidates.map((station) => station.id)).not.toContain('gangnam');
    expect(candidates.map((station) => station.id)).not.toContain(
      'hongik-university',
    );
  });

  it('rejects unknown origin IDs', () => {
    expect(() =>
      prefilterMeetingStations(['gangnam', 'unknown-station']),
    ).toThrow('Unknown station: unknown-station');
  });

  it('prefilters candidates for origins outside the original five stations', () => {
    const candidates = prefilterMeetingStations(['jamsil', 'yeouido']);

    expect(candidates).toHaveLength(3);
    expect(candidates.map((station) => station.id)).not.toContain('jamsil');
    expect(candidates.map((station) => station.id)).not.toContain('yeouido');
  });

  it('offers more than the original five station choices', () => {
    expect(stationIds.length).toBeGreaterThanOrEqual(10);
  });
});
