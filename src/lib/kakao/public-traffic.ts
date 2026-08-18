import type { Station } from '../subway/stations';

const PUBLIC_TRAFFIC_URL = 'https://apis-navi.kakaomobility.com/v1/directions';

type KakaoRoute = {
  properties?: { totalTime?: number };
};

type KakaoResponse = {
  status?: string;
  properties?: { landingURL?: string };
  routes?: KakaoRoute[];
};

const unavailable = () => new Error('Kakao transit is unavailable');

export const getPublicTransitRoute = async (from: Station, to: Station) => {
  const key = process.env.KAKAO_REST_API_KEY;
  if (!key) throw new Error('Kakao transit is not configured');

  const params = new URLSearchParams({
    origin: `${from.longitude},${from.latitude}`,
    destination: `${to.longitude},${to.latitude}`,
  });

  let response: Response;
  try {
    response = await fetch(`${PUBLIC_TRAFFIC_URL}?${params}`, {
      cache: 'no-store',
      headers: { Authorization: `KakaoAK ${key}` },
    });
  } catch {
    throw unavailable();
  }

  if (!response.ok) throw unavailable();

  const payload = (await response.json()) as KakaoResponse;
  const durationSeconds = Math.min(
    ...(payload.routes ?? [])
      .map((route) => route.properties?.totalTime)
      .filter((duration): duration is number => Number.isFinite(duration)),
  );

  if (
    payload.status !== 'OK' ||
    !Number.isFinite(durationSeconds) ||
    !payload.properties?.landingURL
  ) {
    throw unavailable();
  }

  return { durationSeconds, landingUrl: payload.properties.landingURL };
};
