import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useClientCrmStore = create(
  persist(
    (set) => ({
      clients: [
        {
          id: '1',
          name: 'Acme Corp',
          contactPerson: 'John Doe',
          email: 'john@acme.com',
          phone: '+1 555-0198',
          status: 'active',
          notes: 'Important enterprise client.',
          lastContact: new Date().toISOString()
        }
      ],
      addClient: (client) => set((state) => ({ 
        clients: [{ id: Date.now().toString(), lastContact: new Date().toISOString(), ...client }, ...state.clients] 
      })),
      updateClient: (id, updates) => set((state) => ({
        clients: state.clients.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteClient: (id) => set((state) => ({
        clients: state.clients.filter(c => c.id !== id)
      })),
    }),
    {
      name: 'client-crm-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
