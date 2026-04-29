import { useState, useEffect } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useToolsStore, ALL_TOOLS } from '../store/toolsStore';
import { getLocalStorageUsage } from '../utils/storageUtils';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { Settings } from 'lucide-react';

export default function Dashboard() {
  const profile = useProfileStore();
  const { pinnedToolsIds, togglePinTool } = useToolsStore();
  
  const [storageData, setStorageData] = useState({ usedKB: 0, maxKB: 5120, percentage: 0, isNearLimit: false });
  const [isManagingPins, setIsManagingPins] = useState(false);

  useEffect(() => {
    // Update storage usage on mount
    setStorageData(getLocalStorageUsage());
    
    // Optional: add interval to occasionally check storage if it changes outside react
    const interval = setInterval(() => setStorageData(getLocalStorageUsage()), 5000);
    return () => clearInterval(interval);
  }, []);

  const pinnedTools = ALL_TOOLS.filter(t => pinnedToolsIds.includes(t.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile.name}!</h1>
        <p className="text-muted-foreground">
          Here's a quick overview of your tools and productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pinned Tools Widget */}
        <div className="col-span-1 lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Pinned Favorites
            </h2>
            <button 
              onClick={() => setIsManagingPins(!isManagingPins)}
              className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4" />
              {isManagingPins ? 'Done' : 'Manage'}
            </button>
          </div>
          
          {!isManagingPins ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pinnedTools.length > 0 ? (
                pinnedTools.map((tool) => {
                  const Icon = LucideIcons[tool.iconName] || LucideIcons.HelpCircle;
                  return (
                    <Link 
                      key={tool.id}
                      to={`/${tool.id}`}
                      className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-secondary/50 transition-all group"
                    >
                      <div className={`p-3 rounded-full ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-center">{tool.name}</span>
                    </Link>
                  )
                })
              ) : (
                <div className="col-span-full py-8 text-center text-muted-foreground text-sm border border-dashed rounded-lg">
                  No tools pinned. Click 'Manage' to add your favorites.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">Select the tools you want to appear on your dashboard.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_TOOLS.map((tool) => {
                  const isPinned = pinnedToolsIds.includes(tool.id);
                  const Icon = LucideIcons[tool.iconName] || LucideIcons.HelpCircle;
                  return (
                    <div 
                      key={tool.id}
                      onClick={() => togglePinTool(tool.id)}
                      className={`cursor-pointer flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${isPinned ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/50'}`}
                    >
                      <div className={`p-1.5 rounded-full ${isPinned ? tool.bg : 'bg-secondary'} ${isPinned ? tool.color : 'text-muted-foreground'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`font-medium ${isPinned ? 'text-foreground' : 'text-muted-foreground'}`}>{tool.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Storage Widget */}
        <div className="col-span-1 bg-card rounded-xl border border-border p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Local Storage</h2>
            <p className="text-sm text-muted-foreground mb-4">Data is saved safely on your device.</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usage</span>
                <span className="font-medium">{storageData.usedKB} KB / {storageData.maxKB / 1024} MB</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${storageData.isNearLimit ? 'bg-destructive' : 'bg-gradient-to-r from-primary to-blue-500'}`} 
                  style={{ width: `${storageData.percentage}%` }}
                ></div>
              </div>
              {storageData.isNearLimit && (
                <p className="text-xs text-destructive mt-1">Storage is almost full. You may need to clear some old data.</p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-6 italic bg-secondary/50 p-2 rounded-md border border-border/50">
            No data is sent to external servers. All processing is 100% offline.
          </p>
        </div>
      </div>
    </div>
  );
}
