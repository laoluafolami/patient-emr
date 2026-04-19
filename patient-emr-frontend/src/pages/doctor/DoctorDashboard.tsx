import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { SectionHeader } from '../../components/dashboard/SectionHeader';

const patients = [
  { id: 1, name: 'John Doe', age: 45, condition: 'Hypertension', lastVisit: 'Today', status: 'active', avatar: '👤' },
  { id: 2, name: 'Mary Johnson', age: 32, condition: 'Diabetes Type 2', lastVisit: 'Yesterday', status: 'active', avatar: '👤' },
  { id: 3, name: 'Robert Chen', age: 58, condition: 'Cardiac Arrhythmia', lastVisit: 'Dec 10', status: 'monitoring', avatar: '👤' },
  { id: 4, name: 'Sarah Williams', age: 27, condition: 'Asthma', lastVisit: 'Dec 8', status: 'stable', avatar: '👤' },
  { id: 5, name: 'David Brown', age: 63, condition: 'COPD', lastVisit: 'Dec 5', status: 'monitoring', avatar: '👤' },
];

const todaySchedule = [
  { time: '09:00', patient: 'John Doe', type: 'Follow-up', duration: '30 min', status: 'completed' },
  { time: '10:00', patient: 'Mary Johnson', type: 'Consultation', duration: '45 min', status: 'completed' },
  { time: '14:30', patient: 'Robert Chen', type: 'Review', duration: '30 min', status: 'upcoming' },
  { time: '15:30', patient: 'Sarah Williams', type: 'New Patient', duration: '60 min', status: 'upcoming' },
];

const pendingLabs = [
  { patient: 'John Doe', test: 'HbA1c', date: 'Dec 12', priority: 'normal' },
  { patient: 'Robert Chen', test: 'ECG Report', date: 'Dec 11', priority: 'urgent' },
  { patient: 'David Brown', test: 'Pulmonary Function', date: 'Dec 10', priority: 'normal' },
];

const statusColors: Record<string, string> = {
  active: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300',
  monitoring: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
  stable: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  completed: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  upcoming: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
};

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-400 p-6 text-white shadow-elevation-3">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-purple-100 text-sm font-medium mb-1">Welcome back, Doctor 👨‍⚕️</p>
          <h1 className="text-2xl font-bold font-headline mb-1">Dr. {user?.firstName} {user?.lastName}</h1>
          <p className="text-purple-100 text-sm">You have 4 appointments scheduled today.</p>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="text-sm">👥</span>
            <span className="text-xs font-medium">5 active patients</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="text-sm">🔬</span>
            <span className="text-xs font-medium">3 labs to review</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="text-sm">📝</span>
            <span className="text-xs font-medium">2 reports pending</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Patients" value="4" subtitle="2 remaining" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} gradient="from-purple-500 to-indigo-400" />
        <StatCard title="Total Patients" value="5" subtitle="Under active care" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} gradient="from-blue-500 to-cyan-400" />
        <StatCard title="Pending Labs" value="3" subtitle="1 urgent" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>} gradient="from-orange-500 to-amber-400" />
        <StatCard title="Reports Due" value="2" subtitle="This week" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} gradient="from-emerald-500 to-teal-400" />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient list */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
          <SectionHeader
            title="My Patients"
            subtitle="Search and manage patient records"
            action={<button className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">View All</button>}
          />
          {/* Search */}
          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patients by name or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all"
            />
          </div>
          <div className="space-y-2">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center font-bold text-purple-600 dark:text-purple-400 text-sm flex-shrink-0">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{patient.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{patient.condition} · Age {patient.age}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{patient.lastVisit}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[patient.status]}`}>{patient.status}</span>
                </div>
                <svg className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-purple-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Today's schedule */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
          <SectionHeader title="Today's Schedule" subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} />
          <div className="space-y-3">
            {todaySchedule.map((slot, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${slot.status === 'upcoming' ? 'bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40' : 'bg-neutral-50 dark:bg-neutral-800/50'}`}>
                <div className="text-right flex-shrink-0 w-12">
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-200">{slot.time}</p>
                  <p className="text-[10px] text-neutral-400">{slot.duration}</p>
                </div>
                <div className={`w-0.5 self-stretch rounded-full flex-shrink-0 ${slot.status === 'upcoming' ? 'bg-purple-400' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate">{slot.patient}</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{slot.type}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusColors[slot.status]}`}>{slot.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending labs */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
        <SectionHeader title="Lab Results to Review" subtitle="Pending your review" action={<button className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">View All</button>} />
        <div className="grid sm:grid-cols-3 gap-3">
          {pendingLabs.map((lab, i) => (
            <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-elevation-2 hover:-translate-y-0.5 ${lab.priority === 'urgent' ? 'bg-accent-50 dark:bg-accent-950/20 border-accent-200 dark:border-accent-800/50' : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-800'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${lab.priority === 'urgent' ? 'bg-accent-100 dark:bg-accent-900/40' : 'bg-purple-100 dark:bg-purple-900/40'}`}>
                🔬
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate">{lab.test}</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{lab.patient}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {lab.priority === 'urgent' && <span className="text-[10px] font-bold text-accent-600 dark:text-accent-400">⚠ Urgent</span>}
                  <span className="text-[10px] text-neutral-400">{lab.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
