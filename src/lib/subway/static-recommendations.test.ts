import { describe, expect, it } from 'vitest';
import { getStaticStationNodes } from './static-recommendations';

describe('getStaticStationNodes', () => {
  it('resolves a displayed station name to every line node', () => {
    expect(getStaticStationNodes('강남역')).toHaveLength(2);
    expect(getStaticStationNodes('홍대입구')).toHaveLength(1);
  });
});
