import type { Express } from 'express';
import type { Server } from 'http';


export type AppAttributes = {
  app: Express;
  server: Server;
  endpoint: string;
  port: number;
  shutdown: () => Promise<void>;
};
