import { useState, useEffect } from 'react';
import { useTimeTrackerStore } from '../../store/timeTrackerStore';
import { Play, Square, Save, Trash2, Clock } from 'lucide-react';

export default function TimeTracker() {
  const { logs, addLog, deleteLog } = useTimeTrackerStore();
  
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const handleSave = () => {
    if (seconds === 0) return;
    
    const newLog = {
      id: Date.now().toString(),
      project: projectName || 'Untitled Project',
      duration: seconds,
      date: new Date().toISOString(),
    };
    
    addLog(newLog);
    setSeconds(0);
    setIsActive(false);
    setProjectName('');
  };

  const formatTime = (totalSeconds) => {
    const getSeconds = `0${(totalSeconds % 60)}`.slice(-2);
    const minutes = `${Math.floor(totalSeconds / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(totalSeconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Clock className="w-8 h-8 text-blue-500" /> Time Tracker
        </h1>
        <p className="text-muted-foreground">
          Track your freelance work hours offline.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <label className="text-sm font-medium mb-1 block">Project / Task Name</label>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Website Redesign"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          
          <div className="w-full md:w-1/2 flex items-center justify-between md:justify-end gap-6">
            <div className="text-5xl font-mono tracking-wider font-semibold text-primary">
              {formatTime(seconds)}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={toggle}
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white transition-colors ${isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary hover:bg-primary/90'}`}
              >
                {isActive ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>
              
              {!isActive && seconds > 0 && (
                <button 
                  onClick={handleSave}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
                  title="Save Log"
                >
                  <Save className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <h2 className="font-semibold text-lg">Recent Logs</h2>
        </div>
        
        {logs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No time logs yet. Start the timer to track your work.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map(log => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                <div>
                  <h3 className="font-medium text-foreground">{log.project}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.date).toLocaleDateString()} at {new Date(log.date).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm bg-secondary px-2 py-1 rounded">
                    {formatTime(log.duration)}
                  </span>
                  <button 
                    onClick={() => deleteLog(log.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
