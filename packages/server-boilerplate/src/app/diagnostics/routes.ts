import { Router } from 'express';
import { healthController } from './health.controller.js';


export const diagnosticsRouter = (): Router => {
  const router = Router();

  router.route('/health').get(healthController);

  return router;
} 
