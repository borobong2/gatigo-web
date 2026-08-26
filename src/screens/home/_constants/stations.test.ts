import { describe, expect, it } from 'vitest';
import {
  addOrigin,
  candidateDisplayData,
  removeOrigin,
  resolveStationId,
  stationDisplayName,
  toOriginIds,
} from './stations';

const options = [
  { id: 'gangnam', name: 'Gangnam Station' },
  { id: 'hongik-university', name: 'Hongik University Station' },
];

describe('toOriginIds', () => {
  it('serializes two or more distinct station selections', () => {
    expect(
      toOriginIds(
        options.map(({ name }) => name),
        options,
      ),
    ).toEqual(['gangnam', 'hongik-university']);
  });

  it('rejects matching station selections', () => {
    expect(() =>
      toOriginIds(['Gangnam Station', 'Gangnam Station'], options),
    ).toThrow('Invalid origins');
  });

  it('adds and removes an origin without dropping below two people', () => {
    expect(addOrigin(['a', 'b'])).toEqual(['a', 'b', '']);
    expect(removeOrigin(['a', 'b', 'c'], 1)).toEqual(['a', 'c']);
    expect(removeOrigin(['a', 'b'], 0)).toEqual(['a', 'b']);
  });

  it('prepares every participant duration and ranking value for display', () => {
    expect(
      candidateDisplayData({
        displayName: '충무로역',
        durations: [12, 14, 9],
        totalMinutes: 35,
        worstMinutes: 14,
      }),
    ).toEqual({
      displayName: '충무로역',
      durations: [
        { minutes: 12, person: 1 },
        { minutes: 14, person: 2 },
        { minutes: 9, person: 3 },
      ],
      totalMinutes: 35,
      worstMinutes: 14,
    });
  });

  it('resolves a localized station name selected from a search list', () => {
    expect(resolveStationId('Gangnam Station', options)).toBe('gangnam');
    expect(resolveStationId('Unknown Station', options)).toBeUndefined();
  });

  it('does not append a second station suffix to display data', () => {
    expect(stationDisplayName('서울역')).toBe('서울역');
    expect(stationDisplayName('강남')).toBe('강남역');
  });
});
