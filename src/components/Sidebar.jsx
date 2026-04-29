import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Coffee, Clock, Kanban, Wrench, Network, Regex, Code, 
  Database, FileText, Users, FileEdit, Timer, Calendar, KeyRound, HelpCircle 
} from 'lucide-react';
import { ALL_TOOLS } from '../store/toolsStore';

// Map tool icon names to actual Lucide components
const ICON_MAP = {
  Clock,
  Kanban,
  Wrench,
  Network,
  Regex,
  Code,
  Database,
  FileText,
  Users,
  FileEdit,
  Timer,
  Calendar,
  KeyRound,
};

export default function Sidebar({ onLinkClick }) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="p-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <img src="logo.png" alt="" className="w-full h-full rounded-lg" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            DevLance Hub
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <Link
          to="/"
          onClick={onLinkClick}
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            location.pathname === '/'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        <div className="pt-4 pb-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Tools</p>
        </div>

        {ALL_TOOLS.map(tool => {
          const Icon = ICON_MAP[tool.iconName] || HelpCircle;
          const isActive = location.pathname === `/${tool.id}`;
          return (
            <Link
              key={tool.id}
              to={`/${tool.id}`}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-secondary text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? tool.color : ''}`} />
              <span className="text-sm truncate">{tool.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Saweria Donation Button */}
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
