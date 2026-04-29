import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const usePasswordStore = create(
  persist(
    (set) => ({
      passwords: [], // Will store encrypted objects { id, title, username, encryptedData, iv }
      isVaultUnlocked: false, // In-memory only, never persisted
      
      addPassword: (pwd) => set((state) => ({ 
        passwords: [{ id: Date.now().toString(), ...pwd }, ...state.passwords] 
      })),
      
      deletePassword: (id) => set((state) => ({
        passwords: state.passwords.filter(p => p.id !== id)
      })),
      
      setVaultUnlocked: (status) => set({ isVaultUnlocked: status })
    }),
    {
      name: 'password-vault-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ passwords: state.passwords }), // Only persist passwords, NOT unlocked state
    }
  )
)
