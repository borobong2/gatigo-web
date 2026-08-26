import { execFileSync, spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const CAPITAL_LINES = new Set([
  '경강선',
  '경부선',
  '경의중앙선',
  '경인선',
  '경춘선',
  '김포골드라인',
  '서울 도시철도 1호선',
  '서울 도시철도 2호선',
  '서울 도시철도 3호선',
  '서울 도시철도 4호선',
  '서울 도시철도 5호선',
  '서울 도시철도 6호선',
  '서울 도시철도 7호선',
  '서울 도시철도 8호선',
  '서울 도시철도 9호선',
  '서해선',
  '수도권 경량도시철도 신림선',
  '수도권 경량도시철도 우이신설선',
  '수도권 도시철도 7호선',
  '신분당선',
  '안산과천선',
  '의정부',
  '인천국제공항선',
  '인천지하철 1호선',
  '인천지하철 2호선',
  '일산선',
  '에버라인',
  '수인분당선',
]);

const LINE_NAMES = new Map([
  ['인천국제공항선', '공항철도'],
  ['의정부', '의정부경전철'],
]);
const METADATA_LINES = new Map([
  ['경의중앙선', ['경의중앙선', '경원선', '경부선']],
  ['공항철도', ['인천국제공항선']],
  ['김포골드라인', ['김포도시철도']],
  ['서울 도시철도 1호선', ['1호선']],
  ['서울 도시철도 2호선', ['2호선']],
  ['서울 도시철도 3호선', ['3호선']],
  ['서울 도시철도 4호선', ['4호선']],
  ['서울 도시철도 5호선', ['5호선']],
  ['서울 도시철도 6호선', ['6호선']],
  ['서울 도시철도 7호선', ['7호선']],
  ['서울 도시철도 8호선', ['8호선']],
  ['서울 도시철도 9호선', ['서울 도시철도 9호선', '수도권  도시철도 9호선']],
  ['수도권 경량도시철도 우이신설선', ['우이신설선']],
  ['수도권 도시철도 7호선', ['도시철도 7호선']],
  ['수인분당선', ['수인선', '분당선']],
  ['일산선', ['일산선', '3호선']],
  ['안산과천선', ['안산과천선', '4호선']],
  ['의정부경전철', ['의정부']],
]);
const STATION_NAMES = new Map([
  ['1동대', '동대문'],
  ['1양원', '양원'],
  ['1양정', '양정'],
  ['1종로', '종로3가'],
  ['1지청', '청량리'],
  ['3대곡', '대곡'],
  ['3도곡', '도곡'],
  ['3수서', '수서'],
  ['3옥수', '옥수'],
  ['3을지', '을지로3가'],
  ['3종로', '종로3가'],
  ['3충무', '충무로'],
  ['4동대', '동대문'],
  ['4동운', '동대문역사문화공원'],
  ['4서울', '서울'],
  ['4이촌', '이촌'],
  ['4창동', '창동'],
  ['4충무', '충무로'],
  ['가락시', '가락시장'],
  ['가산디', '가산디지털단지'],
  ['강남구', '강남구청'],
  ['경광주', '경기광주'],
  ['경마공', '경마공원'],
  ['경찰병', '경찰병원'],
  ['고속터', '고속터미널'],
  ['과천청', '정부과천청사'],
  ['금천구', '금천구청'],
  ['금호3', '금호'],
  ['남동인', '남동인더스파크'],
  ['남부터', '남부터미널'],
  ['당고개', '불암산'],
  ['대모산', '대모산입구'],
  ['도예촌', '신둔도예촌'],
  ['동대입', '동대입구'],
  ['동두중', '동두천중앙'],
  ['디엠시', '디지털미디어시티'],
  ['로데오', '압구정로데오'],
  ['매탄권', '매탄권선'],
  ['미아4', '미아사거리'],
  ['별가람', '별내별가람'],
  ['부천종', '부천종합운동장'],
  ['성균관', '성균관대'],
  ['성신여', '성신여대입구'],
  ['세종릉', '세종대왕릉'],
  ['센럴파크', '센트럴파크'],
  ['소래포', '소래포구'],
  ['수원시', '수원시청'],
  ['숙대입', '숙대입구'],
  ['시흥능', '시흥능곡'],
  ['시흥대', '시흥대야'],
  ['시흥청', '시흥시청'],
  ['신길온', '능길'],
  ['신길온천', '능길'],
  ['신김포', '김포공항'],
  ['신소사', '소사'],
  ['신수원', '수원'],
  ['신신천', '신천'],
  ['신신현', '신현'],
  ['신인천', '인천'],
  ['신초지', '초지'],
  ['신이매', '이매'],
  ['신판교', '판교'],
  ['쌍용나', '쌍용'],
  ['온양온', '온양온천'],
  ['인천논', '인천논현'],
  ['종로5', '종로5가'],
  ['지하서', '서울'],
  ['총신대', '총신대입구'],
  ['평내호', '평내호평'],
  ['평지제', '평택지제'],
  ['평촌동', '평촌'],
  ['한성대', '한성대입구'],
  ['항공대', '한국항공대'],
  ['홍대입', '홍대입구'],
  ['효창공', '효창공원앞'],
]);
const IGNORED_STATIONS = new Set(['시흥연']);
const NON_TRANSFER_STATIONS = new Set(['신촌', '양평']);

const source = process.argv[2];
const stationSource = process.argv[3];
const destination = path.resolve(
  process.argv[4] ?? 'src/lib/subway/static-network.ts',
);
if (!source || !stationSource) {
  throw new Error(
    'Usage: node scripts/generate-static-network.mjs <operations.xlsx> <stations.xlsx> [output.ts]',
  );
}

const decodeXml = (value) =>
  value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');

const readSharedStrings = (workbook) => {
  const xml = execFileSync('unzip', ['-p', workbook, 'xl/sharedStrings.xml'], {
    maxBuffer: 64 * 1024 * 1024,
  }).toString();
  return [...xml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map(([, item]) =>
    decodeXml(
      [...item.matchAll(/<t(?: [^>]*)?>([\s\S]*?)<\/t>/g)]
        .map(([, text]) => text)
        .join(''),
    ),
  );
};
const sharedStrings = readSharedStrings(source);

const cellValues = (row, strings = sharedStrings) => {
  const values = {};
  for (const [, attributes, contents] of row.matchAll(
    /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g,
  )) {
    const reference = /\br="([A-Z]+)\d+"/.exec(attributes)?.[1];
    const raw = /<v>([\s\S]*?)<\/v>/.exec(contents ?? '')?.[1] ?? '';
    if (reference) {
      values[reference] = /\bt="s"/.test(attributes)
        ? strings[Number(raw)]
        : raw;
    }
  }
  return values;
};

const metadataStrings = readSharedStrings(stationSource);
const metadataSheet = execFileSync(
  'unzip',
  ['-p', stationSource, 'xl/worksheets/sheet1.xml'],
  { maxBuffer: 16 * 1024 * 1024 },
).toString();
const stationMetadata = [
  ...metadataSheet.matchAll(/<row\b[\s\S]*?<\/row>/g),
].flatMap(([xml]) => {
  const row = cellValues(xml, metadataStrings);
  const latitude = Number(row.J);
  const longitude = Number(row.K);
  return row.B && Number.isFinite(latitude) && Number.isFinite(longitude)
    ? [
        {
          latitude,
          line: row.D?.trim(),
          longitude,
          name: row.B.trim()
            .replace(/\([^)]*\)/g, '')
            .replace(/역$/, '')
            .trim(),
        },
      ]
    : [];
});
const metadataNames = new Set(stationMetadata.map(({ name }) => name));
const metadataByName = new Map();
for (const station of stationMetadata) {
  const sameName = metadataByName.get(station.name) ?? [];
  sameName.push(station);
  metadataByName.set(station.name, sameName);
}

const distanceBetween = (first, second) =>
  Math.hypot(
    (first.latitude - second.latitude) * 111,
    (first.longitude - second.longitude) * 88,
  );

const locationFor = (station) => {
  const locations = metadataByName.get(station.name) ?? [];
  if (!locations.length) return undefined;
  const lines = METADATA_LINES.get(station.line) ?? [station.line];
  const exact = locations.find(({ line }) => lines.includes(line));
  if (exact) return exact;
  const capital = locations.filter(
    ({ latitude, longitude }) =>
      latitude > 36.5 && latitude < 38.5 && longitude > 126 && longitude < 128,
  );
  const candidates = capital.length ? capital : locations;
  if (
    candidates.every((location) => distanceBetween(candidates[0], location) < 1)
  ) {
    return candidates[0];
  }
  throw new Error(`No unambiguous metadata location for ${station.id}`);
};

const samples = new Map();
const stations = new Map();
let previous;

const normalizeStation = (name) => {
  const normalized = name
    .trim()
    .replace(/\([^)]*\)/g, '')
    .replace(/역$/, '')
    .trim();
  const canonical = STATION_NAMES.get(normalized) ?? normalized;
  return canonical;
};

const parseClock = (value) => {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value?.trim() ?? '');
  return match
    ? Number(match[1]) * 60 + Number(match[2]) + Number(match[3] ?? 0) / 60
    : undefined;
};

const packedValues = (value) =>
  (value ?? '').split(/[+,]/).flatMap((item) => {
    const separator = item.indexOf('-');
    return separator < 0
      ? []
      : [[item.slice(0, separator).trim(), item.slice(separator + 1).trim()]];
  });

const packedTimes = (value) => {
  const parts = (value ?? '').split(/[+,/]/);
  const times = new Map();
  for (let index = 0; index < parts.length; index += 1) {
    const item = parts[index];
    const match = /^(.+)-\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*$/.exec(item);
    const minutes = parseClock(match?.[2]);
    if (match && minutes !== undefined) {
      times.set(match[1].trim(), minutes);
    } else {
      const next = parseClock(parts[index + 1]);
      if (next !== undefined) {
        times.set(item.trim(), next);
        index += 1;
      }
    }
  }
  return times;
};

const addSample = (from, to, line, minutes) => {
  const key = [
    line,
    ...[from, to].sort((a, b) => a.localeCompare(b, 'ko')),
  ].join('|');
  const values = samples.get(key) ?? [];
  values.push(minutes);
  samples.set(key, values);
};

const consumeRow = (xml) => {
  const row = cellValues(xml);
  const rawLine = row.C?.trim();
  if (!CAPITAL_LINES.has(rawLine) || row.F !== '일반') {
    previous = undefined;
    return;
  }

  const line = LINE_NAMES.get(rawLine) ?? rawLine;
  if (/[+,]/.test(row.H ?? '')) {
    const route = packedValues(row.H).map(([code, name]) => ({
      code,
      name: normalizeStation(name),
    }));
    const arrivals = packedTimes(row.I);
    const departures = packedTimes(row.J);
    for (const { name } of route) {
      stations.set(`${line}|${name}`, { id: `${line}|${name}`, line, name });
    }
    for (let index = 1; index < route.length; index += 1) {
      const from = route[index - 1];
      const to = route[index];
      const start = departures.get(from.code) ?? arrivals.get(from.code);
      const end = arrivals.get(to.code) ?? departures.get(to.code);
      // ponytail: source rows without station times use a 2-minute adjacent-stop
      // estimate; replace it when KR publishes per-stop times for those lines.
      const minutes =
        start === undefined || end === undefined
          ? 2
          : Math.round((end - start + 24 * 60) % (24 * 60));
      if (minutes > 0 && minutes <= 60)
        addSample(from.name, to.name, line, minutes);
    }
    previous = undefined;
    return;
  }

  const rawStation = row.H?.trim() ?? '';
  if (IGNORED_STATIONS.has(rawStation)) return;
  const station = normalizeStation(rawStation);
  const group = [row.A, row.B, rawLine, row.D, row.E, row.F, row.G].join('|');
  const arrival = Number(row.I);
  const departure = Number(row.J);
  if (!station || !Number.isFinite(arrival) || !Number.isFinite(departure)) {
    previous = undefined;
    return;
  }

  stations.set(`${line}|${station}`, {
    id: `${line}|${station}`,
    line,
    name: station,
  });
  if (previous?.group === group && previous.station !== station) {
    const elapsed = ((arrival - previous.departure + 1) % 1) * 24 * 60;
    const minutes = Math.round(elapsed);
    if (minutes > 0 && minutes <= 60) {
      addSample(previous.station, station, line, minutes);
    }
  }
  previous = { departure, group, station };
};

const sheet = spawn('unzip', ['-p', source, 'xl/worksheets/sheet1.xml']);
let buffer = '';
for await (const chunk of sheet.stdout) {
  buffer += chunk;
  let end;
  while ((end = buffer.indexOf('</row>')) >= 0) {
    consumeRow(buffer.slice(0, end + 6));
    buffer = buffer.slice(end + 6);
  }
}
if ((await new Promise((resolve) => sheet.on('close', resolve))) !== 0) {
  throw new Error('Could not read the workbook sheet');
}

const network = Object.fromEntries([...stations.keys()].map((id) => [id, []]));
const connect = (from, to, minutes) => {
  network[from].push({ to, minutes });
  network[to].push({ to: from, minutes });
};
for (const [key, values] of samples) {
  values.sort((a, b) => a - b);
  const [line, first, second] = key.split('|');
  connect(
    `${line}|${first}`,
    `${line}|${second}`,
    values[Math.floor(values.length / 2)],
  );
}

const byName = new Map();
for (const station of stations.values()) {
  const sameName = byName.get(station.name) ?? [];
  sameName.push(station);
  byName.set(station.name, sameName);
}
for (const [name, sameName] of byName) {
  const groups = [];
  for (const station of sameName) {
    const location = locationFor(station);
    const group = NON_TRANSFER_STATIONS.has(name)
      ? undefined
      : groups.find(
          ({ location: first }) =>
            first && location && distanceBetween(first, location) < 1,
        );
    if (group) group.stations.push(station);
    else groups.push({ location, stations: [station] });
  }
  for (const group of groups) {
    const placeId =
      groups.length === 1
        ? name
        : `${name}|${group.stations
            .map(({ line }) => line)
            .sort((a, b) => a.localeCompare(b, 'ko'))
            .join(',')}`;
    for (const station of group.stations) station.placeId = placeId;
    for (let index = 0; index < group.stations.length; index += 1) {
      for (let other = index + 1; other < group.stations.length; other += 1) {
        connect(group.stations[index].id, group.stations[other].id, 3);
      }
    }
  }
}

const connected = new Set();
const queue = ['서울 도시철도 2호선|강남'];
while (queue.length) {
  const id = queue.pop();
  if (connected.has(id)) continue;
  connected.add(id);
  for (const { to } of network[id] ?? []) queue.push(to);
}
for (const id of Object.keys(network)) {
  if (!connected.has(id)) {
    delete network[id];
    stations.delete(id);
  }
}
for (const { name } of stations.values()) {
  if (!metadataNames.has(name))
    throw new Error(`Unknown generated station: ${name}`);
}

const sortedStations = [...stations.values()].sort((a, b) =>
  a.id.localeCompare(b.id, 'ko'),
);
for (const edges of Object.values(network)) {
  edges.sort((a, b) => a.to.localeCompare(b.to, 'ko'));
}

const stationRows = sortedStations
  .map((station) => `  ${JSON.stringify(station)},`)
  .join('\n');
const networkRows = Object.entries(network)
  .map(([id, edges]) => `  ${JSON.stringify(id)}: ${JSON.stringify(edges)},`)
  .join('\n');
const output = `// Generated by scripts/generate-static-network.mjs from the KR Network Rail Portal dataset.\nimport type { StaticNetwork } from './network';\n\nexport type StaticStation = {\n  id: string;\n  name: string;\n  line: string;\n  placeId: string;\n};\n\n// prettier-ignore\nexport const STATIC_STATIONS: readonly StaticStation[] = [\n${stationRows}\n];\n\n// prettier-ignore\nexport const STATIC_NETWORK: StaticNetwork = {\n${networkRows}\n};\n`;
await writeFile(destination, output);
console.log(
  `Generated ${sortedStations.length} nodes and ${samples.size} track edges.`,
);
