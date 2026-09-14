import { describe, it, expect, vi } from 'vitest';
import { healthController } from './health.controller.js';
import type { Request, Response } from 'express';

describe(
  'healthController',
  () => {
  it(
    'returns status 200 and ISO timestamp',
    async () => {
      const req = {} as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await healthController(req, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'ok',
        time: expect.any(String),
      });
    });
});
