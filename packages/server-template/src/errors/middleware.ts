import type { NextFunction, Request, Response } from 'express';
import { logger } from '@/config/index.js';
import { ErrorCodes } from './constants.js';
import { AppError } from './errors.js';


/**
 * Express error handling middleware that processes errors and sends appropriate HTTP responses.
 */
export const errorMiddleware = (
  error: unknown,
  request: Request,
  response: Response,
  _: NextFunction,
): void => {

  if (error instanceof AppError) {
    // internal
    request.log?.error(
      { error: error, },
      error.message,
    );

    // sent as response
    response.status(error.statusCode).json({
      error: {
        code: ErrorCodes.internal.code,
        message: ErrorCodes.internal.message,
      },
    });
    return;
  }
  
  // internal
  logger.error({ err: error }, ErrorCodes.unexpected.message);

  // sent as response
  response.status(500).json({
    error: {
      code: ErrorCodes.internal.code,
      message: ErrorCodes.internal.message,
    },
  });
  return;
}
