import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Trophy, LayoutDashboard, UserCheck, Activity, CalendarCheck,
  Award, Shield, FileText, Bell, MessageSquare, Settings, LogOut,
  Sun, Moon, Menu, X, Search, ChevronRight, User, Dumbbell, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Toast from '../components/Common/Toast';
import api from '../services/api';

export default function AppLayout() {
  const { user, playerProfile, logout, loginAsDemoRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(2);
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
  }, [location.pathname]);

  // Load unread notifications count
  useEffect(() => {
    if (!user) return;
    api.get('/notifications').then(res => {
      if (res.success) {
        setUnreadNotifs(res.data.unreadCount || 0);
        setRecentNotifs(res.data.notifications?.slice(0, 4) || []);
      }
    }).catch(() => {});
  }, [user, location.pathname]);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/profile', icon: User },
    { label: 'Performance', path: '/performance', icon: Activity },
    { label: 'Training', path: '/training', icon: Dumbbell },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Competitions', path: '/competitions', icon: Trophy },
    { label: 'Achievements', path: '/achievements', icon: Award },
    { label: 'Fitness', path: '/fitness', icon: Shield },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifs },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const roleColors = {
    PLAYER: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    COACH: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    SPORTS_ADMIN: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    ADMIN: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row">
      <Toast />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700/80 sticky top-0 h-screen z-30">
        {/* App Logo */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-gray-900 dark:text-white leading-tight">ATHLETICS</h1>
              <p className="text-[10px] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">Self-Service Portal</p>
            </div>
          </div>
        </div>

        {/* User Card & Demo Switcher */}
        <div className="p-4 mx-3 my-3 bg-gray-50 dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={user?.email}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate text-gray-900 dark:text-white">
                {playerProfile?.full_name || user?.full_name || 'Vijay Kumar'}
              </p>
              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border ${roleColors[user?.role || 'PLAYER']}`}>
                {user?.role || 'PLAYER'}
              </span>
            </div>
          </div>

          {/* Quick Demo Switcher */}
          <div className="mt-3 pt-2 border-t border-gray-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Demo Role:</span>
            <div className="flex gap-1">
              <button
                onClick={() => loginAsDemoRole('PLAYER')}
                className={`px-1.5 py-0.5 rounded font-semibold transition ${user?.role === 'PLAYER' ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-slate-600'}`}
                title="Switch to Player View"
              >
                Player
              </button>
              <button
                onClick={() => loginAsDemoRole('COACH')}
                className={`px-1.5 py-0.5 rounded font-semibold transition ${user?.role === 'COACH' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-slate-600'}`}
                title="Switch to Coach View"
              >
                Coach
              </button>
              <button
                onClick={() => loginAsDemoRole('ADMIN')}
                className={`px-1.5 py-0.5 rounded font-semibold transition ${user?.role === 'ADMIN' ? 'bg-rose-600 text-white' : 'bg-gray-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-slate-600'}`}
                title="Switch to Admin View"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/60 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition border border-rose-200 dark:border-rose-900/50"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700/80 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight">VARSITY SPORTS</span>
            </div>
          </div>

          {/* Global Search Bar */}
          <form onSubmit={handleGlobalSearch} className="hidden sm:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search players, sports, training or competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-slate-900 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl outline-none transition text-gray-900 dark:text-white"
            />
          </form>

          {/* Top Nav Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                )}
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                )}
              </button>

              {/* Dropdown Menu */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 py-3 z-50 animate-fade-in">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100 dark:border-slate-700">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">Notifications</span>
                    <button
                      onClick={() => navigate('/notifications')}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-slate-700 max-h-64 overflow-y-auto">
                    {recentNotifs.length > 0 ? (
                      recentNotifs.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition cursor-pointer" onClick={() => navigate('/notifications')}>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{n.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-center text-xs text-gray-400">No new notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Header Link */}
            <div
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            >
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-emerald-500"
              />
              <span className="hidden lg:inline text-xs font-bold text-gray-800 dark:text-gray-200">
                {playerProfile?.full_name?.split(' ')[0] || 'Vijay'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-slate-700 flex justify-around items-center py-2 px-1 shadow-lg">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] font-medium transition ${isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/training"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] font-medium transition ${isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`
            }
          >
            <Dumbbell className="w-5 h-5" />
            <span>Training</span>
          </NavLink>

          <NavLink
            to="/performance"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] font-medium transition ${isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`
            }
          >
            <Activity className="w-5 h-5" />
            <span>Stats</span>
          </NavLink>

          <NavLink
            to="/competitions"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] font-medium transition ${isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`
            }
          >
            <Trophy className="w-5 h-5" />
            <span>Matches</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] font-medium transition ${isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`
            }
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>
        </nav>

        {/* Mobile Slide-out Drawer Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-800 h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-base tracking-tight">VARSITY SPORTS</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${
                          isActive
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>

              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
