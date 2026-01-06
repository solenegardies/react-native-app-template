import type { ApiResponse } from '@react-native-app/shared-types';

export function success<T>(data: T): ApiResponse<T> {
  return { data };
}
