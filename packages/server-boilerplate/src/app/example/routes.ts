import { Router } from 'express';
import { exampleController, } from './example.controller.js';


export const exampleRouter = (): Router => {
  const router = Router();

  router.route('/').get(exampleController);

  return router;
} 
