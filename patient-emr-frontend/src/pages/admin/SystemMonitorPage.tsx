import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/dashboard/StatCard';
import { SectionHeader } from '../../components/dashboard/SectionHeader';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: string;
  responseTime: string;
  icon: string;
}

interface ActiveSession {
  id: number;
  user: string;
  role: string;
  loginTime: string;
  lastActivity: string;
  ip: string;
}

const SERVICES: ServiceStatus[] = [
  { name: 'API Server',    status: 'operational', uptime: '99.98%', responseTime: '124ms', icon: '⚡' },
  { name: 'Database',      status: 'operational', uptime: '99.99%', responseTime: '8ms',   icon: '🗄️' },
  { name: 'Email Service', status: 'operational', uptime: '99.95%', responseTime: '340ms', icon: '📧' },
  { name: 'File Storage',  status: 'operational', uptime: '99.97%', responseTime: '52ms',  icon: '💾' },
];

const INITIAL_SESSIONS: ActiveSession[] = [
  { id: 1, user: 'Dr. James Smith', role: 'DOCTOR', loginTime: '09:02', lastActivity: '2 min ago',  ip: '192.168.1.10' },
  { id: 2, user: 'Emily Chen',      role: 'NURSE',  loginTime: '09:45', lastActivity: '8 min ago',  ip: '192.168.1.31' },
  { id: 3, user: 'Admin User',      role: 'ADMIN',  loginTime: '08:30', lastActivity: 'just now',   ip: '192.168.1.1'  },
];

const BAR_DATA = [42, 58, 71, 65, 80, 124, 98, 110, 88, 76, 92, 105, 118, 124, 99, 87, 73, 95, 112, 108, 91, 84, 77, 68];

const statusDot: Record<string, string> = {
  operational: 'bg-green-500',
  degraded:    'bg-yellow-500',
  down:        'bg-red-500',
};

const statusLabel: Record<string, string> = {
  operational: 'Operational',
  degraded:    'Degraded',
  down:        'Down',
};

const roleColors: Record<string, string> = {
  DOCTOR:  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  NURSE:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  ADMIN:   'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  PATIENT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
};
export const SystemMonitorPage: React.FC = () => {
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setLastUpdated(new Date());
          return 30;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = (id: number) => setSessions((prev) => prev.filter((s) => s.id !== id));

  const maxBar = Math.max(...BAR_DATA);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-6 text-white shadow-elevation-3">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-1">Admin Portal ⚙️</p>
            <h1 className="text-2xl font-bold font-headline">System Monitor</h1>
            <p className="text-orange-100 text-sm mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-sm font-medium">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refreshes in {countdown}s
          </div>
        </div>
      </div>

      {/* Overall Health */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-elevation-1">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <h2 className="text-xl font-bold text-green-600 dark:text-green-400">All Systems Operational</h2>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              All 4 services running normally · No incidents reported
            </p>
          </div>
        </div>
      </div>
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'API Response Time', value: '124ms', subtitle: 'Avg last hour', gradient: 'from-orange-500 to-amber-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
          },
          {
            title: 'Database Status', value: 'Connected', subtitle: '8ms query time', gradient: 'from-green-500 to-emerald-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>,
          },
          {
            title: 'Storage Usage', value: '23%', subtitle: '11.5 GB of 50 GB', gradient: 'from-blue-500 to-cyan-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
          },
          {
            title: 'Active Sessions', value: sessions.length, subtitle: 'Logged in now', gradient: 'from-purple-500 to-violet-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
          },
        ].map((s, i) => (
          <div key={s.title} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <StatCard title={s.title} value={s.value} subtitle={s.subtitle} gradient={s.gradient} icon={s.icon} />
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
        <SectionHeader title="Service Status" subtitle="Real-time health of all services" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.name}
              className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{svc.icon}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${statusDot[svc.status]} animate-pulse`} />
                  <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400">{statusLabel[svc.status]}</span>
                </div>
              </div>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mb-2">{svc.name}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400">Uptime</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{svc.uptime}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400">Response</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">{svc.responseTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Performance Chart */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
        <SectionHeader title="API Response Time" subtitle="Last 24 hours (ms)" />
        <div className="flex items-end gap-1 h-32 mt-2">
          {BAR_DATA.map((val, i) => {
            const pct = (val / maxBar) * 100;
            const color = val > 100 ? 'bg-orange-400' : val > 80 ? 'bg-amber-400' : 'bg-green-400';
            return (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {val}ms
                </div>
                <div
                  className={`w-full rounded-t-sm ${color} transition-all duration-300`}
                  style={{ height: `${pct}%`, minHeight: '4px' }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-neutral-400">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>Now</span>
        </div>
        <div className="flex items-center gap-4 mt-3">
          {[['bg-green-400', '≤80ms'], ['bg-amber-400', '81–100ms'], ['bg-orange-400', '>100ms']].map(([c, l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm ${c}`} />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{l}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Active Sessions */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
        <SectionHeader title="Active Sessions" subtitle={`${sessions.length} users currently logged in`} />
        {sessions.length === 0 ? (
          <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">No active sessions</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">User</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide hidden sm:table-cell">Login Time</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide hidden md:table-cell">Last Activity</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide hidden lg:table-cell">IP Address</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-orange-50/40 dark:hover:bg-orange-950/10 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {s.user.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{s.user}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColors[s.role] ?? 'bg-neutral-100 text-neutral-600'}`}>{s.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell">
                      <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">{s.loginTime}</span>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">{s.lastActivity}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden lg:table-cell">
                      <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">{s.ip}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleLogout(s.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 transition-all"
                      >
                        Logout
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* System Info */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
        <SectionHeader title="System Information" subtitle="Runtime environment details" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Node.js Version', value: 'v20.11.0',              icon: '🟢' },
            { label: 'Database',        value: 'PostgreSQL 15.4',        icon: '🗄️' },
            { label: 'System Uptime',   value: '14d 6h 22m',            icon: '⏱️' },
            { label: 'Memory Usage',    value: '512 MB / 2 GB',          icon: '💻' },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.icon}</span>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.label}</p>
              </div>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 font-mono">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
