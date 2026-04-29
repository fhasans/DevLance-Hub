import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useTimeTrackerStore = create(
  persist(
    (set) => ({
      logs: [],
      addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
      deleteLog: (id) => set((state) => ({ logs: state.logs.filter(l => l.id !== id) })),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'time-tracker-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
