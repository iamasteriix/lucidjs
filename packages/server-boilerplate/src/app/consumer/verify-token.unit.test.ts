import { describe, it, expect, vi, } from 'vitest';
import { verifyTokenController } from './verify-token.controller.js';
import { UnauthorizedError } from '@/errors/index.js';
import * as tokenService from './tokens.service.js';


describe(
  'verifyTokenController',
  () => {
    const mockReq = (token?: string) => ({ query: { token, } });
    const mockRes = () => {
      const res: any = {};
      res.statusCode = 0;
      res.body = null;
      res.status = vi.fn(code => {
        res.statusCode = code;
        return res;
      });
      res.json = vi.fn(payload => {
        res.body = payload;
      });
      return res;
    };
    const next = vi.fn();

    it(
      'responds with 200 ok and skbd_token when token valid',
      async () => {
        vi.spyOn(tokenService, 'consumeToken').mockResolvedValue('6b656570207570202d20303730207368616b65');
        vi.spyOn(tokenService, 'issueToken').mockResolvedValue('627574204920626520736b697070696e6720746f207468726565');

        const req = mockReq('74776f20697320626574746572207468616e206f6e65');
        const res = mockRes();
        await verifyTokenController(req as any, res as any, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ skbd_token: '627574204920626520736b697070696e6720746f207468726565' });
        expect(next).not.toHaveBeenCalled();
    });

    it(
      'responds with 401 UnauthorizedError when token invalid',
      async () => {
        vi.spyOn(tokenService, 'consumeToken').mockResolvedValue('');

        const req = mockReq('some-bad-token');
        const res = mockRes();
        await verifyTokenController(req as any, res as any, next);
        expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
});
