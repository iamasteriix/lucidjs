import { test, expect } from '@playwright/test';

test.describe(
  'Health API',
  () => {
    test(
      'returns 200 OK',
      async ({ request }) => {
        const response = await request.get('/diagnostics/health');
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe('ok');
        expect(body.time).toBeDefined();
    });
});
