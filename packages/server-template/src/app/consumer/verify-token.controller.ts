import type { Response, NextFunction, } from 'express';
import type { ReqQueryVerifyToken } from './types.js';
import { UnauthorizedError } from '@/errors/index.js';
import { consumeToken, issueToken } from './tokens.service.js';
import * as constants from './constants.js';


export const verifyToken = async (
  request: ReqQueryVerifyToken,
  response: Response,
  next: NextFunction,
) => {
  const { token, } = request.query;

  try {
    const id = await consumeToken(constants.otp_token_prefix, token);
    if (!id) throw new UnauthorizedError('Token is invalid or expired');
  
    const skibidiToken = await issueToken(constants.skbd_token_prefix, id, constants.skbd_token_ttl_sec);
  
    response.status(200).json({ skbd_token: skibidiToken, });
    return;
    
  } catch (error) {
    return next(error);
  }
}
