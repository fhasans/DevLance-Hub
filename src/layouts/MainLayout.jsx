import { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { Moon, Sun, Menu, LayoutDashboard } from 'lucide-react';
import clsx from 'clsx';

export default function MainLayout() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

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
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          {/* Menu items will go here */}
        </nav>
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              F
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-secondary/20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
