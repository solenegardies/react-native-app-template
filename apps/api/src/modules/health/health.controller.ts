import { Router } from 'express';
import { success } from '../../lib/response.js';

export const healthController = Router();

healthController.get('/', (_req, res) => {
  res.json(
    success({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  );
});
