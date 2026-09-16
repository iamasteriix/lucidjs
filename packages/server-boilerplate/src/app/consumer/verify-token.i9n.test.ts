import { describe, it, expect, vi, } from 'vitest';
import { ErrorCodes } from '@/errors/index.js';
import { createApp } from '../index.js'
import request from 'supertest';
import * as tokenService from './tokens.service.js';


describe(
  'GET /consumer/verify/',
  async () => {
    const { app } = await createApp();

    it(
      'responds with 200 ok and skbd_token when token valid',
      async () => {
        vi.spyOn(tokenService, 'consumeToken').mockResolvedValue('6b656570207570202d20303730207368616b65');
        vi.spyOn(tokenService, 'issueToken').mockResolvedValue('68696768206669766520696620796f75206c65617665');

        const res = await request(app)
          .get('/consumer/verify')
          .query({ token: '73617920776520646f6e6520666f7265766572' });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ skbd_token: '68696768206669766520696620796f75206c65617665', });
    });

    it(
      'responds with 400 ValidationError when token invalid',
      async () => {
        const res = await request(app)
          .get('/consumer/verify')
          .query({ token: undefined, });
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({ error: ErrorCodes.internal, });
    });

    it(
      'responds with 401 UnauthorizedError when token unauthorized',
      async () => {
        vi.spyOn(tokenService, 'consumeToken').mockResolvedValue('');

        const res = await request(app)
          .get('/consumer/verify')
          .query({ token: 'some-bad-token', });
        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({ error: ErrorCodes.internal, });
    });
  },
);
