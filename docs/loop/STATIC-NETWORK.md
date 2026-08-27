# Static Network Data

`src/lib/subway/static-network.ts` is generated from the Korea National Railway
`전체_도시철도운행정보_20260630.xlsx` workbook published by the
[Rail Network Portal](https://data.kric.go.kr/rips/M_01_01/detail.do?id=900).
Station names and physical transfer identities come from the companion
`전체_도시철도역사정보_20260630.xlsx` dataset.

- Runtime use: bundled TypeScript data only; no external request or API key.
- Edge time: median scheduled minutes between physical adjacent stations on
  regular services. Source rows that skip or scramble intermediate stops are
  filtered with the companion station coordinates before edges are emitted.
- Missing time fallback: lines whose source rows contain station order but no
  per-station time use 2 minutes per adjacent stop.
- Transfer: same-name capital-area line nodes within 1 kilometer in station
  metadata receive a 3-minute edge; verified homonyms Sinchon and Yangpyeong
  remain separate.
- Coverage: 28 capital-area lines and 1,032 line/station nodes in the source,
  including lines 1-9, Gyeongui-Jungang, Suin-Bundang, Airport Railroad,
  Seohae, Incheon 1/2, Gimpo Goldline, Everline, and Uijeongbu light rail.
- Excluded: non-capital lines, disconnected non-capital branches, express-only
  services, and GTX-A (absent from this source).
- License: the public-data record states no usage restriction.
- Source SHA-256:
  `218f76dd53c4b9e1f248a8e07ab6879763495958714ee377761944e40cd94bc4`.
- Station metadata SHA-256:
  `cdf1d84a7e5c898b2aacd622783ba8ba9af35c40bee0561dc97d55ce8e063f94`.
- Localized labels: Korean and English station names come from the companion
  station metadata and are bundled with the graph.

Regenerate without adding a spreadsheet parser dependency:

```bash
curl -L -o /tmp/kric-network.xlsx \
  'https://data.kric.go.kr/rips/dataset/download.file?type=filedata&id=900&operation=1'
curl -L -o /tmp/kric-stations.xlsx \
  'https://data.kric.go.kr/rips/dataset/download.file?type=filedata&id=32&operation=1'
echo '218f76dd53c4b9e1f248a8e07ab6879763495958714ee377761944e40cd94bc4  /tmp/kric-network.xlsx' \
  | shasum -a 256 -c -
echo 'cdf1d84a7e5c898b2aacd622783ba8ba9af35c40bee0561dc97d55ce8e063f94  /tmp/kric-stations.xlsx' \
  | shasum -a 256 -c -
pnpm generate:network -- /tmp/kric-network.xlsx /tmp/kric-stations.xlsx
```
