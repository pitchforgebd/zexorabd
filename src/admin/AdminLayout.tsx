import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Newspaper,
  Home,
  LayoutTemplate,
  Mail,
  Briefcase,
  Search,
  Settings,
  FileText,
  LogOut,
} from 'lucide-react';
import { useAuth } from './AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/settings', label: 'Website Settings', icon: Settings },
  { to: '/admin/pages', label: 'Static Pages', icon: FileText },
  { to: '/admin/divisions', label: 'Divisions & Products', icon: Boxes },
  { to: '/admin/media', label: 'News & Media', icon: Newspaper },
  { to: '/admin/homepage', label: 'Homepage & Suppliers', icon: Home },
  { to: '/admin/sections', label: 'Page Sections', icon: LayoutTemplate },
  { to: '/admin/career-applications', label: 'Career Applications', icon: Briefcase },
  { to: '/admin/contact-messages', label: 'Contact Messages', icon: Mail },
  { to: '/admin/seo', label: 'SEO', icon: Search },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-light-gray flex">
      <aside className="w-64 bg-primary-dark text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <p className="font-bold text-lg leading-tight">Zexora Admin</p>
          <p className="text-xs text-white/50">Content Management</p>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-blue text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <NavLink
            to="/admin/account"
            className={({ isActive }) =>
              `block px-3 py-2 mb-2 rounded-lg transition-colors ${isActive ? 'bg-white/10' : 'hover:bg-white/10'}`
            }
          >
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/50 truncate">{user?.email}</p>
          </NavLink>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
