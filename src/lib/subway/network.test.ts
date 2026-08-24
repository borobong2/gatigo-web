import { describe, expect, it } from 'vitest';
import { shortestTravelTimes } from './network';

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
