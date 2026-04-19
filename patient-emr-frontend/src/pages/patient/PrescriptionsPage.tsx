import React, { useState } from 'react';
import { EmptyState } from '../../components/dashboard/EmptyState';

const prescriptions = [
  { id: 1, medication: 'Metformin 500mg', doctor: 'Dr. James Smith', frequency: 'Twice daily (morning & evening)', startDate: 'Nov 1, 2024', endDate: 'Feb 1, 2025', refills: 2, daysLeft: 14, isActive: true, instructions: 'Take with food to reduce stomach upset. Do not crush or chew tablets.', condition: 'Type 2 Diabetes' },
  { id: 2, medication: 'Lisinopril 10mg', doctor: 'Dr. Sarah Lee', frequency: 'Once daily (morning)', startDate: 'Oct 15, 2024', endDate: 'Apr 15, 2025', refills: 5, daysLeft: 28, isActive: true, instructions: 'Take at the same time each day. Monitor blood pressure regularly.', condition: 'Hypertension' },
  { id: 3, medication: 'Atorvastatin 20mg', doctor: 'Dr. Sarah Lee', frequency: 'Once daily (bedtime)', startDate: 'Dec 1, 2024', endDate: 'Jun 1, 2025', refills: 3, daysLeft: 7, isActive: true, instructions: 'Take at bedtime. Avoid grapefruit juice. Report any muscle pain.', condition: 'High Cholesterol' },
  { id: 4, medication: 'Amoxicillin 500mg', doctor: 'Dr. James Smith', frequency: 'Three times daily', startDate: 'Nov 10, 2024', endDate: 'Nov 20, 2024', refills: 0, daysLeft: 0, isActive: false, instructions: 'Complete the full course even if feeling better.', condition: 'Bacterial Infection' },
];

export const PrescriptionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const active = prescriptions.filter(p => p.isActive);
  const past = prescriptions.filter(p => !p.isActive);
  const displayed = activeTab === 'active' ? active : past;

  const getDaysLeftColor = (days: number) => {
    if (days <= 7) return 'text-error-600 dark:text-error-400';
    if (days <= 14) return 'text-accent-600 dark:text-accent-400';
    return 'text-secondary-600 dark:text-secondary-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Prescriptions</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Your medication history</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active', value: active.length, icon: '💊', color: 'from-emerald-500 to-teal-400' },
          { label: 'Refills Available', value: active.reduce((s, p) => s + p.refills, 0), icon: '🔄', color: 'from-blue-500 to-cyan-400' },
          { label: 'Expiring Soon', value: active.filter(p => p.daysLeft <= 7).length, icon: '⏰', color: 'from-accent-500 to-red-400' },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4 shadow-elevation-1">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-lg mb-3 shadow-elevation-1`}>{card.icon}</div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{card.value}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
        {(['active', 'past'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${activeTab === tab ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-elevation-1' : 'text-neutral-500 dark:text-neutral-400'}`}>
            {tab} ({tab === 'active' ? active.length : past.length})
          </button>
        ))}
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-8">
          <EmptyState icon="💊" title="No prescriptions" description="No prescriptions found in this category." />
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((rx, i) => {
            const isExpanded = expandedId === rx.id;
            return (
              <div key={rx.id} className={`bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden transition-all duration-300 animate-fade-up ${rx.daysLeft <= 7 && rx.isActive ? 'border-l-4 border-l-error-400' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
                <button className="w-full flex items-center gap-4 p-5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors" onClick={() => setExpandedId(isExpanded ? null : rx.id)}>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-xl flex-shrink-0">💊</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-neutral-900 dark:text-white">{rx.medication}</h3>
                      {rx.daysLeft <= 7 && rx.isActive && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-error-100 text-error-700 dark:bg-error-900/40 dark:text-error-300">⚠ Expiring Soon</span>}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{rx.condition} · {rx.frequency}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {rx.isActive ? (
                      <>
                        <p className={`text-sm font-bold ${getDaysLeftColor(rx.daysLeft)}`}>{rx.daysLeft} days left</p>
                        <p className="text-xs text-neutral-400">{rx.refills} refills</p>
                      </>
                    ) : (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">Completed</span>
                    )}
                  </div>
                  <svg className={`w-4 h-4 text-neutral-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isExpanded && (
                  <div className="border-t border-neutral-100 dark:border-neutral-800 p-5 animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      {[
                        { label: 'Prescribed by', value: rx.doctor },
                        { label: 'Condition', value: rx.condition },
                        { label: 'Start Date', value: rx.startDate },
                        { label: 'End Date', value: rx.endDate },
                        { label: 'Frequency', value: rx.frequency },
                        { label: 'Refills Remaining', value: `${rx.refills} refills` },
                      ].map(row => (
                        <div key={row.label}>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{row.label}</p>
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5">{row.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Instructions</p>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">{rx.instructions}</p>
                    </div>
                    {rx.isActive && rx.daysLeft <= 14 && (
                      <button className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 shadow-elevation-1 transition-all hover:scale-[1.02]">
                        Request Refill
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
