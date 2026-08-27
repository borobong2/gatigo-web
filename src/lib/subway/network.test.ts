import { describe, expect, it } from 'vitest';
import { shortestTravelTimes, shortestTravelTimesFrom } from './network';

describe('shortestTravelTimes', () => {
  it('adds the transfer penalty to the fastest static route', () => {
    expect(
      shortestTravelTimes(
        {
          gangnam: [{ to: 'express-terminal', minutes: 2 }],
          'express-terminal': [
            { to: 'gangnam', minutes: 2 },
            { to: 'terminal-line-9', minutes: 3 },
          ],
          'terminal-line-9': [
            { to: 'express-terminal', minutes: 3 },
            { to: 'yeouido', minutes: 4 },
          ],
          yeouido: [{ to: 'terminal-line-9', minutes: 4 }],
        },
        'gangnam',
      ).get('yeouido'),
    ).toBe(9);
  });
});

describe('shortestTravelTimesFrom', () => {
  it('starts from every line node of one physical station at zero cost', () => {
    expect(
      shortestTravelTimesFrom(
        {
          'gangnam-2': [{ to: 'yeoksam', minutes: 2 }],
          'gangnam-sinbundang': [{ to: 'pangyo', minutes: 5 }],
          yeoksam: [{ to: 'gangnam-2', minutes: 2 }],
          pangyo: [{ to: 'gangnam-sinbundang', minutes: 5 }],
        },
        ['gangnam-2', 'gangnam-sinbundang'],
      ).get('pangyo'),
    ).toBe(5);
  });
});
