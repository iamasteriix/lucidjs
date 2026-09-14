import { describe, it, expect } from 'vitest';
import { exampleController } from './example.controller.js';
import request from 'supertest';
import express from 'express';


describe(
  'GET /',
  () => {
    const app = express();
    app.get('/', exampleController);

    it(
      'responds with 200 OK and valid body',
      async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('rocketship, rocketship');
        expect(new Date(res.body.time).getTime()).not.toBeNaN();
    });
});
