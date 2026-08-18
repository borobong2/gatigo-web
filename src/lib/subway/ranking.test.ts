import { describe, expect, it } from 'vitest';
import { rankActualCandidates } from './ranking';

const gangnam = {
  id: 'gangnam',
  name: '강남역',
  longitude: 127.02758,
  latitude: 37.49794,
};

const hongikUniversity = {
  id: 'hongik-university',
  name: '홍대입구역',
  longitude: 126.92365,
  latitude: 37.55679,
};

describe('rankActualCandidates', () => {
  it('prioritizes the shortest maximum actual duration', () => {
    expect(
      rankActualCandidates([
        { station: gangnam, maxSeconds: 1200, totalSeconds: 2400 },
        { station: hongikUniversity, maxSeconds: 1100, totalSeconds: 2500 },
      ])[0].maxSeconds,
    ).toBe(1100);
  });

  it('breaks duration ties by total duration, then stable station ID', () => {
    expect(
      rankActualCandidates([
        { station: hongikUniversity, maxSeconds: 1200, totalSeconds: 2500 },
        { station: gangnam, maxSeconds: 1200, totalSeconds: 2400 },
        {
          station: { ...gangnam, id: 'seoul' },
          maxSeconds: 1200,
          totalSeconds: 2400,
        },
      ]).map(({ station }) => station.id),
    ).toEqual(['gangnam', 'seoul', 'hongik-university']);
  });
});
