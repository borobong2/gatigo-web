import { NextResponse } from 'next/server';
import { MAX_ORIGINS, MIN_ORIGINS } from '../../../lib/subway/constants';
import {
  recommendStaticMeetingStations,
  resolveStaticStationId,
  type StaticLocale,
} from '../../../lib/subway/static-recommendations';

const badRequest = () =>
  NextResponse.json({ error: 'Invalid origin names' }, { status: 400 });

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
    originIds.length < MIN_ORIGINS ||
    originIds.length > MAX_ORIGINS ||
    originIds.some((id) => typeof id !== 'string' || !id.trim())
  ) {
    return badRequest();
  }

  const canonicalOriginIds = originIds.map(resolveStaticStationId);
  if (
    canonicalOriginIds.some((id) => !id) ||
    new Set(canonicalOriginIds).size !== canonicalOriginIds.length
  ) {
    return NextResponse.json({ error: 'Invalid origins' }, { status: 400 });
  }

  const locale: StaticLocale =
    typeof body === 'object' &&
    body !== null &&
    'locale' in body &&
    body.locale === 'en'
      ? 'en'
      : 'ko';
  return NextResponse.json({
    candidates: recommendStaticMeetingStations(
      canonicalOriginIds as string[],
      locale,
    ),
  });
};
