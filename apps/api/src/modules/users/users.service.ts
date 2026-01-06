import { usersRepository } from './users.repository.js';
import { toUserProfile } from './users.types.js';
import { AppError } from '../../middleware/error.middleware.js';
import type { UserProfile } from '@react-native-app/shared-types';
import type { UpdateUserDto } from '@react-native-app/dto';

export const usersService = {
  getMe: async (supabaseId: string, email: string): Promise<UserProfile> => {
    let user = await usersRepository.findBySupabaseId(supabaseId);

    if (!user) {
      user = await usersRepository.upsert({
        supabaseId,
        email,
      });
    }

    return toUserProfile(user);
  },

  updateMe: async (
    supabaseId: string,
    data: UpdateUserDto
  ): Promise<UserProfile> => {
    const user = await usersRepository.findBySupabaseId(supabaseId);

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const updated = await usersRepository.update(supabaseId, data);
    return toUserProfile(updated);
  },
};
