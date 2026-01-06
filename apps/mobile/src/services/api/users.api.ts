import { apiClient } from './client';
import type { UserProfile } from '@react-native-app/shared-types';
import type { UpdateUserDto } from '@react-native-app/dto';

export const usersApi = {
  getMe: () => apiClient.get<UserProfile>('/users/me'),

  updateMe: (data: UpdateUserDto) => apiClient.patch<UserProfile>('/users/me', data),
};
