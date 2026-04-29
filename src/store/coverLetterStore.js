import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useCoverLetterStore = create(
  persist(
    (set) => ({
      drafts: [
        {
          id: '1',
          title: 'Frontend Developer - Tech Corp',
          content: 'Dear Hiring Manager,\n\nI am writing to express my interest in the Frontend Developer position at Tech Corp...',
          lastModified: new Date().toISOString()
        }
      ],
      saveDraft: (draft) => set((state) => {
        const exists = state.drafts.find(d => d.id === draft.id);
        if (exists) {
          return { drafts: state.drafts.map(d => d.id === draft.id ? { ...draft, lastModified: new Date().toISOString() } : d) };
        } else {
          return { drafts: [{ ...draft, id: Date.now().toString(), lastModified: new Date().toISOString() }, ...state.drafts] };
        }
      }),
      deleteDraft: (id) => set((state) => ({
        drafts: state.drafts.filter(d => d.id !== id)
      })),
    }),
    {
      name: 'cover-letter-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
