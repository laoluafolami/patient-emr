import React, { useState } from 'react';
import { EmptyState } from '../../components/dashboard/EmptyState';

const labResults = [
  {
    id: 1, testName: 'Complete Blood Count (CBC)', date: 'Dec 10, 2024', doctor: 'Dr. James Smith', status: 'reviewed',
    results: [
      { name: 'WBC', value: '7.2', unit: 'K/µL', range: '4.5–11.0', normal: true },
      { name: 'RBC', value: '4.8', unit: 'M/µL', range: '4.5–5.5', normal: true },
      { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '13.5–17.5', normal: true },
      { name: 'Hematocrit', value: '42', unit: '%', range: '41–53', normal: true },
      { name: 'Platelets', value: '285', unit: 'K/µL', range: '150–400', normal: true },
    ],
    notes: 'All values within normal range. Continue current medications.',
    flag: false,
  },
  {
    id: 2, testName: 'Lipid Panel', date: 'Dec 8, 2024', doctor: 'Dr. Sarah Lee', status: 'completed',
    results: [
      { name: 'Total Cholesterol', value: '215', unit: 'mg/dL', range: '<200', normal: false },
      { name: 'LDL', value: '138', unit: 'mg/dL', range: '<100', normal: false },
      { name: 'HDL', value: '52', unit: 'mg/dL', range: '>40', normal: true },
      { name: 'Triglycerides', value: '145', unit: 'mg/dL', range: '<150', normal: true },
    ],
    notes: 'LDL and total cholesterol slightly elevated. Dietary changes recommended. Follow-up in 3 months.',
    flag: true,
  },
  {
    id: 3, testName: 'Thyroid Function (TSH)', date: 'Dec 5, 2024', doctor: 'Dr. James Smith', status: 'reviewed',
    results: [
      { name: 'TSH', value: '2.1', unit: 'mIU/L', range: '0.4–4.0', normal: true },
      { name: 'Free T4', value: '1.2', unit: 'ng/dL', range: '0.8–1.8', normal: true },
    ],
    notes: 'Thyroid function normal.',
    flag: false,
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  reviewed: { label: 'Reviewed', color: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300' },
  completed: { label: 'Ready', color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' },
  pending: { label: 'Pending', color: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300' },
};

export const LabResultsPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'flagged'>('all');

  const filtered = filter === 'flagged' ? labResults.filter(r => r.flag) : labResults;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Lab Results</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Your medical test results</p>
        </div>
        <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          {(['all', 'flagged'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${filter === f ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-elevation-1' : 'text-neutral-500 dark:text-neutral-400'}`}>
              {f === 'flagged' ? '⚠ Flagged' : 'All Results'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Tests', value: labResults.length, icon: '🧪', color: 'from-purple-500 to-indigo-400' },
          { label: 'Flagged', value: labResults.filter(r => r.flag).length, icon: '⚠️', color: 'from-accent-500 to-red-400' },
          { label: 'Reviewed', value: labResults.filter(r => r.status === 'reviewed').length, icon: '✅', color: 'from-secondary-500 to-green-400' },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4 shadow-elevation-1">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-lg mb-3 shadow-elevation-1`}>{card.icon}</div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{card.value}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Results list */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-8">
          <EmptyState icon="🧪" title="No flagged results" description="All your lab results are within normal range." />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((result, i) => {
            const isExpanded = expandedId === result.id;
            const sc = statusConfig[result.status];
            return (
              <div key={result.id} className={`bg-white dark:bg-neutral-900 rounded-2xl border shadow-elevation-1 overflow-hidden transition-all duration-300 animate-fade-up ${result.flag ? 'border-accent-200 dark:border-accent-800/50' : 'border-neutral-100 dark:border-neutral-800'}`} style={{ animationDelay: `${i * 60}ms` }}>
                {/* Result header */}
                <button className="w-full flex items-center gap-4 p-5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors" onClick={() => setExpandedId(isExpanded ? null : result.id)}>
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${result.flag ? 'bg-accent-100 dark:bg-accent-900/40' : 'bg-purple-100 dark:bg-purple-900/40'}`}>
                    🔬
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-neutral-900 dark:text-white">{result.testName}</h3>
                      {result.flag && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">⚠ Flagged</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{result.date}</span>
                      <span>•</span>
                      <span>{result.doctor}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.color}`}>{sc.label}</span>
                    <svg className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-neutral-100 dark:border-neutral-800 p-5 animate-fade-in">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                            <th className="text-left pb-3">Test</th>
                            <th className="text-right pb-3">Result</th>
                            <th className="text-right pb-3">Unit</th>
                            <th className="text-right pb-3">Reference Range</th>
                            <th className="text-right pb-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                          {result.results.map((r, j) => (
                            <tr key={j} className={`${!r.normal ? 'bg-accent-50/50 dark:bg-accent-950/10' : ''}`}>
                              <td className="py-2.5 font-medium text-neutral-800 dark:text-neutral-100">{r.name}</td>
                              <td className={`py-2.5 text-right font-bold font-mono ${r.normal ? 'text-neutral-800 dark:text-neutral-100' : 'text-accent-600 dark:text-accent-400'}`}>{r.value}</td>
                              <td className="py-2.5 text-right text-neutral-500 dark:text-neutral-400">{r.unit}</td>
                              <td className="py-2.5 text-right text-neutral-500 dark:text-neutral-400">{r.range}</td>
                              <td className="py-2.5 text-right">
                                {r.normal
                                  ? <span className="text-secondary-600 dark:text-secondary-400 font-semibold text-xs">Normal</span>
                                  : <span className="text-accent-600 dark:text-accent-400 font-semibold text-xs">⚠ Abnormal</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {result.notes && (
                      <div className="mt-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40">
                        <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-1">Doctor's Notes</p>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">{result.notes}</p>
                      </div>
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
