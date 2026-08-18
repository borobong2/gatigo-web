export type StationOption = { id: string; name: string };

export const stationOptions: StationOption[] = [
  { id: 'gangnam', name: '강남역' },
  { id: 'hongik-university', name: '홍대입구역' },
  { id: 'euljiro-3ga', name: '을지로3가역' },
  { id: 'city-hall', name: '시청역' },
  { id: 'seoul', name: '서울역' },
];

export const toOriginIds = ({
  first,
  second,
}: {
  first: string;
  second: string;
}): [string, string] => {
  if (first === second) throw new Error('서로 다른 출발역을 선택해 주세요.');
  return [first, second];
};
