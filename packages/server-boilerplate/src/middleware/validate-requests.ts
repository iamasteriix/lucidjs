import type { Request, Response, NextFunction, } from 'express';
import type { ValidationSchemaOptions, } from './types.js';
import { ValidationError as YupValidationError } from 'yup';
import { ValidationError, } from '@/errors/index.js';
import { request_generics } from './constants.js';


export const validateRequestsMiddleware = (input: ValidationSchemaOptions) => {
  return async (
    request: Request,
    _: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      for (const generic of request_generics) {
        const schema = input[generic];
        if (schema) {
          await schema.validate(request[generic], {
            strict: true,
            stripUnknown: true,
          });
        }
      }
      return next();
    } catch (error: unknown) {
      if (error instanceof YupValidationError) return next(new ValidationError(error.message));
      return next(error);
    }
  }
}
