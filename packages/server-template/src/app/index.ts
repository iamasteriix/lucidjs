import type { Express } from 'express';
import type { Server } from 'http';
import type { AppAttributes } from './types.js';
import { createServer } from 'http';
import { env, logger, requestLogger, } from '@/config/index.js';
import { errorMiddleware, } from '@/errors/index.js';
import { createRouter } from './routes.js';
import express from 'express';


/**
 * Wires up middleware, routes, and starts app.
 */
const onStart = (app: Express): void => {
  logger.info('Initializing application.');

  // connect to db

  // wire up middleware
  app.use(requestLogger);

  // routing
  const router = createRouter();
  app.use('/', router);
}


/**
 * Initializes features that require successful server startup.
 */
const onReady = (app: Express): void => {
  // do all the things

  logger.info('Server live and accepting connections.');

  // handle errors
  app.use(errorMiddleware);
}


/**
 * Shuts the server down gracefully.
 */
const onShutdown = async (server: Server): Promise<void> => {
  logger.info('Shutting down.');

  // close db connections

  // close server
  await new Promise<void>(resolve => {
    server.close(() => {
      logger.info('Server closed.');
      resolve();
    });
  });
}


export const createApp = async (): Promise<AppAttributes> => {
  const app = express();
  const server = createServer(app);

  onStart(app);
  onReady(app);

  return {
    app,
    server,
    endpoint: env.ENDPOINT,
    port: env.PORT,
    shutdown: () => onShutdown(server),
  };
}
