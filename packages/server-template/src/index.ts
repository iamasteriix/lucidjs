import { logger } from './config/logger.js';
import { createApp } from './app/index.js';

let onShutdown: () => Promise<void>;


const handleShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received, shutting down application.`);
  await onShutdown?.();
  process.exit(0);
};


const handleUnhandledRejection = async (reason: unknown) => {
  // `pino` has special handling for the `err` keyword
  logger.fatal({ err: reason }, 'Unhandled promise rejection');
  await onShutdown?.();
  process.exit(1);
}


const handleUncaughtException = async (error: unknown) => {
  logger.fatal({ err: error, }, 'Uncaught exception');
  await onShutdown?.();
  process.exit(1);  // [You must exit after an uncaught exception](https://node.readthedocs.io/en/latest/api/process/#event-uncaughtexception)
}


const main = async () => {
  const app = await createApp();
  app.server.listen({ port: app.port, }); // listen for connections

  onShutdown = async () => {
    try {
      await app.shutdown();
    } catch (error) {
      logger.fatal({ err: error }, 'Error shutting down.');
    } finally {
      process.exit(0);
    }
  }

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('unhandledRejection', handleUnhandledRejection);
  process.on('uncaughtException', handleUncaughtException);

  logger.info(`Server ready at port ${app.port}.`);
}


main(); // start program
