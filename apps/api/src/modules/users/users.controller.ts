import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { usersService } from './users.service.js';
import { success } from '../../lib/response.js';
import { UpdateUserDto } from '@react-native-app/dto';

export const usersController = Router();

usersController.use(authMiddleware);

usersController.get('/me', async (req, res, next) => {
  try {
    const user = await usersService.getMe(req.user!.sub, req.user!.email);
    res.json(success(user));
  } catch (error) {
    next(error);
  }
});

usersController.patch('/me', async (req, res, next) => {
  try {
    const data = UpdateUserDto.parse(req.body);
    const user = await usersService.updateMe(req.user!.sub, data);
    res.json(success(user));
  } catch (error) {
    next(error);
  }
});
