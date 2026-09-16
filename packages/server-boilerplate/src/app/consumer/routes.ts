import { Router } from 'express';
import { validateRequestsMiddleware } from '@/middleware/index.js';
import { getVerifyTokenSchema, } from './validation.schemas.js';
import { verifyTokenController } from './verify-token.controller.js';


export const consumerRouter = (): Router => {
  const router = Router();

  router
    .route('/verify')
    .get(validateRequestsMiddleware(getVerifyTokenSchema), verifyTokenController);

  return router;
}
