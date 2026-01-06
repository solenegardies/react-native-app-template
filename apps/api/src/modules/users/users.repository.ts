import { prisma } from '../../lib/prisma.js';
import type { User } from '@prisma/client';

export const usersRepository = {
  findBySupabaseId: async (supabaseId: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { supabaseId },
    });
  },

  findByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create: async (data: {
    supabaseId: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
  }): Promise<User> => {
    return prisma.user.create({
      data,
    });
  },

  update: async (
    supabaseId: string,
    data: {
      displayName?: string;
      avatarUrl?: string;
    }
  ): Promise<User> => {
    return prisma.user.update({
      where: { supabaseId },
      data,
    });
  },

  upsert: async (data: {
    supabaseId: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
  }): Promise<User> => {
    return prisma.user.upsert({
      where: { supabaseId: data.supabaseId },
      create: data,
      update: {
        email: data.email,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
      },
    });
  },
};
