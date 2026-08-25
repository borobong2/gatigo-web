import { NextResponse } from 'next/server';
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

  const originNames =
    typeof body === 'object' && body !== null && 'originNames' in body
      ? body.originNames
      : undefined;
  if (
    !Array.isArray(originNames) ||
    originNames.length < 2 ||
    originNames.some((name) => typeof name !== 'string')
  ) {
    return badRequest();
  }

  try {
    return NextResponse.json({ candidates: recommendStaticMeetingStations(originNames) });
  } catch {
    return badRequest();
  }
};
