import { describe, expect, it } from 'vitest';
import {
  getStaticStationNodes,
  getStaticStationOptions,
  rankStaticCandidates,
  recommendStaticMeetingStations,
} from './static-recommendations';

describe('getStaticStationNodes', () => {
  it('resolves a displayed station name to every line node', () => {
    expect(getStaticStationNodes('강남역')).toHaveLength(2);
    expect(getStaticStationNodes('홍대입구')).toHaveLength(3);
    expect(getStaticStationNodes('서울역')).not.toHaveLength(0);
    expect(getStaticStationNodes('샛강역')).not.toHaveLength(0);
  });

  it('offers homonymous non-transfer stations as separate origins', () => {
    expect(
      getStaticStationOptions('ko')
        .filter(({ name }) => name === '신촌')
        .map(({ id }) => id),
    ).toHaveLength(2);
    expect(
      getStaticStationOptions('ko')
        .filter(({ name }) => name === '양평')
        .map(({ id }) => id),
    ).toHaveLength(2);
  });

  it('offers English station labels for the English route', () => {
    const options = getStaticStationOptions('en');
    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '강남', displayName: 'Gangnam Station' }),
      ]),
    );
    expect(
      options
        .filter(({ name }) => name === '신촌')
        .map(({ displayName }) => displayName),
    ).toEqual([
      'Sinchon Station (Gyeongui-Jungang Line)',
      'Sinchon Station (Line 2)',
    ]);
  });
});

describe('recommendStaticMeetingStations', () => {
  it('breaks equal worst-time ties by total time', () => {
    expect(
      rankStaticCandidates([
        { name: 'A', durations: [8, 8], worstMinutes: 8, totalMinutes: 16 },
        { name: 'B', durations: [8, 7], worstMinutes: 8, totalMinutes: 15 },
      ]).map(({ name }) => name),
    ).toEqual(['B', 'A']);
  });

  it('returns three non-origin candidates with each participant duration', () => {
    const candidates = recommendStaticMeetingStations(['강남역', '홍대입구역']);

    expect(candidates).toHaveLength(3);
    expect(candidates.map((candidate) => candidate.name)).not.toContain('강남');
    expect(candidates.map((candidate) => candidate.name)).not.toContain(
      '홍대입구',
    );
    expect(
      candidates.every((candidate) => candidate.durations.length === 2),
    ).toBe(true);
  });

  it('supports three origins with one duration per person', () => {
    const candidates = recommendStaticMeetingStations([
      '강남역',
      '홍대입구역',
      '잠실역',
    ]);

    expect(candidates).toHaveLength(3);
    expect(
      candidates.every((candidate) => candidate.durations.length === 3),
    ).toBe(true);
  });

  it('rejects aliases for the same physical origin', () => {
    expect(() => recommendStaticMeetingStations(['강남', '강남역'])).toThrow(
      'Duplicate origin station',
    );
  });

  it('returns localized candidate names', () => {
    const candidates = recommendStaticMeetingStations(
      ['강남', '홍대입구'],
      'en',
    );

    expect(
      candidates.every(({ displayName }) => / Station/.test(displayName ?? '')),
    ).toBe(true);
  });
});
