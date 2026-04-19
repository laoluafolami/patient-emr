import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { SectionHeader } from '../../components/dashboard/SectionHeader';
import { EmptyState } from '../../components/dashboard/EmptyState';
import apiClient from '../../services/apiClient';

type Role = 'DOCTOR' | 'NURSE' | 'PATIENT' | 'ADMIN';
type Status = 'ACTIVE' | 'INACTIVE';

interface UserRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  status: Status;
  created: string;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

const emptyForm: UserFormData = { firstName: '', lastName: '', email: '', role: 'PATIENT' };

const SAMPLE_USERS: UserRecord[] = [
  { id: 1, firstName: 'James',  lastName: 'Smith',    email: 'dr.smith@emr.health',       role: 'DOCTOR',  status: 'ACTIVE',   created: 'Dec 1, 2024' },
  { id: 2, firstName: 'Sarah',  lastName: 'Johnson',  email: 'nurse.johnson@emr.health',  role: 'NURSE',   status: 'ACTIVE',   created: 'Dec 1, 2024' },
  { id: 3, firstName: 'John',   lastName: 'Doe',      email: 'patient.doe@example.com',   role: 'PATIENT', status: 'ACTIVE',   created: 'Dec 5, 2024' },
  { id: 4, firstName: 'Mary',   lastName: 'Williams', email: 'mary.w@example.com',        role: 'PATIENT', status: 'INACTIVE', created: 'Dec 8, 2024' },
  { id: 5, firstName: 'Admin',  lastName: 'User',     email: 'admin@emr.health',          role: 'ADMIN',   status: 'ACTIVE',   created: 'Nov 28, 2024' },
  { id: 6, firstName: 'Emily',  lastName: 'Chen',     email: 'nurse.chen@emr.health',     role: 'NURSE',   status: 'ACTIVE',   created: 'Dec 10, 2024' },
];

const roleColors: Record<Role, string> = {
  DOCTOR:  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  NURSE:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  PATIENT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  ADMIN:   'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

const statusColors: Record<Status, string> = {
  ACTIVE:   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  INACTIVE: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
};

type FilterTab = 'ALL' | Role;
const ic =
  'w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all';

const SuccessCheck: React.FC<{ label: string }> = ({ label }) => (
  <div className="p-10 text-center animate-scale-in">
    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p className="font-bold text-neutral-800 dark:text-neutral-100 text-lg">{label}</p>
  </div>
);

const ModalShell: React.FC<{
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, subtitle, onClose, children }) => (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-elevation-4 w-full max-w-md border border-neutral-100 dark:border-neutral-800 animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-neutral-900 dark:text-white">{title}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Spinner = () => (
  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>(SAMPLE_USERS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  // Load real users from API
  useEffect(() => {
    apiClient.get('/users?limit=100')
      .then(res => {
        const apiUsers: UserRecord[] = res.data.data.users.map((u: any) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          role: u.role as Role,
          status: u.status as Status,
          created: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }));
        setUsers(apiUsers);
      })
      .catch(() => {
        // Fall back to sample data if API not available
      });
  }, []);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<UserFormData>(emptyForm);
  const [createStep, setCreateStep] = useState<'form' | 'success'>('form');
  const [createdTempPassword, setCreatedTempPassword] = useState('');
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Edit modal
  const [editTarget, setEditTarget] = useState<UserRecord | null>(null);
  const [editForm, setEditForm] = useState<UserFormData>(emptyForm);
  const [editStep, setEditStep] = useState<'form' | 'success'>('form');
  const [editLoading, setEditLoading] = useState(false);

  // Reset password modal
  const [resetTarget, setResetTarget] = useState<UserRecord | null>(null);
  const [resetStep, setResetStep] = useState<'confirm' | 'success'>('confirm');
  const [resetLoading, setResetLoading] = useState(false);

  // Toggle status modal
  const [toggleTarget, setToggleTarget] = useState<UserRecord | null>(null);
  const [toggleStep, setToggleStep] = useState<'confirm' | 'success'>('confirm');
  const [toggleLoading, setToggleLoading] = useState(false);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'ALL',     label: 'All' },
    { key: 'DOCTOR',  label: 'Doctors' },
    { key: 'NURSE',   label: 'Nurses' },
    { key: 'PATIENT', label: 'Patients' },
    { key: 'ADMIN',   label: 'Admins' },
  ];

  const filtered = users.filter((u) => {
    const matchesTab = activeTab === 'ALL' || u.role === activeTab;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const counts = {
    total:    users.length,
    active:   users.filter((u) => u.status === 'ACTIVE').length,
    doctors:  users.filter((u) => u.role === 'DOCTOR').length,
    patients: users.filter((u) => u.role === 'PATIENT').length,
  };

  const openCreate = () => { setCreateForm(emptyForm); setCreateStep('form'); setCreatedTempPassword(''); setCopiedPassword(false); setShowCreate(true); };
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const response = await apiClient.post('/users', {
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        email: createForm.email,
        role: createForm.role,
      });
      const { user, tempPassword } = response.data.data;
      // Show the temp password returned from the backend
      setCreatedTempPassword(tempPassword || '(check backend logs)');
      const newUser: UserRecord = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role as Role,
        status: user.status as Status,
        created: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setUsers((prev) => [newUser, ...prev]);
      setCreateStep('success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create user. Please try again.';
      alert(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  const openEdit = (u: UserRecord) => {
    setEditTarget(u);
    setEditForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role });
    setEditStep('form');
  };
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditLoading(true);
    try {
      await apiClient.put(`/users/${editTarget.id}`, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        role: editForm.role,
      });
      setUsers((prev) => prev.map((u) => (u.id === editTarget.id ? { ...u, ...editForm } : u)));
      setEditStep('success');
      setTimeout(() => setEditTarget(null), 2200);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user.');
    } finally {
      setEditLoading(false);
    }
  };

  const openReset = (u: UserRecord) => { setResetTarget(u); setResetStep('confirm'); };
  const handleReset = async () => {
    if (!resetTarget) return;
    setResetLoading(true);
    try {
      await apiClient.post(`/users/${resetTarget.id}/reset-password`);
      setResetStep('success');
      setTimeout(() => setResetTarget(null), 2200);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  const openToggle = (u: UserRecord) => { setToggleTarget(u); setToggleStep('confirm'); };
  const handleToggle = async () => {
    if (!toggleTarget) return;
    setToggleLoading(true);
    try {
      const endpoint = toggleTarget.status === 'ACTIVE'
        ? `/users/${toggleTarget.id}/deactivate`
        : `/users/${toggleTarget.id}/activate`;
      await apiClient.post(endpoint);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === toggleTarget.id
            ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
            : u
        )
      );
      setToggleStep('success');
      setTimeout(() => setToggleTarget(null), 2200);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    } finally {
      setToggleLoading(false);
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-6 text-white shadow-elevation-3">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-1">Admin Portal ⚙️</p>
            <h1 className="text-2xl font-bold font-headline">User Management</h1>
            <p className="text-orange-100 text-sm mt-1">{counts.active} active of {counts.total} total users</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-orange-600 bg-white hover:bg-orange-50 shadow-elevation-2 transition-all hover:scale-[1.03]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Total Users', value: counts.total, subtitle: `${counts.active} active`, gradient: 'from-orange-500 to-amber-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
          },
          {
            title: 'Doctors', value: counts.doctors, subtitle: 'Medical staff', gradient: 'from-purple-500 to-violet-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
          },
          {
            title: 'Patients', value: counts.patients, subtitle: 'Registered', gradient: 'from-blue-500 to-cyan-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
          },
          {
            title: 'Inactive', value: counts.total - counts.active, subtitle: 'Deactivated', gradient: 'from-neutral-400 to-neutral-500',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
          },
        ].map((s, i) => (
          <div key={s.title} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <StatCard title={s.title} value={s.value} subtitle={s.subtitle} gradient={s.gradient} icon={s.icon} />
          </div>
        ))}
      </div>
      {/* Search + Tabs */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all"
            />
          </div>
        </div>
        <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-neutral-700 text-orange-600 dark:text-orange-400 shadow-elevation-1'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden">
        <div className="p-5 pb-0">
          <SectionHeader title={`Users (${filtered.length})`} subtitle="Manage accounts below" />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon="👤" title="No users found" description="Try adjusting your search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide hidden sm:table-cell">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide hidden md:table-cell">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide hidden lg:table-cell">Created</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    className="group hover:bg-orange-50/50 dark:hover:bg-orange-950/10 transition-colors animate-fade-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${roleColors[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColors[u.status]}`}>{u.status}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{u.created}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(u)} title="Edit" className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => openReset(u)} title="Reset Password" className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                        </button>
                        <button
                          onClick={() => openToggle(u)}
                          title={u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            u.status === 'ACTIVE'
                              ? 'text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                              : 'text-neutral-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* CREATE MODAL */}
      {showCreate && (
        <ModalShell title="Create New User" subtitle="Fill in the details below" onClose={() => setShowCreate(false)}>
          {createStep === 'success' ? (
            <div className="p-6 animate-scale-in">
              {/* Success header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-lg">User Created!</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Share these credentials with <strong>{createForm.firstName} {createForm.lastName}</strong>
                </p>
              </div>

              {/* Credentials box */}
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/50 rounded-2xl p-4 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Email</span>
                  <span className="text-sm font-mono font-semibold text-neutral-800 dark:text-neutral-100">{createForm.email}</span>
                </div>
                <div className="border-t border-orange-200 dark:border-orange-800/50" />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Temp Password</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-orange-700 dark:text-orange-300 bg-white dark:bg-neutral-800 px-2 py-1 rounded-lg border border-orange-200 dark:border-orange-800/50">
                      {createdTempPassword}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdTempPassword);
                        setCopiedPassword(true);
                        setTimeout(() => setCopiedPassword(false), 2000);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-all"
                      title="Copy password"
                    >
                      {copiedPassword ? (
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="border-t border-orange-200 dark:border-orange-800/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Role</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${roleColors[createForm.role]}`}>{createForm.role}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 mb-4">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  ⚠️ <strong>Save this password now.</strong> It won't be shown again. The user must change it on first login.
                </p>
              </div>

              <button
                onClick={() => setShowCreate(false)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">First Name *</label>
                  <input required value={createForm.firstName} onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })} placeholder="John" className={ic} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Last Name *</label>
                  <input required value={createForm.lastName} onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })} placeholder="Doe" className={ic} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Email Address *</label>
                <input required type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} placeholder="user@example.com" className={ic} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Role *</label>
                <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as Role })} className={ic}>
                  <option value="PATIENT">Patient</option>
                  <option value="NURSE">Nurse</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  🔐 A secure temporary password will be auto-generated and emailed to the user.
                </p>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={createLoading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 shadow-elevation-2 transition-all disabled:opacity-60">
                  {createLoading ? <span className="flex items-center justify-center gap-2"><Spinner />Creating...</span> : 'Create User'}
                </button>
              </div>
            </form>
          )}
        </ModalShell>
      )}

      {/* EDIT MODAL */}
      {editTarget && (
        <ModalShell title="Edit User" subtitle={`Editing ${editTarget.firstName} ${editTarget.lastName}`} onClose={() => setEditTarget(null)}>
          {editStep === 'success' ? (
            <SuccessCheck label="Changes Saved!" />
          ) : (
            <form onSubmit={handleEdit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">First Name *</label>
                  <input required value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className={ic} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Last Name *</label>
                  <input required value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} className={ic} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Email Address *</label>
                <input required type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className={ic} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Role *</label>
                <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as Role })} className={ic}>
                  <option value="PATIENT">Patient</option>
                  <option value="NURSE">Nurse</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={editLoading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 shadow-elevation-2 transition-all disabled:opacity-60">
                  {editLoading ? <span className="flex items-center justify-center gap-2"><Spinner />Saving...</span> : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </ModalShell>
      )}
      {/* RESET PASSWORD MODAL */}
      {resetTarget && (
        <ModalShell title="Reset Password" subtitle={`Send new credentials to ${resetTarget.email}`} onClose={() => setResetTarget(null)}>
          {resetStep === 'success' ? (
            <SuccessCheck label="Password Reset Sent!" />
          ) : (
            <div className="p-5 space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                  Reset password for <span className="font-bold">{resetTarget.firstName} {resetTarget.lastName}</span>?
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  A new temporary password will be emailed to <span className="font-semibold">{resetTarget.email}</span>. The user will be required to change it on next login.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setResetTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                  Cancel
                </button>
                <button onClick={handleReset} disabled={resetLoading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 shadow-elevation-2 transition-all disabled:opacity-60">
                  {resetLoading ? <span className="flex items-center justify-center gap-2"><Spinner />Sending...</span> : 'Send Reset Email'}
                </button>
              </div>
            </div>
          )}
        </ModalShell>
      )}

      {/* TOGGLE STATUS MODAL */}
      {toggleTarget && (
        <ModalShell
          title={toggleTarget.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
          subtitle={`${toggleTarget.firstName} ${toggleTarget.lastName}`}
          onClose={() => setToggleTarget(null)}
        >
          {toggleStep === 'success' ? (
            <SuccessCheck label={toggleTarget.status === 'ACTIVE' ? 'User Deactivated' : 'User Activated'} />
          ) : (
            <div className="p-5 space-y-4">
              <div className={`p-4 rounded-xl border ${
                toggleTarget.status === 'ACTIVE'
                  ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40'
                  : 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/40'
              }`}>
                <p className={`text-sm font-medium ${
                  toggleTarget.status === 'ACTIVE'
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-green-800 dark:text-green-200'
                }`}>
                  {toggleTarget.status === 'ACTIVE'
                    ? `Deactivate ${toggleTarget.firstName} ${toggleTarget.lastName}?`
                    : `Reactivate ${toggleTarget.firstName} ${toggleTarget.lastName}?`}
                </p>
                <p className={`text-xs mt-1 ${
                  toggleTarget.status === 'ACTIVE'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {toggleTarget.status === 'ACTIVE'
                    ? 'This user will lose access to the system immediately.'
                    : 'This user will regain full access to the system.'}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setToggleTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                  Cancel
                </button>
                <button
                  onClick={handleToggle}
                  disabled={toggleLoading}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white shadow-elevation-2 transition-all disabled:opacity-60 ${
                    toggleTarget.status === 'ACTIVE'
                      ? 'bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-600 hover:to-rose-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500'
                  }`}
                >
                  {toggleLoading
                    ? <span className="flex items-center justify-center gap-2"><Spinner />Processing...</span>
                    : toggleTarget.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                </button>
              </div>
            </div>
          )}
        </ModalShell>
      )}
    </div>
  );
};
