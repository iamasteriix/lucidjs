import { test, expect } from '@playwright/test';
import { env } from '@/config/index.js';


test.describe(
  'GET /diagnostics/health',
  () => {
    test(
      'responds with 200 ok and valid body',
      async ({ request }) => {
        const res = await request.get(`${env.ENDPOINT}:${env.PORT}/diagnostics/health`);
        expect(res.status()).toBe(200);
        expect(await res.json()).toMatchObject({
          status: 'ok',
          time: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        });
    });
});
