import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useCodeVaultStore = create(
  persist(
    (set) => ({
      snippets: [
        { 
          id: '1', 
          title: 'React UseEffect Fetch', 
          language: 'javascript', 
          code: 'useEffect(() => {\n  const fetchData = async () => {\n    const response = await fetch("https://api.example.com/data");\n    const result = await response.json();\n    setData(result);\n  };\n  fetchData();\n}, []);',
          tags: ['react', 'fetch']
        }
      ],
      addSnippet: (snippet) => set((state) => ({ 
        snippets: [{ id: Date.now().toString(), ...snippet }, ...state.snippets] 
      })),
      deleteSnippet: (id) => set((state) => ({
        snippets: state.snippets.filter(s => s.id !== id)
      })),
    }),
    {
      name: 'code-vault-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
