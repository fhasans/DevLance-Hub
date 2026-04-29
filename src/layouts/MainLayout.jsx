import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useProfileStore } from '../store/profileStore';
import { Moon, Sun, Menu, LayoutDashboard, Coffee, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import { ALL_TOOLS } from '../store/toolsStore';

// Reusable nav content to avoid duplication between desktop & mobile
function SidebarContent({ onLinkClick }) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 shrink-0">
        <div className="flex items-center gap-3">
          <img src="logo.png" alt="DevLance Hub" className="w-8 h-8 rounded-lg" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            DevLance Hub
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <Link
          to="/"
          onClick={onLinkClick}
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'}`}
        >
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
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? tool.color : ''}`} />
              <span className="text-sm truncate">{tool.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border shrink-0">
        <a
          href="https://saweria.co/Fhasans"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-[#FFDD00] text-black hover:bg-[#FFDD00]/90 transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
        >
          <Coffee className="w-5 h-5" />
          Trakteer via Saweria
        </a>
      </div>
    </div>
  );
}

export default function MainLayout() {
  const { theme, toggleTheme } = useThemeStore();
  const profile = useProfileStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Close mobile menu on route change
  const handleLinkClick = () => setIsMobileMenuOpen(false);

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen flex bg-background text-foreground">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent onLinkClick={handleLinkClick} />
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Navbar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-md hover:bg-secondary transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <img src="logo.png" alt="DevLance Hub" className="w-6 h-6 rounded-md" />
              <span className="font-bold text-lg">DevLance</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun className="w-5 h-5 text-yellow-400" />
                : <Moon className="w-5 h-5 text-slate-700" />
              }
            </button>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all"
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
