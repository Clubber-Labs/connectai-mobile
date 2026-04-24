import { create } from 'zustand'

type AuthState = {
  userId: string | null
  isAuthenticated: boolean
  hydrated: boolean
  setUser: (userId: string) => void
  logout: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  userId: null,
  isAuthenticated: false,
  hydrated: false,
  setUser: userId => set({ userId, isAuthenticated: true }),
  logout: () => set({ userId: null, isAuthenticated: false }),
  setHydrated: () => set({ hydrated: true }),
}))
