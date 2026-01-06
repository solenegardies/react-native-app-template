import { create } from 'zustand';
import { supabase } from '@/services/auth/supabase';
import type { AuthUser } from '@react-native-app/shared-types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email ?? '',
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email ?? '',
            },
            isAuthenticated: true,
          });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      set({
        user: {
          id: data.user.id,
          email: data.user.email ?? '',
        },
        isAuthenticated: true,
      });
    }
  },

  register: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      set({
        user: {
          id: data.user.id,
          email: data.user.email ?? '',
        },
        isAuthenticated: true,
      });
    }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, isAuthenticated: false });
  },
}));
