import { describe, it, expect, vi } from 'vitest';
import { exampleController } from './example.controller.js';
import type { Request, Response } from 'express';

describe(
  'exampleController',
  () => {
  it(
    'returns status 200 and ISO timestamp',
    async () => {
      const req = {} as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await exampleController(req, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'rocketship, rocketship',
        time: expect.any(String),
      });
    });
});
