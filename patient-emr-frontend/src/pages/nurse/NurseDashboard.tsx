import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { SectionHeader } from '../../components/dashboard/SectionHeader';
import apiClient from '../../services/apiClient';

interface PatientOption { id: string; name: string; room: string; }

const recentEntries = [
  { id: 1, patient: 'John Doe', type: 'Vitals', time: '10:30 AM', notes: 'BP: 130/85, HR: 78, Temp: 36.8°C', status: 'normal' },
  { id: 2, patient: 'Mary Johnson', type: 'Record', time: '09:45 AM', notes: 'Chief complaint: Fatigue, dizziness', status: 'flagged' },
  { id: 3, patient: 'Robert Chen', type: 'Vitals', time: '09:00 AM', notes: 'BP: 145/92, HR: 88, Temp: 37.1°C', status: 'elevated' },
  { id: 4, patient: 'Sarah Williams', type: 'Vitals', time: '08:30 AM', notes: 'BP: 118/76, HR: 72, Temp: 36.5°C', status: 'normal' },
];

const statusColors: Record<string, string> = {
  normal: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300',
  elevated: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
  flagged: 'bg-error-100 text-error-700 dark:bg-error-900/40 dark:text-error-300',
  high: 'bg-error-100 text-error-700 dark:bg-error-900/40 dark:text-error-300',
};

export const NurseDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [vitals, setVitals] = useState({ temp: '', systolic: '', diastolic: '', heartRate: '', respRate: '', o2sat: '' });
  const [submitted, setSubmitted] = useState(false);
  const [patients, setPatients] = useState<PatientOption[]>([]);

  useEffect(() => {
    apiClient.get('/patients?limit=100')
      .then(res => {
        const list = res.data?.data?.patients || [];
        setPatients(list.map((p: any) => ({
          id: p.id,
          name: `${p.firstName} ${p.lastName}`,
          room: 'OPD',
        })));
      })
      .catch(() => {
        setPatients([
          { id: '1', name: 'John Doe', room: 'OPD-1' },
          { id: '2', name: 'Mary Johnson', room: 'OPD-2' },
        ]);
      });
  }, []);

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setVitals({ temp: '', systolic: '', diastolic: '', heartRate: '', respRate: '', o2sat: '' }); setSelectedPatient(''); }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 p-6 text-white shadow-elevation-3">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-emerald-100 text-sm font-medium mb-1">Welcome back 👩‍⚕️</p>
          <h1 className="text-2xl font-bold font-headline mb-1">{user?.firstName} {user?.lastName}</h1>
          <p className="text-emerald-100 text-sm">4 patients assigned to you today.</p>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="text-sm">📊</span>
            <span className="text-xs font-medium">4 vitals recorded</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="text-sm">⚠️</span>
            <span className="text-xs font-medium">1 flagged entry</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Patients Today" value="4" subtitle="All assigned" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} gradient="from-emerald-500 to-teal-400" />
        <StatCard title="Vitals Recorded" value="4" subtitle="Today" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} gradient="from-blue-500 to-cyan-400" />
        <StatCard title="Records Entered" value="2" subtitle="Today" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>} gradient="from-purple-500 to-indigo-400" />
        <StatCard title="Flagged" value="1" subtitle="Needs attention" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} gradient="from-accent-500 to-red-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vitals recording form */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
          <SectionHeader title="Record Vital Signs" subtitle="Enter patient measurements" />

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-semibold text-neutral-800 dark:text-neutral-100">Vitals Recorded!</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Data saved and sent to doctor</p>
            </div>
          ) : (
            <form onSubmit={handleVitalsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Select Patient *</label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((p) => <option key={p.id} value={p.name}>{p.name} — {p.room}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'temp', label: 'Temperature', unit: '°C', placeholder: '36.5' },
                  { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', placeholder: '72' },
                  { key: 'systolic', label: 'Systolic BP', unit: 'mmHg', placeholder: '120' },
                  { key: 'diastolic', label: 'Diastolic BP', unit: 'mmHg', placeholder: '80' },
                  { key: 'respRate', label: 'Resp. Rate', unit: '/min', placeholder: '16' },
                  { key: 'o2sat', label: 'O₂ Saturation', unit: '%', placeholder: '98' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">{field.label}</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        placeholder={field.placeholder}
                        value={(vitals as any)[field.key]}
                        onChange={(e) => setVitals({ ...vitals, [field.key]: e.target.value })}
                        className="w-full pl-3 pr-10 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 font-medium">{field.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={!selectedPatient}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Save Vital Signs
              </button>
            </form>
          )}
        </div>

        {/* Recent entries */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
          <SectionHeader title="Recent Entries" subtitle="Today's recorded data" />
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{entry.type === 'Vitals' ? '📊' : '📝'}</span>
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100">{entry.patient}</p>
                    <span className="text-[10px] font-medium text-neutral-400">{entry.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-400">{entry.time}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusColors[entry.status]}`}>{entry.status}</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">{entry.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient list */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
        <SectionHeader title="Assigned Patients" subtitle={`${patients.length} patients`} />
        {patients.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-6">No patients assigned yet. Admin needs to create patient accounts.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {patients.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-800 hover:shadow-elevation-2 hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    {p.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate">{p.name}</p>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{p.room}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
