import type { Station } from '../subway/stations';

const PUBLIC_TRAFFIC_URL = 'https://dapi.kakao.com/v2/routing/publictraffic';
const REQUEST_TIMEOUT_MS = 5_000;

type KakaoRoute = {
  properties?: { totalTime?: number };
};

type KakaoResponse = {
  status?: string;
  properties?: { landingURL?: string };
  routes?: KakaoRoute[];
};

const unavailable = () => new Error('Kakao transit is unavailable');

const isSafeLandingUrl = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;

  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      (url.hostname === 'map.kakao.com' ||
        url.hostname.endsWith('.map.kakao.com'))
    );
  } catch {
    return false;
  }
};

export const getPublicTransitRoute = async (from: Station, to: Station) => {
  const key = process.env.KAKAO_REST_API_KEY;
  if (!key) throw new Error('Kakao transit is not configured');

  const params = new URLSearchParams({
    start_x: String(from.longitude),
    start_y: String(from.latitude),
    end_x: String(to.longitude),
    end_y: String(to.latitude),
  });

  let response: Response;
  try {
    response = await fetch(`${PUBLIC_TRAFFIC_URL}?${params}`, {
      cache: 'no-store',
      headers: { Authorization: `KakaoAK ${key}` },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw unavailable();
  }

  if (!response.ok) throw unavailable();

  let payload: KakaoResponse;
  try {
    payload = (await response.json()) as KakaoResponse;
  } catch {
    throw unavailable();
  }
  const durationSeconds = Math.min(
    ...(payload.routes ?? [])
      .map((route) => route.properties?.totalTime)
      .filter((duration): duration is number => Number.isFinite(duration)),
  );

  if (
    payload.status !== 'OK' ||
    !Number.isFinite(durationSeconds) ||
    !isSafeLandingUrl(payload.properties?.landingURL)
  ) {
    throw unavailable();
  }

  return { durationSeconds, landingUrl: payload.properties.landingURL };
};
