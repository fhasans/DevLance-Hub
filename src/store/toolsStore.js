import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Wrench, Clock, Kanban, Regex, Code, Database, FileText, Calendar, CheckSquare, Users } from 'lucide-react';

// Centralized tool definitions
export const ALL_TOOLS = [
  { id: 'time-tracker', name: 'Time Tracker', iconName: 'Clock', color: 'text-blue-500', bg: 'bg-blue-500/10', category: 'freelance' },
  { id: 'kanban-board', name: 'Kanban Board', iconName: 'Kanban', color: 'text-purple-500', bg: 'bg-purple-500/10', category: 'productivity' },
  { id: 'json-formatter', name: 'JSON Formatter', iconName: 'Wrench', color: 'text-orange-500', bg: 'bg-orange-500/10', category: 'developer' },
  { id: 'regex-tester', name: 'Regex Tester', iconName: 'Regex', color: 'text-red-500', bg: 'bg-red-500/10', category: 'developer' },
  { id: 'code-vault', name: 'Code Snippet Vault', iconName: 'Code', color: 'text-green-500', bg: 'bg-green-500/10', category: 'developer' },
  { id: 'dummy-data', name: 'Dummy Data Gen', iconName: 'Database', color: 'text-cyan-500', bg: 'bg-cyan-500/10', category: 'developer' },
  { id: 'invoice-gen', name: 'Invoice Gen', iconName: 'FileText', color: 'text-indigo-500', bg: 'bg-indigo-500/10', category: 'freelance' },
  { id: 'client-crm', name: 'Client CRM', iconName: 'Users', color: 'text-teal-500', bg: 'bg-teal-500/10', category: 'freelance' },
];

export const useToolsStore = create(
  persist(
    (set) => ({
      pinnedToolsIds: ['time-tracker', 'json-formatter', 'kanban-board'], // default pins
      togglePinTool: (toolId) => set((state) => {
        const isPinned = state.pinnedToolsIds.includes(toolId);
        if (isPinned) {
          return { pinnedToolsIds: state.pinnedToolsIds.filter(id => id !== toolId) };
        } else {
          return { pinnedToolsIds: [...state.pinnedToolsIds, toolId] };
        }
      }),
    }),
    {
      name: 'tools-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
