import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const usePomodoroStore = create(
  persist(
    (set) => ({
      settings: {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4
      },
      stats: {
        totalSessionsCompleted: 0,
        totalWorkMinutes: 0
      },
      updateSettings: (newSettings) => set((state) => ({ 
        settings: { ...state.settings, ...newSettings } 
      })),
      addCompletedSession: (minutes) => set((state) => ({
        stats: {
          totalSessionsCompleted: state.stats.totalSessionsCompleted + 1,
          totalWorkMinutes: state.stats.totalWorkMinutes + minutes
        }
      })),
    }),
    {
      name: 'pomodoro-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
