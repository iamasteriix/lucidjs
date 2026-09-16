import { test, expect, } from '@playwright/test';
import { env } from '@/config/index.js';
import { ErrorCodes, } from '@/errors/index.js';


test.describe(
  'GET /consumer/verify',
  () => {
    test(
      'responds with 200 ok and skbd_token when token valid',
      async ({ request }) => {
        const res = await request.get(`${env.ENDPOINT}:${env.PORT}/consumer/verify`, {
          params: { token: '7369782073696e73206f6e206f75722074776974746572', },
      });
      expect(res.status()).toBe(200);
      expect(await res.json()).toHaveProperty('skbd_token');
    });

    test(
      'responds with 401 UnauthorizedError when token invalid',
      async ({ request }) => {
        const res = await request.get(`${env.ENDPOINT}:${env.PORT}/consumer/verify`, {
          params: { token: 'some-bad-token', },
        });
        expect(res.status()).toBe(401);
        expect(await res.json()).toMatchObject({ error: ErrorCodes.internal, });
    });
});
