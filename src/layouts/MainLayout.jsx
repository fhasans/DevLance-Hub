import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useProfileStore } from '../store/profileStore';
import { Moon, Sun, Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProfileSettingsModal from '../components/ProfileSettingsModal';

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

  const handleLinkClick = () => setIsMobileMenuOpen(false);
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-card">
        <Sidebar />
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
        className={`fixed top-0 left-0 z-50 flex flex-col h-full w-72 bg-card border-r border-border shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar onLinkClick={handleLinkClick} />
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 shrink-0 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 z-10">
          {/* Mobile: Hamburger + Logo */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-1 rounded-md hover:bg-secondary transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <img src="logo.png" alt="DevLance Hub" className="w-6 h-6 rounded-md" />
              <span className="font-bold text-lg">DevLance</span>
            </div>
          </div>

          {/* Right actions */}
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
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-secondary/20">
          <Outlet />
        </main>
      </div>

      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
