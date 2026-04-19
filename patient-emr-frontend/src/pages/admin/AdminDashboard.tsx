import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { SectionHeader } from '../../components/dashboard/SectionHeader';

const users = [
  { id: 1, name: 'Dr. James Smith', email: 'dr.smith@emr.health', role: 'DOCTOR', status: 'ACTIVE', created: 'Dec 1, 2024' },
  { id: 2, name: 'Sarah Johnson', email: 'nurse.johnson@emr.health', role: 'NURSE', status: 'ACTIVE', created: 'Dec 1, 2024' },
  { id: 3, name: 'John Doe', email: 'patient.doe@example.com', role: 'PATIENT', status: 'ACTIVE', created: 'Dec 5, 2024' },
  { id: 4, name: 'Mary Williams', email: 'mary.w@example.com', role: 'PATIENT', status: 'INACTIVE', created: 'Dec 8, 2024' },
];

const activityLog = [
  { id: 1, user: 'Dr. James Smith', action: 'LOGIN_SUCCESS', resource: 'auth', time: '2 min ago', icon: '🔐' },
  { id: 2, user: 'Sarah Johnson', action: 'VITALS_RECORDED', resource: 'vitals', time: '15 min ago', icon: '📊' },
  { id: 3, user: 'Dr. James Smith', action: 'LAB_RESULT_UPLOADED', resource: 'lab_results', time: '1h ago', icon: '🔬' },
  { id: 4, user: 'John Doe', action: 'APPOINTMENT_BOOKED', resource: 'appointments', time: '2h ago', icon: '📅' },
  { id: 5, user: 'System', action: 'BACKUP_COMPLETED', resource: 'system', time: '3h ago', icon: '💾' },
  { id: 6, user: 'Mary Williams', action: 'LOGIN_FAILED', resource: 'auth', time: '4h ago', icon: '⚠️' },
];

const roleColors: Record<string, string> = {
  DOCTOR: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  NURSE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  PATIENT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  ADMIN: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300',
  INACTIVE: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
};

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', role: 'PATIENT' });
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setCreating(false);
    setCreateSuccess(true);
    setTimeout(() => { setCreateSuccess(false); setShowCreateModal(false); setNewUser({ firstName: '', lastName: '', email: '', role: 'PATIENT' }); }, 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-6 text-white shadow-elevation-3">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-orange-100 text-sm font-medium mb-1">System Administrator ⚙️</p>
          <h1 className="text-2xl font-bold font-headline mb-1">{user?.firstName} {user?.lastName}</h1>
          <p className="text-orange-100 text-sm">All systems operational. 47 active users today.</p>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="text-sm">👤</span>
            <span className="text-xs font-medium">4 total users</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="text-sm">💚</span>
            <span className="text-xs font-medium">99.9% uptime</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="text-sm">📈</span>
            <span className="text-xs font-medium">6 events today</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="4" subtitle="3 active" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} gradient="from-orange-500 to-amber-400" />
        <StatCard title="System Health" value="99.9%" subtitle="All services up" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} gradient="from-secondary-500 to-green-400" />
        <StatCard title="Activity Logs" value="6" subtitle="Today's events" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} gradient="from-blue-500 to-cyan-400" />
        <StatCard title="Failed Logins" value="1" subtitle="Last 24 hours" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} gradient="from-accent-500 to-red-400" />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* User management */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
          <SectionHeader
            title="User Management"
            subtitle="All system accounts"
            action={
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 hover:scale-[1.03]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create User
              </button>
            }
          />
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {u.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{u.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColors[u.role]}`}>{u.role}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[u.status]}`}>{u.status}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all" title="Edit">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-950/30 transition-all" title="Deactivate">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity log */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
          <SectionHeader title="Activity Log" subtitle="Real-time events" />
          <div className="space-y-2">
            {activityLog.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <span className="text-base flex-shrink-0 mt-0.5">{log.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 truncate">{log.user}</p>
                  <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate">{log.action}</p>
                  <p className="text-[10px] text-neutral-400">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 rounded-xl text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-colors">
            View Full Log
          </button>
        </div>
      </div>

      {/* System health */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
        <SectionHeader title="System Health" subtitle="Real-time monitoring" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'API Response', value: '124ms', status: 'good', icon: '⚡' },
            { label: 'Database', value: 'Connected', status: 'good', icon: '🗄️' },
            { label: 'Storage', value: '23% used', status: 'good', icon: '💾' },
            { label: 'Active Sessions', value: '3', status: 'good', icon: '🔐' },
          ].map((metric) => (
            <div key={metric.label} className="flex items-center gap-3 p-4 rounded-xl bg-secondary-50 dark:bg-secondary-950/20 border border-secondary-100 dark:border-secondary-900/40">
              <span className="text-2xl">{metric.icon}</span>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{metric.label}</p>
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{metric.value}</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-elevation-4 w-full max-w-md border border-neutral-100 dark:border-neutral-800 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-white">Create New User</h3>
              <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {createSuccess ? (
              <div className="p-8 text-center animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-neutral-800 dark:text-neutral-100">User Created!</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Credentials sent to {newUser.email}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">First Name *</label>
                    <input required value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} placeholder="John" className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Last Name *</label>
                    <input required value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} placeholder="Doe" className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Email Address *</label>
                  <input required type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="user@example.com" className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Role *</label>
                  <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all">
                    <option value="PATIENT">Patient</option>
                    <option value="NURSE">Nurse</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40">
                  <p className="text-xs text-primary-700 dark:text-primary-300">
                    🔐 A temporary password will be auto-generated and emailed to the user.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">Cancel</button>
                  <button type="submit" disabled={creating} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 shadow-elevation-2 transition-all disabled:opacity-60">
                    {creating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Creating...
                      </span>
                    ) : 'Create User'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
