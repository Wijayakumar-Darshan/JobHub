import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:  null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => {
        set({ user: null, token: null })
        localStorage.removeItem('sl-jobbank-auth')
      },

      isAuthenticated: () => !!get().token,

      isStudent:    () => get().user?.role === 'STUDENT',
      isCounselor:  () => get().user?.role === 'COUNSELOR',
      isAdmin:      () => get().user?.role === 'SUPER_ADMIN',

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    {
      name: 'sl-jobbank-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)


