import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useMeetingStore = create(
  persist(
    (set) => ({
      meetings: [],
      addMeeting: (meeting) => set((state) => ({ 
        meetings: [{ id: Date.now().toString(), date: new Date().toISOString(), ...meeting }, ...state.meetings] 
      })),
      updateMeeting: (id, updates) => set((state) => ({
        meetings: state.meetings.map(m => m.id === id ? { ...m, ...updates } : m)
      })),
      deleteMeeting: (id) => set((state) => ({
        meetings: state.meetings.filter(m => m.id !== id)
      })),
    }),
    {
      name: 'meeting-minutes-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
