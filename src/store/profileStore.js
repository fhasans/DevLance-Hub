import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useProfileStore = create(
  persist(
    (set) => ({
      name: 'Fathin', // default name
      avatar: '/logo.png',
      currency: 'IDR',
      updateProfile: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
