import React, { useState, useMemo, useEffect } from 'react';
import { StatCard } from '../../components/dashboard/StatCard';
import { SectionHeader } from '../../components/dashboard/SectionHeader';
import { EmptyState } from '../../components/dashboard/EmptyState';
import apiClient from '../../services/apiClient';

type ActionType = 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'ERROR' | 'SYSTEM';
type DateRange = 'today' | 'week' | 'month' | 'custom';

interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  role: string;
  action: ActionType;
  resource: string;
  details: string;
  ip: string;
}

const actionColors: Record<ActionType, string> = {
  LOGIN:  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  LOGOUT: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  CREATE: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  UPDATE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  ERROR:  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  SYSTEM: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

const actionIcons: Record<ActionType, string> = {
  LOGIN: '🔐', LOGOUT: '🚪', CREATE: '✅', UPDATE: '✏️', DELETE: '🗑️', ERROR: '⚠️', SYSTEM: '⚙️',
};
const SAMPLE_LOGS: LogEntry[] = [
  { id: 1,  timestamp: '2024-12-15 09:02:11', user: 'Dr. James Smith',  role: 'DOCTOR',  action: 'LOGIN',  resource: 'auth',          details: 'Successful login',               ip: '192.168.1.10' },
  { id: 2,  timestamp: '2024-12-15 09:05:33', user: 'Dr. James Smith',  role: 'DOCTOR',  action: 'UPDATE', resource: 'patient/1042',  details: 'Updated diagnosis notes',         ip: '192.168.1.10' },
  { id: 3,  timestamp: '2024-12-15 09:12:47', user: 'Sarah Johnson',    role: 'NURSE',   action: 'CREATE', resource: 'vitals',        details: 'Recorded vitals for patient',     ip: '192.168.1.22' },
  { id: 4,  timestamp: '2024-12-15 09:18:05', user: 'John Doe',         role: 'PATIENT', action: 'LOGIN',  resource: 'auth',          details: 'Successful login',               ip: '10.0.0.45' },
  { id: 5,  timestamp: '2024-12-15 09:22:19', user: 'John Doe',         role: 'PATIENT', action: 'UPDATE', resource: 'appointments',  details: 'Booked appointment slot',         ip: '10.0.0.45' },
  { id: 6,  timestamp: '2024-12-15 09:31:44', user: 'Admin User',       role: 'ADMIN',   action: 'CREATE', resource: 'users',         details: 'Created new nurse account',       ip: '192.168.1.1' },
  { id: 7,  timestamp: '2024-12-15 09:45:02', user: 'Emily Chen',       role: 'NURSE',   action: 'LOGIN',  resource: 'auth',          details: 'Successful login',               ip: '192.168.1.31' },
  { id: 8,  timestamp: '2024-12-15 09:52:38', user: 'Dr. James Smith',  role: 'DOCTOR',  action: 'CREATE', resource: 'lab_results',   details: 'Uploaded lab result PDF',         ip: '192.168.1.10' },
  { id: 9,  timestamp: '2024-12-15 10:03:15', user: 'Mary Williams',    role: 'PATIENT', action: 'ERROR',  resource: 'auth',          details: 'Failed login attempt (3rd)',      ip: '10.0.0.88' },
  { id: 10, timestamp: '2024-12-15 10:11:29', user: 'System',           role: 'SYSTEM',  action: 'SYSTEM', resource: 'backup',        details: 'Automated backup completed',      ip: '127.0.0.1' },
  { id: 11, timestamp: '2024-12-15 10:22:54', user: 'Sarah Johnson',    role: 'NURSE',   action: 'UPDATE', resource: 'patient/1055',  details: 'Updated medication schedule',     ip: '192.168.1.22' },
  { id: 12, timestamp: '2024-12-15 10:35:07', user: 'Admin User',       role: 'ADMIN',   action: 'UPDATE', resource: 'users/4',       details: 'Deactivated user account',        ip: '192.168.1.1' },
  { id: 13, timestamp: '2024-12-15 10:48:22', user: 'Dr. James Smith',  role: 'DOCTOR',  action: 'DELETE', resource: 'appointments',  details: 'Cancelled appointment #2091',     ip: '192.168.1.10' },
  { id: 14, timestamp: '2024-12-15 11:02:41', user: 'Emily Chen',       role: 'NURSE',   action: 'CREATE', resource: 'vitals',        details: 'Recorded vitals for patient',     ip: '192.168.1.31' },
  { id: 15, timestamp: '2024-12-15 11:15:09', user: 'John Doe',         role: 'PATIENT', action: 'LOGOUT', resource: 'auth',          details: 'User logged out',                ip: '10.0.0.45' },
  { id: 16, timestamp: '2024-12-15 11:28:33', user: 'System',           role: 'SYSTEM',  action: 'SYSTEM', resource: 'health_check',  details: 'Health check passed',             ip: '127.0.0.1' },
  { id: 17, timestamp: '2024-12-15 11:41:55', user: 'Admin User',       role: 'ADMIN',   action: 'CREATE', resource: 'users',         details: 'Created new doctor account',      ip: '192.168.1.1' },
  { id: 18, timestamp: '2024-12-15 11:55:18', user: 'Dr. James Smith',  role: 'DOCTOR',  action: 'UPDATE', resource: 'patient/1042',  details: 'Updated treatment plan',          ip: '192.168.1.10' },
  { id: 19, timestamp: '2024-12-15 12:08:44', user: 'Mary Williams',    role: 'PATIENT', action: 'ERROR',  resource: 'auth',          details: 'Account locked after 5 attempts', ip: '10.0.0.88' },
  { id: 20, timestamp: '2024-12-15 12:22:01', user: 'Sarah Johnson',    role: 'NURSE',   action: 'LOGOUT', resource: 'auth',          details: 'User logged out',                ip: '192.168.1.22' },
  { id: 21, timestamp: '2024-12-15 12:35:17', user: 'Emily Chen',       role: 'NURSE',   action: 'UPDATE', resource: 'patient/1060',  details: 'Updated allergy information',     ip: '192.168.1.31' },
  { id: 22, timestamp: '2024-12-15 12:48:39', user: 'System',           role: 'SYSTEM',  action: 'SYSTEM', resource: 'email_service', details: 'Sent 12 appointment reminders',   ip: '127.0.0.1' },
];

const PAGE_SIZE = 10;
export const ActivityLogsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>('today');
  const [actionFilter, setActionFilter] = useState<ActionType | 'ALL'>('ALL');
  const [userFilter, setUserFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>(SAMPLE_LOGS);

  // Load real logs from backend
  useEffect(() => {
    apiClient.get('/activity-logs?limit=100')
      .then(res => {
        const data = res.data?.data?.logs;
        if (data && data.length > 0) {
          const mapped: LogEntry[] = data.map((l: any, idx: number) => ({
            id: idx + 1,
            timestamp: new Date(l.createdAt).toISOString().replace('T', ' ').substring(0, 19),
            user: l.user ? `${l.user.firstName} ${l.user.lastName}` : 'System',
            role: l.user?.role || 'SYSTEM',
            action: (l.action?.split('_')[0] || 'SYSTEM') as ActionType,
            resource: l.resource || '-',
            details: l.details ? JSON.parse(l.details)?.message || l.action : l.action,
            ip: l.ipAddress || '-',
          }));
          setLogs(mapped);
        }
      })
      .catch(() => { /* keep sample data */ });
  }, []);

  const uniqueUsers = useMemo(() => ['ALL', ...Array.from(new Set(logs.map((l) => l.user)))], [logs]);

  const filtered = useMemo(() => logs.filter((l) => {
    const matchAction = actionFilter === 'ALL' || l.action === actionFilter;
    const matchUser = userFilter === 'ALL' || l.user === userFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || l.user.toLowerCase().includes(q) || l.resource.toLowerCase().includes(q) || l.details.toLowerCase().includes(q);
    return matchAction && matchUser && matchSearch;
  }), [logs, actionFilter, userFilter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total: logs.length,
    logins: logs.filter((l) => l.action === 'LOGIN').length,
    changes: logs.filter((l) => ['CREATE', 'UPDATE', 'DELETE'].includes(l.action)).length,
    errors: logs.filter((l) => l.action === 'ERROR').length,
  };

  const handleExport = () => {
    const header = 'Timestamp,User,Role,Action,Resource,Details,IP';
    const rows = filtered.map((l) => [l.timestamp, l.user, l.role, l.action, l.resource, l.details, l.ip].join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const selCls = 'px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all';
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-6 text-white shadow-elevation-3">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-1">Admin Portal ⚙️</p>
            <h1 className="text-2xl font-bold font-headline flex items-center gap-3">
              Activity Logs
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            </h1>
            <p className="text-orange-100 text-sm mt-1">{stats.total} events recorded today</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-orange-600 bg-white hover:bg-orange-50 shadow-elevation-2 transition-all hover:scale-[1.03]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Total Events', value: stats.total, subtitle: 'All activity', gradient: 'from-orange-500 to-amber-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
          },
          {
            title: 'Login Events', value: stats.logins, subtitle: 'Auth activity', gradient: 'from-blue-500 to-cyan-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>,
          },
          {
            title: 'Data Changes', value: stats.changes, subtitle: 'Create/Update/Delete', gradient: 'from-green-500 to-emerald-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
          },
          {
            title: 'Errors', value: stats.errors, subtitle: 'Failed operations', gradient: 'from-red-500 to-rose-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
          },
        ].map((s, i) => (
          <div key={s.title} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <StatCard title={s.title} value={s.value} subtitle={s.subtitle} gradient={s.gradient} icon={s.icon} />
          </div>
        ))}
      </div>
      {/* Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
        <div className="flex flex-wrap gap-3">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value as DateRange)} className={selCls}>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
          <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value as ActionType | 'ALL'); setPage(1); }} className={selCls}>
            <option value="ALL">All Actions</option>
            {(['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'ERROR', 'SYSTEM'] as ActionType[]).map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select value={userFilter} onChange={(e) => { setUserFilter(e.target.value); setPage(1); }} className={selCls}>
            {uniqueUsers.map((u) => <option key={u} value={u}>{u === 'ALL' ? 'All Users' : u}</option>)}
          </select>
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search logs…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all"
            />
          </div>
        </div>
      </div>
      {/* Log Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden">
        <div className="p-5 pb-0 flex items-center justify-between">
          <SectionHeader title={`Activity Log (${filtered.length})`} subtitle="Sorted by most recent" />
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </div>
        {paginated.length === 0 ? (
          <EmptyState icon="📋" title="No logs found" description="Try adjusting your filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Timestamp</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide hidden sm:table-cell">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Action</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide hidden md:table-cell">Resource</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide hidden lg:table-cell">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                {paginated.map((log, i) => (
                  <tr
                    key={log.id}
                    className="group hover:bg-orange-50/40 dark:hover:bg-orange-950/10 transition-colors animate-fade-up"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{actionIcons[log.action]}</span>
                        <div>
                          <p className="text-xs font-mono text-neutral-700 dark:text-neutral-300">{log.timestamp.split(' ')[1]}</p>
                          <p className="text-[10px] text-neutral-400">{log.timestamp.split(' ')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{log.user}</p>
                      <p className="text-[10px] text-neutral-400">{log.role}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${actionColors[log.action]}`}>{log.action}</span>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs truncate hidden sm:block">{log.details}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">{log.resource}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">{log.ip}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${p === page ? 'bg-orange-500 text-white shadow-elevation-1' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
