import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPublicTransitRoute } from './public-traffic';

const gangnam = {
  id: 'gangnam',
  name: '강남역',
  longitude: 127.02758,
  latitude: 37.49794,
};

const hongikUniversity = {
  id: 'hongik-university',
  name: '홍대입구역',
  longitude: 126.92365,
  latitude: 37.55679,
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('getPublicTransitRoute', () => {
  it('returns the shortest Kakao route duration and landing URL', async () => {
    vi.stubEnv('KAKAO_REST_API_KEY', 'test-key');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 'OK',
            properties: { landingURL: 'https://map.kakao.com/' },
            routes: [
              { properties: { totalTime: 1234 } },
              { properties: { totalTime: 1200 } },
            ],
          }),
        ),
      ),
    );

    await expect(
      getPublicTransitRoute(gangnam, hongikUniversity),
    ).resolves.toEqual({
      durationSeconds: 1200,
      landingUrl: 'https://map.kakao.com/',
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://dapi.kakao.com/v2/routing/publictraffic?start_x=127.02758&start_y=37.49794&end_x=126.92365&end_y=37.55679',
      {
        cache: 'no-store',
        headers: { Authorization: 'KakaoAK test-key' },
      },
    );
  });

  it('rejects when the server key is missing', async () => {
    vi.stubEnv('KAKAO_REST_API_KEY', '');

    await expect(
      getPublicTransitRoute(gangnam, hongikUniversity),
    ).rejects.toThrow('Kakao transit is not configured');
  });

  it('rejects when Kakao responds with an HTTP error', async () => {
    vi.stubEnv('KAKAO_REST_API_KEY', 'test-key');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );

    await expect(
      getPublicTransitRoute(gangnam, hongikUniversity),
    ).rejects.toThrow('Kakao transit is unavailable');
  });

  it('rejects when Kakao returns no route', async () => {
    vi.stubEnv('KAKAO_REST_API_KEY', 'test-key');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 'NO_RESULTS',
            properties: { landingURL: 'https://map.kakao.com/' },
            routes: [],
          }),
        ),
      ),
    );

    await expect(
      getPublicTransitRoute(gangnam, hongikUniversity),
    ).rejects.toThrow('Kakao transit is unavailable');
  });

  it('rejects malformed Kakao responses with a stable error', async () => {
    vi.stubEnv('KAKAO_REST_API_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('not json')));

    await expect(
      getPublicTransitRoute(gangnam, hongikUniversity),
    ).rejects.toThrow('Kakao transit is unavailable');
  });
});
