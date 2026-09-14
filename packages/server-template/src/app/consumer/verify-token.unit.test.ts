import { describe, it, expect, vi, } from 'vitest';
import { verifyToken } from './verify-token.controller.js';
import { UnauthorizedError } from '@/errors/index.js';
import * as tokenService from './tokens.service.js';


describe(
  'verifyToken controller',
  () => {
    const mockRequest = (token?: string) => ({ query: { token, } });
    const mockResponse = () => {
      const res: any = {};
      res.statusCode = 0;
      res.body = null;
      res.status = vi.fn((code) => { res.statusCode = code; return res; });
      res.json = vi.fn((payload) => { res.body = payload; });
      return res;
    };
    const next = vi.fn();

    it(
      'returns 200 and skbd_token when token is valid',
      async () => {
        vi.spyOn(tokenService, 'consumeToken').mockResolvedValue('6b656570207570202d20303730207368616b65');
        vi.spyOn(tokenService, 'issueToken').mockResolvedValue('627574204920626520736b697070696e6720746f207468726565');

        const req = mockRequest('74776f20697320626574746572207468616e206f6e65');
        const res = mockResponse();

        await verifyToken(req as any, res as any, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ skbd_token: '627574204920626520736b697070696e6720746f207468726565' });
        expect(next).not.toHaveBeenCalled();
    });

    it(
      'calls next with UnauthorizedError when token invalid',
      async () => {
        vi.spyOn(tokenService, 'consumeToken').mockResolvedValue(null);

        const req = mockRequest('bad-token');
        const res = mockResponse();

        await verifyToken(req as any, res as any, next);

        expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
});
