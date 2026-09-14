import type { Request, Response, NextFunction, } from 'express';


export const healthController = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
): Promise<void> => {
  
  response
    .status(200)
    .json({
      status: 'ok',
      time: new Date().toISOString(),
    });
  return;
}
