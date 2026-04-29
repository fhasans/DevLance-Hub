import { Wrench, Clock, CreditCard, Kanban, Calendar, KeyRound } from 'lucide-react';

const pinnedTools = [
  { name: 'Time Tracker', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'JSON Formatter', icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'Kanban Board', icon: Kanban, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Fathin!</h1>
        <p className="text-muted-foreground">
          Here's a quick overview of your tools and productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pinned Tools Widget */}
        <div className="col-span-1 md:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Pinned Favorites
            </h2>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Manage
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pinnedTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <button 
                  key={idx}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-secondary/50 transition-all group"
                >
                  <div className={`p-3 rounded-full ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">{tool.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Storage Widget */}
        <div className="col-span-1 bg-card rounded-xl border border-border p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Local Storage</h2>
            <p className="text-sm text-muted-foreground mb-4">Data is saved on your device.</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usage</span>
                <span className="font-medium">120 KB / 5 MB</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-blue-500 w-[5%] rounded-full"></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 italic">
            No data is sent to external servers. All processing is offline.
          </p>
        </div>
      </div>
    </div>
  );
}
