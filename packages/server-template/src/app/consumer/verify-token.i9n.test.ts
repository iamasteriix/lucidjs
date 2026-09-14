import request from 'supertest';
import { describe, it, expect, vi, } from 'vitest';
import { createApp } from '../index.js'
import * as tokenService from './tokens.service.js';
import { ErrorCodes } from '@/errors/index.js';


describe(
  'GET /consumer/verify/',
  () => {
    it(
      'responds 200 with skbd_token when token valid',
      async () => {
        vi.spyOn(tokenService, 'consumeToken').mockResolvedValue('6b656570207570202d20303730207368616b65');
        vi.spyOn(tokenService, 'issueToken').mockResolvedValue('68696768206669766520696620796f75206c65617665');

        const { app } = await createApp();
        const res = await request(app)
          .get('/consumer/verify')
          .query({ token: '73617920776520646f6e6520666f7265766572' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ skbd_token: '68696768206669766520696620796f75206c65617665', });
    });

    it(
      'responds 401 when token invalid',
      async () => {
        vi.spyOn(tokenService, 'consumeToken').mockResolvedValue(null);

        const { app } = await createApp();
        const res = await request(app)
          .get('/consumer/verify')
          .query({ token: 'bad-token' });

        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({ error: ErrorCodes.internal, });
    });
  },
);
