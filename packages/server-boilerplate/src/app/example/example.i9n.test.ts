import { describe, it, expect } from 'vitest';
import { createApp } from '../index.js'
import request from 'supertest';


describe(
  'GET /',
  async () => {
    const { app } = await createApp();

    it(
      'responds with 200 ok and valid body',
      async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          message: 'rocketship, rocketship',
          time: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        });
    });
});
