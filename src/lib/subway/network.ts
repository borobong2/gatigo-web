export type StaticNetwork = Readonly<
  Record<string, readonly { to: string; minutes: number }[]>
>;

export const shortestTravelTimes = (network: StaticNetwork, origin: string) => {
  const distances = new Map([[origin, 0]]);
  const queue = [{ station: origin, minutes: 0 }];

  while (queue.length) {
    queue.sort((a, b) => a.minutes - b.minutes);
    const current = queue.shift()!;
    if (current.minutes !== distances.get(current.station)) continue;

    for (const edge of network[current.station] ?? []) {
      const minutes = current.minutes + edge.minutes;
      if (minutes < (distances.get(edge.to) ?? Infinity)) {
        distances.set(edge.to, minutes);
        queue.push({ station: edge.to, minutes });
      }
    }
  }

  return distances;
};
