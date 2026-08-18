export type StationOption = { id: string; name: string };

export const resolveStationId = (
  name: string,
  options: readonly StationOption[],
) => options.find((station) => station.name === name)?.id;

export const toOriginIds = ({
  first,
  second,
}: {
  first: string;
  second: string;
}): [string, string] => {
  if (!first || !second || first === second) throw new Error('Invalid origins');
  return [first, second];
};
