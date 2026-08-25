# Static Network Data

`src/lib/subway/static-network.ts` is generated from
`전체_도시철도운행정보_20260228.xlsx`, supplied from the National Railroad
Authority's city and metropolitan rail operation data.

- Runtime use: bundled TypeScript data only; no external request or API key.
- Edge time: median scheduled minutes between consecutive stations on regular
  services.
- Transfer: station names shared by multiple line nodes receive a 3-minute
  edge.
- Coverage: lines present in the supplied workbook; GTX-A is excluded because
  it is absent from that source.
- License: the source record states no usage restriction; retain this
  attribution when refreshing the generated data.
