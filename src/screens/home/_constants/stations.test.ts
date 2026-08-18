import { describe, expect, it } from 'vitest';
import { toOriginIds } from './stations';

describe('toOriginIds', () => {
  it('returns two distinct selected station IDs', () => {
    expect(
      toOriginIds({ first: 'gangnam', second: 'hongik-university' }),
    ).toEqual(['gangnam', 'hongik-university']);
  });

  it('rejects matching station selections', () => {
    expect(() =>
      toOriginIds({ first: 'gangnam', second: 'gangnam' }),
    ).toThrow('서로 다른 출발역');
  });
});
