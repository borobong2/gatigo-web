import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';
import { getPublicTransitRoute } from '../../../lib/kakao/public-traffic';

vi.mock('../../../lib/kakao/public-traffic', () => ({
  getPublicTransitRoute: vi.fn(),
}));

const transit = vi.mocked(getPublicTransitRoute);

let requestId = 0;

const request = (body: unknown, ip = `198.51.100.${++requestId}`) =>
  new Request('http://localhost/api/meeting-suggestions', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'x-forwarded-for': ip },
  });

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('POST /api/meeting-suggestions', () => {
  it('returns three candidates ranked by actual journey durations', async () => {
    transit.mockImplementation(async (origin, candidate) => {
      const durationSeconds =
        candidate.id === 'city-hall'
          ? origin.id === 'gangnam'
            ? 300
            : 500
          : candidate.id === 'euljiro-3ga'
            ? origin.id === 'gangnam'
              ? 600
              : 700
            : origin.id === 'gangnam'
              ? 400
              : 1100;

      return {
        durationSeconds,
        landingUrl: `https://map.kakao.com/${candidate.id}`,
      };
    });

    const response = await POST(
      request({ originIds: ['gangnam', 'hongik-university'] }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      candidates: [
        {
          station: {
            id: 'city-hall',
            name: '시청역',
            longitude: 126.97712,
            latitude: 37.56583,
          },
          durations: [300, 500],
          maxSeconds: 500,
          totalSeconds: 800,
          landingUrl: 'https://map.kakao.com/city-hall',
        },
        {
          station: {
            id: 'euljiro-3ga',
            name: '을지로3가역',
            longitude: 126.99195,
            latitude: 37.5663,
          },
          durations: [600, 700],
          maxSeconds: 700,
          totalSeconds: 1300,
          landingUrl: 'https://map.kakao.com/euljiro-3ga',
        },
        {
          station: {
            id: 'express-bus-terminal',
            name: '고속터미널역',
            longitude: 127.00481,
            latitude: 37.50481,
          },
          durations: [400, 1100],
          maxSeconds: 1100,
          totalSeconds: 1500,
          landingUrl: 'https://map.kakao.com/express-bus-terminal',
        },
      ],
    });
  });

  it('starts all route lookups before awaiting any response', async () => {
    let resolveRoute!: (value: {
      durationSeconds: number;
      landingUrl: string;
    }) => void;
    const route = new Promise<{
      durationSeconds: number;
      landingUrl: string;
    }>((resolve) => {
      resolveRoute = resolve;
    });
    transit.mockReturnValue(route);

    const response = POST(
      request({ originIds: ['gangnam', 'hongik-university'] }),
    );

    await vi.waitFor(() => expect(transit).toHaveBeenCalledTimes(6));
    resolveRoute({
      durationSeconds: 600,
      landingUrl: 'https://map.kakao.com/',
    });
    await expect(response).resolves.toHaveProperty('status', 200);
  });

  it.each([
    {},
    { originIds: ['gangnam'] },
    { originIds: ['gangnam', 'gangnam'] },
  ])('returns 400 for malformed bodies: %j', async (body) => {
    const response = await POST(request(body));

    expect(response.status).toBe(400);
  });

  it('returns 400 for malformed JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/meeting-suggestions', {
        method: 'POST',
        body: '{',
      }),
    );

    expect(response.status).toBe(400);
  });

  it('returns 400 for an unknown origin ID', async () => {
    const response = await POST(request({ originIds: ['gangnam', 'unknown'] }));

    expect(response.status).toBe(400);
  });

  it('returns 502 when Kakao transit fails', async () => {
    transit.mockRejectedValue(new Error('Kakao transit is unavailable'));

    const response = await POST(
      request({ originIds: ['gangnam', 'hongik-university'] }),
    );

    expect(response.status).toBe(502);
  });

  it('limits each IP before starting more Kakao requests', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-19T00:00:00Z'));
    transit.mockResolvedValue({
      durationSeconds: 600,
      landingUrl: 'https://map.kakao.com/',
    });

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await POST(
        request(
          { originIds: ['gangnam', 'hongik-university'] },
          '203.0.113.10',
        ),
      );
      expect(response.status).toBe(200);
    }

    const limited = await POST(
      request({ originIds: ['gangnam', 'hongik-university'] }, '203.0.113.10'),
    );
    const otherIp = await POST(
      request({ originIds: ['gangnam', 'hongik-university'] }, '203.0.113.11'),
    );
    vi.advanceTimersByTime(60_000);
    const reset = await POST(
      request({ originIds: ['gangnam', 'hongik-university'] }, '203.0.113.10'),
    );

    expect(limited.status).toBe(429);
    await expect(limited.json()).resolves.toEqual({
      error: 'Too many requests',
    });
    expect(otherIp.status).toBe(200);
    expect(reset.status).toBe(200);
    expect(transit).toHaveBeenCalledTimes(72);
  });
});
