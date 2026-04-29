import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useKanbanStore = create(
  persist(
    (set) => ({
      tasks: [
        { id: '1', title: 'Setup Project', status: 'done' },
        { id: '2', title: 'Build Dashboard', status: 'doing' },
        { id: '3', title: 'Implement Kanban', status: 'todo' },
      ],
      addTask: (title, status = 'todo') => set((state) => ({ 
        tasks: [...state.tasks, { id: Date.now().toString(), title, status }] 
      })),
      updateTaskStatus: (id, status) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, status } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
    }),
    {
      name: 'kanban-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
