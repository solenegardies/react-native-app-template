import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, register, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
}
