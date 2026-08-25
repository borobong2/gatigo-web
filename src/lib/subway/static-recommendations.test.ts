import { describe, expect, it } from 'vitest';
import {
  getStaticStationNodes,
  recommendStaticMeetingStations,
} from './static-recommendations';

describe('getStaticStationNodes', () => {
  it('resolves a displayed station name to every line node', () => {
    expect(getStaticStationNodes('강남역')).toHaveLength(2);
    expect(getStaticStationNodes('홍대입구')).toHaveLength(1);
  });
});

describe('recommendStaticMeetingStations', () => {
  it('returns three non-origin candidates with each participant duration', () => {
    const candidates = recommendStaticMeetingStations(['강남역', '홍대입구역']);

    expect(candidates).toHaveLength(3);
    expect(candidates.map((candidate) => candidate.name)).not.toContain('강남');
    expect(candidates.map((candidate) => candidate.name)).not.toContain('홍대입구');
    expect(candidates.every((candidate) => candidate.durations.length === 2)).toBe(
      true,
    );
  });
});
