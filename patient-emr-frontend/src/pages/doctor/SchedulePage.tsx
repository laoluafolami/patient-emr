import React, { useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const appointments = [
  { id: 1, patient: 'John Doe', type: 'Follow-up', day: 'Mon', time: '09:00', duration: 30, status: 'confirmed' },
  { id: 2, patient: 'Mary Johnson', type: 'Consultation', day: 'Mon', time: '10:00', duration: 45, status: 'confirmed' },
  { id: 3, patient: 'Robert Chen', type: 'Review', day: 'Tue', time: '14:00', duration: 30, status: 'scheduled' },
  { id: 4, patient: 'Sarah Williams', type: 'New Patient', day: 'Wed', time: '09:00', duration: 60, status: 'scheduled' },
  { id: 5, patient: 'David Brown', type: 'Follow-up', day: 'Thu', time: '11:00', duration: 30, status: 'confirmed' },
  { id: 6, patient: 'John Doe', type: 'Lab Review', day: 'Fri', time: '15:00', duration: 20, status: 'scheduled' },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300',
  scheduled: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  cancelled: 'bg-error-100 text-error-700 dark:bg-error-900/40 dark:text-error-300',
};

export const SchedulePage: React.FC = () => {
  const [view, setView] = useState<'week' | 'list'>('list');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Schedule</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{today}</p>
        </div>
        <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          {(['list', 'week'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${view === v ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-elevation-1' : 'text-neutral-500 dark:text-neutral-400'}`}>
              {v === 'list' ? '📋 List' : '📅 Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'This Week', value: appointments.length, icon: '📅', color: 'from-purple-500 to-indigo-400' },
          { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, icon: '✅', color: 'from-secondary-500 to-green-400' },
          { label: 'Scheduled', value: appointments.filter(a => a.status === 'scheduled').length, icon: '🕐', color: 'from-primary-500 to-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4 shadow-elevation-1">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3`}>{s.icon}</div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{s.label}</p>
          </div>
        ))}
      </div>

      {view === 'list' ? (
        /* List view */
        <div className="space-y-3">
          {DAYS.map(day => {
            const dayApts = appointments.filter(a => a.day === day);
            if (dayApts.length === 0) return null;
            return (
              <div key={day} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden">
                <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200">{day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday'}</p>
                </div>
                <div className="divide-y divide-neutral-50 dark:divide-neutral-800">
                  {dayApts.map(apt => (
                    <div key={apt.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-purple-50/40 dark:hover:bg-purple-950/10 transition-colors">
                      <div className="text-right w-14 flex-shrink-0">
                        <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200">{apt.time}</p>
                        <p className="text-[10px] text-neutral-400">{apt.duration}min</p>
                      </div>
                      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${apt.status === 'confirmed' ? 'bg-secondary-400' : 'bg-primary-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{apt.patient}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{apt.type}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${statusColors[apt.status]}`}>{apt.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Week grid view */
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="w-16 px-3 py-3 text-xs font-semibold text-neutral-400 text-left">Time</th>
                  {DAYS.map(d => (
                    <th key={d} className="px-2 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                {HOURS.map(hour => (
                  <tr key={hour} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="px-3 py-2 text-xs font-mono text-neutral-400">{hour}</td>
                    {DAYS.map(day => {
                      const apt = appointments.find(a => a.day === day && a.time === hour);
                      return (
                        <td key={day} className="px-1 py-1 text-center">
                          {apt && (
                            <div className={`rounded-lg px-2 py-1.5 text-[10px] font-semibold text-left ${apt.status === 'confirmed' ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'}`}>
                              <p className="truncate">{apt.patient}</p>
                              <p className="opacity-70">{apt.type}</p>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
