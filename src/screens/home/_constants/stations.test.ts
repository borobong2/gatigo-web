import { describe, expect, it } from 'vitest';
import { resolveStationId, toOriginIds } from './stations';

const options = [
  { id: 'gangnam', name: 'Gangnam Station' },
  { id: 'hongik-university', name: 'Hongik University Station' },
];

describe('toOriginIds', () => {
  it('returns two distinct selected station IDs', () => {
    expect(
      toOriginIds({ first: 'gangnam', second: 'hongik-university' }),
    ).toEqual(['gangnam', 'hongik-university']);
  });

  it('rejects matching station selections', () => {
    expect(() => toOriginIds({ first: 'gangnam', second: 'gangnam' })).toThrow(
      'Invalid origins',
    );
  });

  it('resolves a localized station name selected from a search list', () => {
    expect(resolveStationId('Gangnam Station', options)).toBe('gangnam');
    expect(resolveStationId('Unknown Station', options)).toBeUndefined();
  });
});
