import { describe, expect, it } from 'vitest';
import { STATIC_NETWORK, STATIC_STATIONS } from './static-network';

describe('static metropolitan network data', () => {
  it('includes the capital-area rail lines and only positive edge times', () => {
    expect(STATIC_STATIONS.length).toBeGreaterThan(1_000);
    expect(new Set(STATIC_STATIONS.map(({ line }) => line)).size).toBe(28);
    expect(STATIC_STATIONS.some((station) => station.name === '강남')).toBe(
      true,
    );
    expect(STATIC_STATIONS.some((station) => station.name === '홍대입구')).toBe(
      true,
    );
    expect(
      Object.values(STATIC_NETWORK)
        .flat()
        .every((edge) => edge.minutes > 0),
    ).toBe(true);
    expect([...new Set(STATIC_STATIONS.map(({ line }) => line))]).toEqual(
      expect.arrayContaining([
        '경의중앙선',
        '공항철도',
        '서울 도시철도 9호선',
        '수인분당선',
        '인천지하철 1호선',
        '인천지하철 2호선',
      ]),
    );
  });

  it('keeps every generated node in one connected graph', () => {
    const visited = new Set<string>();
    const queue = [STATIC_STATIONS[0].id];
    while (queue.length) {
      const id = queue.pop()!;
      if (visited.has(id)) continue;
      visited.add(id);
      queue.push(...STATIC_NETWORK[id].map(({ to }) => to));
    }

    expect(visited.size).toBe(STATIC_STATIONS.length);
  });

  it('uses a three-minute edge between lines at transfer stations', () => {
    const transfers = STATIC_STATIONS.filter(({ name }) => name === '김포공항');

    expect(transfers.length).toBeGreaterThan(1);
    expect(
      transfers.every(({ id }) =>
        STATIC_NETWORK[id].some(
          ({ minutes, to }) =>
            minutes === 3 && transfers.some((station) => station.id === to),
        ),
      ),
    ).toBe(true);
  });

  it('keeps homonymous non-transfer stations separate', () => {
    for (const name of ['신촌', '양평']) {
      const stations = STATIC_STATIONS.filter(
        (station) => station.name === name,
      );
      expect(new Set(stations.map(({ placeId }) => placeId)).size).toBe(2);
      expect(
        stations.some(({ id }) =>
          STATIC_NETWORK[id].some(({ to }) =>
            stations.some((station) => station.id === to),
          ),
        ),
      ).toBe(false);
    }
  });

  it('groups capital-area aliases of the same physical station', () => {
    for (const name of [
      '대곡',
      '교대',
      '화정',
      '중앙',
      '중동',
      '시청',
      '용산',
    ]) {
      const places = STATIC_STATIONS.filter(
        (station) => station.name === name,
      ).map(({ placeId }) => placeId);
      expect(new Set(places).size).toBe(1);
    }
  });

  it('collapses the Siheung junction without creating a false transfer', () => {
    expect(
      STATIC_STATIONS.some(
        ({ line, name }) => line === '경부선' && name === '시흥시청',
      ),
    ).toBe(false);
    expect(STATIC_NETWORK['경부선|금천구청']).toContainEqual(
      expect.objectContaining({ to: '경부선|광명' }),
    );
  });

  it('does not expose corrupted source abbreviations as stations', () => {
    const names = new Set(STATIC_STATIONS.map(({ name }) => name));
    for (const artifact of [
      '1동대',
      '1종로',
      '1지청',
      '종로5',
      '지하서',
      '신길온',
    ]) {
      expect(names.has(artifact)).toBe(false);
    }
    expect([...names]).toEqual(
      expect.arrayContaining(['동대문', '종로3가', '청량리', '서울', '능길']),
    );
  });

  it('does not turn corrupted or skip-stop rows into track adjacency', () => {
    expect(STATIC_NETWORK['서울 도시철도 1호선|구일']).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ to: '서울 도시철도 1호선|도원' }),
      ]),
    );
    expect(STATIC_NETWORK['서울 도시철도 1호선|송내']).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ to: '서울 도시철도 1호선|부평' }),
      ]),
    );
    expect(STATIC_NETWORK['서울 도시철도 1호선|주안']).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ to: '서울 도시철도 1호선|동인천' }),
      ]),
    );
    expect(
      Math.max(
        ...Object.entries(STATIC_NETWORK).map(
          ([id, edges]) =>
            edges.filter(({ to }) => to.split('|')[0] === id.split('|')[0])
              .length,
        ),
      ),
    ).toBeLessThanOrEqual(3);
  });
});
