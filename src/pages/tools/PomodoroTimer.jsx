import { useState, useEffect, useRef } from 'react';
import { usePomodoroStore } from '../../store/pomodoroStore';
import { Timer, Play, Pause, RotateCcw, Settings, CheckCircle2 } from 'lucide-react';

export default function PomodoroTimer() {
  const { settings, stats, updateSettings, addCompletedSession } = usePomodoroStore();
  
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      handleComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Update time when mode changes manually or via settings
  useEffect(() => {
    if (!isActive) {
      if (mode === 'work') setTimeLeft(settings.workDuration * 60);
      if (mode === 'shortBreak') setTimeLeft(settings.shortBreakDuration * 60);
      if (mode === 'longBreak') setTimeLeft(settings.longBreakDuration * 60);
    }
  }, [mode, settings]);

  const handleComplete = () => {
    setIsActive(false);
    
    // Play sound (optional)
    try {
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
      audio.play().catch(e => console.log('Audio play failed', e));
    } catch(e) {}

    if (mode === 'work') {
      addCompletedSession(settings.workDuration);
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);
      
      if (newSessionCount % settings.sessionsBeforeLongBreak === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('work');
    }
  };

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    if (mode === 'work') setTimeLeft(settings.workDuration * 60);
    if (mode === 'shortBreak') setTimeLeft(settings.shortBreakDuration * 60);
    if (mode === 'longBreak') setTimeLeft(settings.longBreakDuration * 60);
  };

  const saveSettings = () => {
    updateSettings(tempSettings);
    setShowSettings(false);
    setIsActive(false);
    // Effects will naturally update timeLeft because settings changed
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    let total = settings.workDuration * 60;
    if (mode === 'shortBreak') total = settings.shortBreakDuration * 60;
    if (mode === 'longBreak') total = settings.longBreakDuration * 60;
    
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Timer className="w-8 h-8 text-rose-500" /> Pomodoro Timer
        </h1>
        <p className="text-muted-foreground">
          Boost your productivity with the Pomodoro technique.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-8 flex flex-col items-center justify-center relative overflow-hidden">
            
            <div className="absolute top-4 right-4">
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="flex bg-secondary/50 p-1 rounded-lg mb-8">
              <button onClick={() => {setMode('work'); setIsActive(false);}} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'work' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>Focus</button>
              <button onClick={() => {setMode('shortBreak'); setIsActive(false);}} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'shortBreak' ? 'bg-blue-500 text-white shadow' : 'text-muted-foreground hover:text-foreground'}`}>Short Break</button>
              <button onClick={() => {setMode('longBreak'); setIsActive(false);}} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'longBreak' ? 'bg-green-500 text-white shadow' : 'text-muted-foreground hover:text-foreground'}`}>Long Break</button>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="stroke-secondary fill-none" strokeWidth="2"></circle>
                <circle 
                  cx="50" cy="50" r="45" 
                  className={`fill-none transition-all duration-1000 ease-linear ${mode === 'work' ? 'stroke-primary' : mode === 'shortBreak' ? 'stroke-blue-500' : 'stroke-green-500'}`} 
                  strokeWidth="4" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * getProgress()) / 100}
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-6xl font-bold font-mono tracking-tighter">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-widest">
                  {mode === 'work' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-10">
              <button 
                onClick={toggle}
                className={`w-16 h-16 flex items-center justify-center rounded-full text-white transition-all transform hover:scale-105 shadow-lg ${isActive ? 'bg-orange-500' : mode === 'work' ? 'bg-primary' : mode === 'shortBreak' ? 'bg-blue-500' : 'bg-green-500'}`}
              >
                {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
              <button 
                onClick={reset}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-8 flex gap-2">
              {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < (sessionCount % settings.sessionsBeforeLongBreak) ? 'bg-primary' : 'bg-secondary border border-border'}`}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-4 border-b border-border pb-2">Your Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Completed Sessions</span>
                </div>
                <span className="text-xl font-bold">{stats.totalSessionsCompleted}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Focus Minutes</span>
                </div>
                <span className="text-xl font-bold">{stats.totalWorkMinutes}</span>
              </div>
            </div>
          </div>

          {showSettings && (
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-top-4">
              <h2 className="font-semibold mb-4 border-b border-border pb-2">Settings (Minutes)</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Focus Duration</label>
                  <input type="number" min="1" max="60" value={tempSettings.workDuration} onChange={(e) => setTempSettings({...tempSettings, workDuration: parseInt(e.target.value)||25})} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Short Break</label>
                  <input type="number" min="1" max="30" value={tempSettings.shortBreakDuration} onChange={(e) => setTempSettings({...tempSettings, shortBreakDuration: parseInt(e.target.value)||5})} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Long Break</label>
                  <input type="number" min="1" max="60" value={tempSettings.longBreakDuration} onChange={(e) => setTempSettings({...tempSettings, longBreakDuration: parseInt(e.target.value)||15})} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Sessions before Long Break</label>
                  <input type="number" min="1" max="10" value={tempSettings.sessionsBeforeLongBreak} onChange={(e) => setTempSettings({...tempSettings, sessionsBeforeLongBreak: parseInt(e.target.value)||4})} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                </div>
                <button onClick={saveSettings} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md text-sm font-medium transition-colors mt-2">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
