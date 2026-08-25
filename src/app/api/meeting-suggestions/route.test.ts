import { describe, expect, it } from 'vitest';
import { POST } from './route';

const request = (body: unknown) =>
  new Request('http://localhost/api/meeting-suggestions', {
    method: 'POST',
    body: JSON.stringify(body),
  });

describe('POST /api/meeting-suggestions', () => {
  it('returns three static candidates without an external route request', async () => {
    const response = await POST(
      request({ originNames: ['강남역', '홍대입구역'] }),
    );

    expect(response.status).toBe(200);
    expect((await response.json()).candidates).toHaveLength(3);
  });

  it.each([{}, { originNames: ['강남역'] }, { originNames: ['강남역', '없는역'] }])(
    'returns 400 for invalid origins: %j',
    async (body) => expect((await POST(request(body))).status).toBe(400),
  );
});
