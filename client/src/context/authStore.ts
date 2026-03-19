import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '../app/types';
import { MOCK_USERS } from '../app/data';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string, role?: Role) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 800));

        // Find user by role for demo, or by email
        let user = MOCK_USERS.find(u => u.email === email);
        if (!user && role) {
          user = MOCK_USERS.find(u => u.role === role);
        }
        if (!user) {
          user = MOCK_USERS[4]; // default team member
        }

        set({
          user,
          token: `mock_token_${user.id}`,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updates) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...updates } });
        }
      },
    }),
    {
      name: 'flowboard-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
