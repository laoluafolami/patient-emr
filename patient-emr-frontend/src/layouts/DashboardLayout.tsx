import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Logo } from '../components/Logo';

/* ─────────────────────────────────────────────────────────────
   NAV ITEM TYPES
───────────────────────────────────────────────────────────── */
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | string;
  section?: string; // optional section grouping label
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  role: 'PATIENT' | 'DOCTOR' | 'NURSE' | 'ADMIN';
}

/* ─────────────────────────────────────────────────────────────
   ROLE CONFIG
───────────────────────────────────────────────────────────── */
const roleConfig = {
  PATIENT: {
    label: 'Patient Portal',
    gradient: 'from-blue-500 to-cyan-400',
    accent: 'bg-blue-500',
    accentLight: 'bg-blue-50 dark:bg-blue-950/40',
    accentText: 'text-blue-600 dark:text-blue-400',
    accentBorder: 'border-blue-200 dark:border-blue-800/60',
    emoji: '🏥',
    activeClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500',
  },
  DOCTOR: {
    label: 'Doctor Portal',
    gradient: 'from-purple-500 to-indigo-400',
    accent: 'bg-purple-500',
    accentLight: 'bg-purple-50 dark:bg-purple-950/40',
    accentText: 'text-purple-600 dark:text-purple-400',
    accentBorder: 'border-purple-200 dark:border-purple-800/60',
    emoji: '👨‍⚕️',
    activeClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-r-2 border-purple-500',
  },
  NURSE: {
    label: 'Nurse Portal',
    gradient: 'from-emerald-500 to-teal-400',
    accent: 'bg-emerald-500',
    accentLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    accentBorder: 'border-emerald-200 dark:border-emerald-800/60',
    emoji: '👩‍⚕️',
    activeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-r-2 border-emerald-500',
  },
  ADMIN: {
    label: 'Admin Portal',
    gradient: 'from-orange-500 to-amber-400',
    accent: 'bg-orange-500',
    accentLight: 'bg-orange-50 dark:bg-orange-950/40',
    accentText: 'text-orange-600 dark:text-orange-400',
    accentBorder: 'border-orange-200 dark:border-orange-800/60',
    emoji: '⚙️',
    activeClass: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-r-2 border-orange-500',
  },
};

/* ─────────────────────────────────────────────────────────────
   SIDEBAR COMPONENT
───────────────────────────────────────────────────────────── */
const Sidebar: React.FC<{
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  navItems: NavItem[];
  role: DashboardLayoutProps['role'];
  user: any;
  onLogout: () => void;
}> = ({ isOpen, isCollapsed, onClose, onToggleCollapse, navItems, role, user, onLogout }) => {
  const config = roleConfig[role];
  const location = useLocation();

  // Group nav items by section
  const sections = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    const key = item.section || '__default__';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          bg-white dark:bg-neutral-900
          border-r border-neutral-100 dark:border-neutral-800
          shadow-elevation-3
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[72px]' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* ── Logo / Brand ─────────────────────────────── */}
        <div className={`flex items-center h-16 px-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <Logo size="sm" showText={true} />
            </div>
          )}

          {isCollapsed && (
            <img src="/logo.png" alt="MediCore" className="w-12 h-12 rounded-xl object-contain" />
          )}

          {/* Collapse toggle — desktop only */}
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 flex-shrink-0"
              title="Collapse sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}

          {isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 shadow-elevation-1 transition-all duration-200"
              title="Expand sidebar"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Navigation ───────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {Object.entries(sections).map(([section, items]) => (
            <div key={section}>
              {/* Section label */}
              {section !== '__default__' && !isCollapsed && (
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
                  {section}
                </p>
              )}
              {section !== '__default__' && isCollapsed && (
                <div className="my-2 mx-3 h-px bg-neutral-100 dark:bg-neutral-800" />
              )}

              {items.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                    title={isCollapsed ? item.label : undefined}
                    className={`
                      group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${isActive
                        ? config.activeClass
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    {/* Icon */}
                    <span className={`flex-shrink-0 w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                      {item.icon}
                    </span>

                    {/* Label */}
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {/* Badge */}
                    {!isCollapsed && item.badge !== undefined && (
                      <span className={`flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center text-white bg-gradient-to-r ${config.gradient}`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed badge dot */}
                    {isCollapsed && item.badge !== undefined && (
                      <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${config.accent}`} />
                    )}

                    {/* Collapsed tooltip */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-700 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-elevation-3 z-50">
                        {item.label}
                        {item.badge !== undefined && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">{item.badge}</span>
                        )}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900 dark:border-r-neutral-700" />
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── User profile footer ───────────────────────── */}
        <div className={`flex-shrink-0 border-t border-neutral-100 dark:border-neutral-800 p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-elevation-1`}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className={`text-[10px] font-medium truncate ${config.accentText}`}>
                  {config.label}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-950/30 transition-all duration-200 flex-shrink-0"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-bold text-sm shadow-elevation-1`} title={`${user?.firstName} ${user?.lastName}`}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <button
                onClick={onLogout}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-950/30 transition-all duration-200"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   TOP HEADER BAR
───────────────────────────────────────────────────────────── */
const TopBar: React.FC<{
  onMenuClick: () => void;
  isCollapsed: boolean;
  role: DashboardLayoutProps['role'];
  user: any;
  pageTitle?: string;
  onLogout: () => void;
  navItems: NavItem[];
}> = ({ onMenuClick, isCollapsed, role, user, pageTitle, onLogout, navItems }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const config = roleConfig[role];
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-800 sticky top-0 z-20 flex-shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          {pageTitle && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 text-sm">MediCore</span>
              <svg className="w-3 h-3 text-neutral-300 dark:text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{pageTitle}</span>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="text-xs">Search...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 font-mono">⌘K</kbd>
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${config.accent} ring-2 ring-white dark:ring-neutral-900`} />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 clay rounded-2xl shadow-elevation-4 overflow-hidden animate-scale-in z-50">
                <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">Notifications</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${config.gradient}`}>3 new</span>
                </div>
                <div className="divide-y divide-neutral-50 dark:divide-neutral-800">
                  {[{ icon: '📅', text: 'Appointment confirmed for tomorrow', time: '2m ago' }, { icon: '🧪', text: 'New lab results are available', time: '1h ago' }, { icon: '💬', text: 'Message from Dr. Smith', time: '3h ago' }].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer">
                      <span className="text-lg flex-shrink-0">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{n.text}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{n.time}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${config.accent}`} />
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-neutral-100 dark:border-neutral-800">
                  <button className={`text-xs font-semibold ${config.accentText} hover:underline`}>View all</button>
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all" aria-label="Toggle theme">
            {theme === 'light' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
            )}
          </button>

          {/* User avatar with dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-bold text-sm shadow-elevation-1 hover:scale-105 transition-transform duration-200`}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 clay rounded-2xl shadow-elevation-4 overflow-hidden animate-scale-in z-50">
                {/* User info */}
                <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{user?.firstName} {user?.lastName}</p>
                      <p className={`text-xs font-medium truncate ${config.accentText}`}>{config.label}</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  <button 
                    onClick={() => { 
                      setUserMenuOpen(false); 
                      navigate(`/${role.toLowerCase()}/profile`); 
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-all text-left"
                  >
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    My Profile
                  </button>
                  <button 
                    onClick={() => { 
                      setUserMenuOpen(false); 
                      navigate(`/${role.toLowerCase()}/change-password`); 
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-all text-left"
                  >
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                    Change Password
                  </button>
                </div>

                <div className="p-2 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => { setUserMenuOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950/30 transition-all text-left font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
          <div ref={searchRef} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-elevation-4 w-full max-w-lg border border-neutral-100 dark:border-neutral-800 overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-4 border-b border-neutral-100 dark:border-neutral-800">
              <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search patients, records, appointments..."
                className="flex-1 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none text-sm"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono flex-shrink-0">ESC</kbd>
            </div>
            <div className="p-4">
              {searchQuery.trim() === '' ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">Quick Navigation</p>
                  {navItems.map(item => (
                    <button key={item.id} onClick={() => { setSearchOpen(false); setSearchQuery(''); navigate(item.path); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-all text-left">
                      <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Searching for "<strong className="text-neutral-700 dark:text-neutral-200">{searchQuery}</strong>"...</p>
                  <p className="text-xs text-neutral-400 mt-1">Full search coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN LAYOUT
───────────────────────────────────────────────────────────── */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, navItems, role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const currentNav = navItems.find(
    (item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        navItems={navItems}
        role={role}
        user={user}
        onLogout={handleLogout}
      />
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          isCollapsed={sidebarCollapsed}
          role={role}
          user={user}
          pageTitle={currentNav?.label}
          onLogout={handleLogout}
          navItems={navItems}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
