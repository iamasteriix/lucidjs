import { test, expect, } from '@playwright/test';
import { env } from '@/config/index.js';
import { ErrorCodes, } from '@/errors/index.js';


test.describe(
  'Consumer verify flow',
  () => {
    test(
      'valid token returns skbd_token',
      async ({ request }) => {
        const res = await request.get(`${env.ENDPOINT}:${env.PORT}/consumer/verify`, {
          params: { token: '7369782073696e73206f6e206f75722074776974746572', },
      });

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.skbd_token).toMatch(/^skbd_/);
    });

    test(
      'invalid token returns 401',
      async ({ request }) => {
        const res = await request.get(`${env.ENDPOINT}:${env.PORT}/consumer/verify`, {
          params: { token: 2, },
      });

      expect(res.status()).toBe(401);
      const body = await res.json();
      expect(body.error).toMatchObject({ error: ErrorCodes.internal, });
    });
});
