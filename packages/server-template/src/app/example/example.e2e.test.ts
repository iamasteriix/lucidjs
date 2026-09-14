import { test, expect } from '@playwright/test';

test.describe(
  'Landing api',
  () => {
    test(
      'returns 200 OK',
      async ({ request }) => {
        const response = await request.get('/');
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.message).toBe('rocketship, rocketship');
        expect(body.time).toBeDefined();
    });
});
