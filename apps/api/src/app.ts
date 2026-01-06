import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { healthController } from './modules/health/health.controller.js';
import { usersController } from './modules/users/users.controller.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(loggerMiddleware);

  app.use('/health', healthController);
  app.use('/users', usersController);

  app.use(errorMiddleware);

  return app;
}
