import { NextResponse } from 'next/server';
import { getPublicTransitRoute } from '../../../lib/kakao/public-traffic';
import { rankActualCandidates } from '../../../lib/subway/ranking';
import {
  getStation,
  prefilterMeetingStations,
} from '../../../lib/subway/stations';

const badRequest = () =>
  NextResponse.json({ error: 'Invalid origin IDs' }, { status: 400 });

const requestsByIp = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

// ponytail: one-instance ceiling; move rate limiting to the provider/edge for multi-instance deployments.
const isRateLimited = (request: Request) => {
  const now = Date.now();
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip =
    forwardedFor?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const current = requestsByIp.get(ip);

  if (!current || current.resetAt <= now) {
    requestsByIp.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT) return true;
  current.count += 1;
  return false;
};

export const POST = async (request: Request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest();
  }

  const originIds =
    typeof body === 'object' && body !== null && 'originIds' in body
      ? body.originIds
      : undefined;
  if (
    !Array.isArray(originIds) ||
    originIds.length !== 2 ||
    originIds.some((id) => typeof id !== 'string') ||
    originIds[0] === originIds[1]
  ) {
    return badRequest();
  }

  const [firstOrigin, secondOrigin] = originIds.map(getStation);
  if (!firstOrigin || !secondOrigin) return badRequest();

  const originStations = [firstOrigin, secondOrigin] as const;
  const candidates = prefilterMeetingStations(originIds as [string, string]);

  if (isRateLimited(request)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const routes = await Promise.all(
      candidates.flatMap((candidate) =>
        originStations.map((origin) =>
          getPublicTransitRoute(origin, candidate),
        ),
      ),
    );

    return NextResponse.json({
      candidates: rankActualCandidates(
        candidates.map((station, index) => {
          const pair = routes.slice(
            index * originStations.length,
            index * 2 + 2,
          );
          const durations = pair.map((route) => route.durationSeconds) as [
            number,
            number,
          ];

          return {
            station,
            durations,
            maxSeconds: Math.max(...durations),
            totalSeconds: durations[0] + durations[1],
            landingUrl: pair[0].landingUrl,
          };
        }),
      ),
    });
  } catch {
    return NextResponse.json(
      { error: 'Transit service unavailable' },
      { status: 502 },
    );
  }
};
