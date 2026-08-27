import { describe, expect, it } from 'vitest';
import { POST } from './route';

const request = (body: unknown) =>
  new Request('http://localhost/api/meeting-suggestions', {
    method: 'POST',
    body: JSON.stringify(body),
  });

describe('POST /api/meeting-suggestions', () => {
  it('returns three static candidates without an external route request', async () => {
    const response = await POST(request({ originIds: ['강남', '홍대입구'] }));

    expect(response.status).toBe(200);
    expect((await response.json()).candidates).toHaveLength(3);
  });

  it.each([{}, { originIds: ['강남'] }, { originIds: ['강남', '없는역'] }])(
    'returns 400 for invalid origins: %j',
    async (body) => expect((await POST(request(body))).status).toBe(400),
  );

  it.each([
    { originIds: ['강남', '강남'] },
    { originIds: ['강남', '강남역'] },
    { originIds: Array.from({ length: 11 }, (_, index) => `${index}역`) },
  ])('returns 400 for duplicate or excessive origins: %j', async (body) => {
    expect((await POST(request(body))).status).toBe(400);
  });

  it('returns English candidate names for the English route', async () => {
    const response = await POST(
      request({ locale: 'en', originIds: ['강남', '홍대입구'] }),
    );

    expect(response.status).toBe(200);
    expect(
      (await response.json()).candidates.every(
        ({ displayName }: { displayName: string }) =>
          / Station/.test(displayName),
      ),
    ).toBe(true);
  });
});
