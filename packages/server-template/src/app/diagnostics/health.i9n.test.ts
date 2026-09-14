import { describe, it, expect } from 'vitest';
import { healthController } from './health.controller.js';
import request from 'supertest';
import express from 'express';


describe(
  'GET /diagnostics/health',
  () => {
    const app = express();
    app.get('/diagnostics/health', healthController);

    it(
      'responds with 200 OK and valid body',
      async () => {
        const res = await request(app).get('/diagnostics/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(new Date(res.body.time).getTime()).not.toBeNaN();
    });
});
