import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { SectionHeader } from '../../components/dashboard/SectionHeader';

const appointments = [
  { id: 1, doctor: 'Dr. James Smith', specialty: 'General Practice', date: 'Today', time: '2:30 PM', status: 'confirmed', avatar: '👨‍⚕️' },
  { id: 2, doctor: 'Dr. Sarah Lee', specialty: 'Cardiology', date: 'Tomorrow', time: '10:00 AM', status: 'scheduled', avatar: '👩‍⚕️' },
  { id: 3, doctor: 'Dr. Michael Chen', specialty: 'Dermatology', date: 'Dec 20', time: '3:15 PM', status: 'scheduled', avatar: '👨‍⚕️' },
];

const labResults = [
  { id: 1, test: 'Complete Blood Count', date: 'Dec 10, 2024', status: 'reviewed', flag: false },
  { id: 2, test: 'Lipid Panel', date: 'Dec 8, 2024', status: 'completed', flag: true },
  { id: 3, test: 'Thyroid Function', date: 'Dec 5, 2024', status: 'reviewed', flag: false },
];

const prescriptions = [
  { id: 1, medication: 'Metformin 500mg', frequency: 'Twice daily', refills: 2, daysLeft: 14 },
  { id: 2, medication: 'Lisinopril 10mg', frequency: 'Once daily', refills: 5, daysLeft: 28 },
  { id: 3, medication: 'Atorvastatin 20mg', frequency: 'Once at bedtime', refills: 3, daysLeft: 7 },
];

const messages = [
  { id: 1, from: 'Dr. James Smith', preview: 'Your recent blood work results look good. Please continue...', time: '2h ago', unread: true },
  { id: 2, from: 'Dr. Sarah Lee', preview: 'Reminder: Please take your medication with food to avoid...', time: '1d ago', unread: false },
];

const vitals = [
  { name: 'Heart Rate', value: '72', unit: 'bpm', icon: '❤️', status: 'normal', color: 'text-secondary-600 dark:text-secondary-400' },
  { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: '🩺', status: 'normal', color: 'text-secondary-600 dark:text-secondary-400' },
  { name: 'Temperature', value: '36.6', unit: '°C', icon: '🌡️', status: 'normal', color: 'text-secondary-600 dark:text-secondary-400' },
  { name: 'O₂ Saturation', value: '98', unit: '%', icon: '💨', status: 'normal', color: 'text-secondary-600 dark:text-secondary-400' },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300',
  scheduled: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  reviewed: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300',
  completed: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
};

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 p-6 text-white shadow-elevation-3">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/10 blur-xl" />
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium mb-1">{greeting} 👋</p>
          <h1 className="text-2xl font-bold font-headline mb-1">{user?.firstName} {user?.lastName}</h1>
          <p className="text-blue-100 text-sm">Here's your health overview for today.</p>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="text-sm">📅</span>
            <span className="text-xs font-medium">1 appointment today</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="text-sm">💊</span>
            <span className="text-xs font-medium">3 active prescriptions</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="text-sm">💬</span>
            <span className="text-xs font-medium">1 unread message</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Appointments" value="3" subtitle="2 upcoming" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} gradient="from-blue-500 to-cyan-400" />
        <StatCard title="Lab Results" value="3" subtitle="1 flagged" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} gradient="from-purple-500 to-indigo-400" />
        <StatCard title="Prescriptions" value="3" subtitle="1 refill soon" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>} gradient="from-emerald-500 to-teal-400" />
        <StatCard title="Messages" value="2" subtitle="1 unread" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>} gradient="from-orange-500 to-amber-400" />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointments */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
          <SectionHeader
            title="Upcoming Appointments"
            subtitle="Your scheduled consultations"
            action={
              <button className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">Book New</button>
            }
          />
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors duration-200 cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xl flex-shrink-0">
                  {apt.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{apt.doctor}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{apt.specialty}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">{apt.date}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{apt.time}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${statusColors[apt.status]}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Vitals */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
          <SectionHeader title="Latest Vitals" subtitle="Last recorded: Today" />
          <div className="space-y-3">
            {vitals.map((v) => (
              <div key={v.name} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{v.icon}</span>
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{v.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold font-mono ${v.color}`}>{v.value}</span>
                  <span className="text-[10px] text-neutral-400">{v.unit}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lab Results */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
          <SectionHeader title="Recent Lab Results" subtitle="Latest test results" action={<button className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">View All</button>} />
          <div className="space-y-3">
            {labResults.map((lab) => (
              <div key={lab.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{lab.test}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{lab.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {lab.flag && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">⚠ Flag</span>}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[lab.status]}`}>{lab.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages + Prescriptions */}
        <div className="space-y-4">
          {/* Messages */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
            <SectionHeader title="Messages" subtitle="From your care team" action={<button className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">View All</button>} />
            <div className="space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${msg.unread ? 'bg-blue-50 dark:bg-blue-950/20' : 'bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-sm flex-shrink-0">👨‍⚕️</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100">{msg.from}</p>
                      <span className="text-[10px] text-neutral-400">{msg.time}</span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{msg.preview}</p>
                  </div>
                  {msg.unread && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                </div>
              ))}
            </div>
          </div>

          {/* Prescriptions */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
            <SectionHeader title="Active Prescriptions" />
            <div className="space-y-2">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-sm flex-shrink-0">💊</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate">{rx.medication}</p>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{rx.frequency}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-bold ${rx.daysLeft <= 7 ? 'text-accent-600 dark:text-accent-400' : 'text-neutral-600 dark:text-neutral-400'}`}>{rx.daysLeft}d left</p>
                    <p className="text-[10px] text-neutral-400">{rx.refills} refills</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
