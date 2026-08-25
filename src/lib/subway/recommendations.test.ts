import { describe, expect, it } from 'vitest';
import { recommendMeetingStations } from './recommendations';

describe('recommendMeetingStations', () => {
  it('prioritizes the smallest worst static travel time, then total time', () => {
    expect(
      recommendMeetingStations(
        {
          a: [{ to: 'middle', minutes: 4 }],
          b: [{ to: 'middle', minutes: 7 }],
          middle: [
            { to: 'a', minutes: 4 },
            { to: 'b', minutes: 7 },
            { to: 'near-a', minutes: 1 },
          ],
          'near-a': [{ to: 'middle', minutes: 1 }],
        },
        ['a', 'b'],
        ['middle', 'near-a'],
      ),
    ).toEqual([
      { stationId: 'middle', durations: [4, 7], worstMinutes: 7, totalMinutes: 11 },
      { stationId: 'near-a', durations: [5, 8], worstMinutes: 8, totalMinutes: 13 },
    ]);
  });
});
