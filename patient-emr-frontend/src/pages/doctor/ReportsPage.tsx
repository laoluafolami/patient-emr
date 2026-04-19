import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/dashboard/EmptyState';

const patients = ['John Doe', 'Mary Johnson', 'Robert Chen', 'Sarah Williams', 'David Brown'];

const existingReports = [
  { id: 1, patient: 'John Doe', title: 'Annual Physical Examination', date: 'Dec 10, 2024', type: 'Physical', summary: 'Patient presents in good overall health. Blood pressure slightly elevated. Recommend dietary changes and follow-up in 3 months.' },
  { id: 2, patient: 'Mary Johnson', title: 'Diabetes Management Review', date: 'Dec 8, 2024', type: 'Follow-up', summary: 'HbA1c improved from 8.1% to 7.2%. Continue current medication regimen. Patient compliant with dietary recommendations.' },
  { id: 3, patient: 'Robert Chen', title: 'Cardiac Arrhythmia Assessment', date: 'Dec 5, 2024', type: 'Specialist', summary: 'ECG shows intermittent atrial fibrillation. Recommend Holter monitor for 24-hour assessment. Refer to cardiologist.' },
];

const reportTypes = ['Physical', 'Follow-up', 'Specialist', 'Emergency', 'Discharge', 'Consultation'];

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [showNew, setShowNew] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof existingReports[0] | null>(null);
  const [form, setForm] = useState({ patient: '', title: '', type: 'Follow-up', content: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowNew(false); setForm({ patient: '', title: '', type: 'Follow-up', content: '' }); }, 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Clinical Reports</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Write and manage patient clinical documentation</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 shadow-elevation-2 transition-all hover:scale-[1.03]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Report
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Reports list */}
        <div className="lg:col-span-2 space-y-3">
          {existingReports.map((report, i) => (
            <div key={report.id} onClick={() => setSelectedReport(report)}
              className={`bg-white dark:bg-neutral-900 rounded-2xl border shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer animate-fade-up ${selectedReport?.id === report.id ? 'border-purple-300 dark:border-purple-700 ring-2 ring-purple-200 dark:ring-purple-900/40' : 'border-neutral-100 dark:border-neutral-800'}`}
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-lg flex-shrink-0">📋</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 truncate">{report.title}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{report.patient}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">{report.type}</span>
                      <span className="text-[10px] text-neutral-400">{report.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report detail */}
        <div className="lg:col-span-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden">
          {selectedReport ? (
            <div className="animate-fade-in h-full flex flex-col">
              <div className="p-5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-xl flex-shrink-0">📋</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-900 dark:text-white">{selectedReport.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{selectedReport.patient}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">{selectedReport.type}</span>
                      <span className="text-xs text-neutral-400">{selectedReport.date}</span>
                      <span className="text-xs text-neutral-400">· Dr. {user?.lastName}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-5">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{selectedReport.summary}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <EmptyState icon="📋" title="Select a report" description="Click on a report to view its contents." />
            </div>
          )}
        </div>
      </div>

      {/* New Report Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNew(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-elevation-4 w-full max-w-2xl border border-neutral-100 dark:border-neutral-800 animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-400" />
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-white">Write Clinical Report</h3>
              <button onClick={() => setShowNew(false)} className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {saved ? (
              <div className="p-8 text-center animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="font-semibold text-neutral-800 dark:text-neutral-100">Report Saved!</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Added to patient's medical record.</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Patient *</label>
                    <select required value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all">
                      <option value="">Select patient...</option>
                      {patients.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Report Type *</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all">
                      {reportTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Report Title *</label>
                  <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Annual Physical Examination"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Clinical Content *</label>
                  <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8}
                    placeholder="Document your clinical findings, assessment, diagnosis, and treatment plan..."
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-400 disabled:opacity-60 transition-all">
                    {saving ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</span> : 'Save Report'}
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
