import { describe, it, expect, vi } from 'vitest';
import { healthController } from './health.controller.js';
import type { Request, Response } from 'express';

describe(
  'healthController',
  () => {
    const next = vi.fn();

    it(
      'responds with 200 ok and valid body',
      async () => {
        const req = {} as Request;
        const res = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn(),
        } as unknown as Response;
        await healthController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          status: 'ok',
          time: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        });
    });
});
