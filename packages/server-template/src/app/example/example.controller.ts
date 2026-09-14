import type { Request, Response, NextFunction, } from 'express';


export const exampleController = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
): Promise<void> => {
  
  response
    .status(200)
    .json({
      message: 'rocketship, rocketship',
      time: new Date().toISOString(),
    });
  return;
}
