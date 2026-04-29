import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useProfileStore } from '../store/profileStore';
import { Moon, Sun, Menu, LayoutDashboard, Coffee } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import { ALL_TOOLS } from '../store/toolsStore';

export default function MainLayout() {
  const { theme, toggleTheme } = useThemeStore();
  const profile = useProfileStore();
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Initial for avatar fallback
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="DevLance Hub" className="w-8 h-8 rounded-lg" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              DevLance Hub
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <div className="pt-4 pb-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Tools</p>
          </div>
          
          {ALL_TOOLS.map(tool => {
            const Icon = LucideIcons[tool.iconName] || LucideIcons.HelpCircle;
            const isActive = location.pathname === `/${tool.id}`;
            return (
              <Link 
                key={tool.id}
                to={`/${tool.id}`} 
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? tool.color : ''}`} />
                <span className="text-sm">{tool.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <a 
            href="https://www.buymeacoffee.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-[#FFDD00] text-black hover:bg-[#FFDD00]/90 transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
          >
            <Coffee className="w-5 h-5" />
            Buy me a coffee
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center gap-4 md:hidden">
            <button className="p-2 -ml-2 rounded-md hover:bg-secondary">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="DevLance Hub" className="w-6 h-6 rounded-md" />
              <span className="font-bold text-lg">DevLance</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
            
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all"
              aria-label="Open profile settings"
            >
              {profile.avatar && profile.avatar !== '/logo.png' ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{getInitial(profile.name)}</span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-secondary/20 relative">
          <Outlet />
        </div>
      </main>

      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </div>
  );
}
