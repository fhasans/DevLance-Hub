import { useState } from 'react';
import { useKanbanStore } from '../../store/kanbanStore';
import { LayoutKanban, Plus, Trash2, GripVertical } from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-500' },
  { id: 'doing', title: 'Doing', color: 'bg-blue-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' }
];

export default function KanbanBoard() {
  const { tasks, addTask, updateTaskStatus, deleteTask } = useKanbanStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), 'todo');
    setNewTaskTitle('');
  };

  const handleDragStart = (e, id) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to prevent the dragged element from disappearing
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTaskId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTaskId) {
      updateTaskStatus(draggedTaskId, status);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <LayoutKanban className="w-8 h-8 text-purple-500" /> Kanban Board
        </h1>
        <p className="text-muted-foreground">
          Manage your tasks simply with drag and drop.
        </p>
      </div>

      <form onSubmit={handleAddTask} className="flex gap-2 shrink-0 max-w-md">
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button 
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden pb-4">
        {COLUMNS.map(column => (
          <div 
            key={column.id}
            className="flex flex-col bg-card/50 border border-border rounded-xl overflow-hidden h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="p-3 border-b border-border bg-card flex items-center gap-2 font-semibold">
              <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
              {column.title}
              <span className="ml-auto text-xs bg-secondary px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {tasks.filter(t => t.status === column.id).map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  className="bg-card border border-border p-3 rounded-lg shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground/50 mt-0.5 shrink-0 group-hover:text-muted-foreground transition-colors" />
                      <p className="text-sm leading-tight mt-0.5">{task.title}</p>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {tasks.filter(t => t.status === column.id).length === 0 && (
                <div className="h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
