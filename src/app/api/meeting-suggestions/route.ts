import { NextResponse } from 'next/server';
import { MAX_ORIGINS, MIN_ORIGINS } from '../../../lib/subway/constants';
import { recommendStaticMeetingStations } from '../../../lib/subway/static-recommendations';

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

  if (new Set(originIds).size !== originIds.length) {
    return NextResponse.json({ error: 'Invalid origins' }, { status: 400 });
  }

  try {
    return NextResponse.json({
      candidates: recommendStaticMeetingStations(originIds),
    });
  } catch {
    return badRequest();
  }
};
