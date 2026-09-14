import type { Request } from 'express';
import { pinoHttp } from 'pino-http';
import { env } from './env.js';
import pino from 'pino';


// Pino logs are NDJSON, which is standard for production, but unyeildy for development
export const logger = pino({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV !== 'producton'
    ? {
        target: 'pino-pretty',
        options: { colorize: true, },
      }
    : undefined
});


export const requestLogger = pinoHttp({
  logger,
  autoLogging: false,
  serializers: {
    req: (request: Request) => ({
      id: request.id,
      method: request.method,
      url: request.url,
      query: request.query,
      params: request.params,
    }),
  },
});
