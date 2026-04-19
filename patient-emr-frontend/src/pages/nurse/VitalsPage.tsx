import React, { useState, useEffect } from 'react';
import { EmptyState } from '../../components/dashboard/EmptyState';
import apiClient from '../../services/apiClient';

interface PatientOption { id: string | number; name: string; patientId: string; room: string; doctor: string; }

const FALLBACK_PATIENTS: PatientOption[] = [
  { id: 1, name: 'John Doe', patientId: 'P-001', room: 'OPD-1', doctor: 'Dr. Smith' },
  { id: 2, name: 'Mary Johnson', patientId: 'P-002', room: 'OPD-2', doctor: 'Dr. Smith' },
  { id: 3, name: 'Robert Chen', patientId: 'P-003', room: 'OPD-3', doctor: 'Dr. Smith' },
  { id: 4, name: 'Sarah Williams', patientId: 'P-004', room: 'OPD-4', doctor: 'Dr. Smith' },
  { id: 5, name: 'David Brown', patientId: 'P-005', room: 'OPD-5', doctor: 'Dr. Smith' },
];

const vitalRanges = {
  temp: { min: 36.1, max: 37.2, unit: '°C' },
  systolic: { min: 90, max: 140, unit: 'mmHg' },
  diastolic: { min: 60, max: 90, unit: 'mmHg' },
  heartRate: { min: 60, max: 100, unit: 'bpm' },
  respRate: { min: 12, max: 20, unit: '/min' },
  o2sat: { min: 95, max: 100, unit: '%' },
};

const getVitalStatus = (key: string, value: string): 'normal' | 'elevated' | 'critical' => {
  const num = parseFloat(value);
  if (isNaN(num)) return 'normal';
  const range = vitalRanges[key as keyof typeof vitalRanges];
  if (!range) return 'normal';
  if (num < range.min || num > range.max) {
    const deviation = Math.max(Math.abs(num - range.min) / range.min, Math.abs(num - range.max) / range.max);
    return deviation > 0.2 ? 'critical' : 'elevated';
  }
  return 'normal';
};

export const VitalsPage: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [vitals, setVitals] = useState({ temp: '', systolic: '', diastolic: '', heartRate: '', respRate: '', o2sat: '', weight: '', height: '' });
  const [patients, setPatients] = useState<PatientOption[]>(FALLBACK_PATIENTS);
  const [history, setHistory] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'record' | 'history'>('record');

  useEffect(() => {
    apiClient.get('/patients?limit=100')
      .then(res => {
        const list = res.data?.data?.patients || [];
        if (list.length > 0) {
          setPatients(list.map((p: any, i: number) => ({
            id: p.id,
            name: `${p.firstName} ${p.lastName}`,
            patientId: p.patientProfile?.patientId || `P-${String(i + 1).padStart(3, '0')}`,
            room: 'OPD',
            doctor: 'Assigned Doctor',
          })));
        }
      })
      .catch(() => {});
  }, []);

  const loadHistory = () => {
    apiClient.get('/vitals')
      .then(res => setHistory(res.data?.data?.vitals || []))
      .catch(() => {});
  };

  useEffect(() => { loadHistory(); }, []);

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPatientId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;
    setSubmitting(true);
    try {
      await apiClient.post('/vitals', {
        patientId: selectedPatientId,
        temperature: vitals.temp || undefined,
        systolicBP: vitals.systolic || undefined,
        diastolicBP: vitals.diastolic || undefined,
        heartRate: vitals.heartRate || undefined,
        respiratoryRate: vitals.respRate || undefined,
        oxygenSaturation: vitals.o2sat || undefined,
        weight: vitals.weight || undefined,
        height: vitals.height || undefined,
        notes: notes || undefined,
      });
      setSubmitted(true);
      loadHistory(); // refresh history immediately
      setTimeout(() => {
        setSubmitted(false);
        setVitals({ temp: '', systolic: '', diastolic: '', heartRate: '', respRate: '', o2sat: '', weight: '', height: '' });
        setNotes('');
        setSelectedPatientId('');
      }, 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save vitals. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const vitalFields = [
    { key: 'temp', label: 'Temperature', unit: '°C', placeholder: '36.5', icon: '🌡️' },
    { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', placeholder: '72', icon: '❤️' },
    { key: 'systolic', label: 'Systolic BP', unit: 'mmHg', placeholder: '120', icon: '🩺' },
    { key: 'diastolic', label: 'Diastolic BP', unit: 'mmHg', placeholder: '80', icon: '🩺' },
    { key: 'respRate', label: 'Respiratory Rate', unit: '/min', placeholder: '16', icon: '💨' },
    { key: 'o2sat', label: 'O₂ Saturation', unit: '%', placeholder: '98', icon: '💨' },
    { key: 'weight', label: 'Weight', unit: 'kg', placeholder: '70', icon: '⚖️' },
    { key: 'height', label: 'Height', unit: 'cm', placeholder: '170', icon: '📏' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Vital Signs</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Record and monitor patient vital signs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
        {(['record', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${activeTab === tab ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-elevation-1' : 'text-neutral-500 dark:text-neutral-400'}`}>
            {tab === 'record' ? '📊 Record Vitals' : '📋 History'}
          </button>
        ))}
      </div>

      {activeTab === 'record' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 p-6">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Vitals Recorded!</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Data saved and available to the assigned doctor.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Select Patient *</label>
                  <select required value={selectedPatientId} onChange={handlePatientChange}
                    className="w-full px-3 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all">
                    <option value="">Choose a patient...</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name} — {p.room}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {vitalFields.map(field => {
                    const val = (vitals as any)[field.key];
                    const status = val ? getVitalStatus(field.key, val) : 'normal';
                    return (
                      <div key={field.key}>
                        <label className="flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                          <span>{field.icon}</span>
                          {field.label}
                        </label>
                        <div className="relative">
                          <input type="number" step="0.1" placeholder={field.placeholder} value={val}
                            onChange={e => setVitals({ ...vitals, [field.key]: e.target.value })}
                            className={`w-full pl-3 pr-8 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 transition-all ${
                              val && status !== 'normal'
                                ? status === 'critical' ? 'border-error-400 bg-error-50 dark:bg-error-950/20 focus:ring-error-500/40' : 'border-accent-400 bg-accent-50 dark:bg-accent-950/20 focus:ring-accent-500/40'
                                : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-emerald-500/40 focus:border-emerald-400'
                            } text-neutral-900 dark:text-white`} />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-neutral-400 font-medium">{field.unit}</span>
                        </div>
                        {val && status !== 'normal' && (
                          <p className={`text-[10px] mt-0.5 font-medium ${status === 'critical' ? 'text-error-600 dark:text-error-400' : 'text-accent-600 dark:text-accent-400'}`}>
                            {status === 'critical' ? '⚠ Critical' : '↑ Elevated'}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Additional Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any observations or notes..."
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all resize-none" />
                </div>

                <button type="submit" disabled={!selectedPatientId || submitting}
                  className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Saving...
                    </span>
                  ) : 'Save Vital Signs'}
                </button>
              </form>
            )}
          </div>

          {/* Reference ranges */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 p-5">
            <h3 className="font-bold text-neutral-800 dark:text-neutral-100 mb-4">Normal Ranges</h3>
            <div className="space-y-3">
              {[
                { icon: '🌡️', name: 'Temperature', range: '36.1 – 37.2°C' },
                { icon: '❤️', name: 'Heart Rate', range: '60 – 100 bpm' },
                { icon: '🩺', name: 'Blood Pressure', range: '90/60 – 140/90 mmHg' },
                { icon: '💨', name: 'Respiratory Rate', range: '12 – 20 /min' },
                { icon: '💨', name: 'O₂ Saturation', range: '95 – 100%' },
                { icon: '⚖️', name: 'BMI (Normal)', range: '18.5 – 24.9' },
              ].map(item => (
                <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">{item.name}</p>
                    <p className="text-xs font-mono text-secondary-600 dark:text-secondary-400">{item.range}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-8">
              <EmptyState icon="📊" title="No vitals recorded yet" description="Record patient vitals to see history here." />
            </div>
          ) : (
            history.map((entry: any, i: number) => {
              const patientName = entry.patientProfile?.user
                ? `${entry.patientProfile.user.firstName} ${entry.patientProfile.user.lastName}`
                : 'Unknown Patient';
              const bp = entry.systolicBP && entry.diastolicBP ? `${entry.systolicBP}/${entry.diastolicBP}` : '—';
              const recordedAt = new Date(entry.recordedAt);
              const timeStr = recordedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={entry.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {patientName.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{patientName}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{timeStr} · {recordedAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { label: 'BP', value: bp, unit: 'mmHg' },
                      { label: 'HR', value: entry.heartRate ?? '—', unit: 'bpm' },
                      { label: 'Temp', value: entry.temperature ?? '—', unit: '°C' },
                      { label: 'RR', value: entry.respiratoryRate ?? '—', unit: '/min' },
                      { label: 'O₂', value: entry.oxygenSaturation ?? '—', unit: '%' },
                    ].map(v => (
                      <div key={v.label} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-2.5 text-center">
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{v.label}</p>
                        <p className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-100">{v.value}</p>
                        <p className="text-[9px] text-neutral-400">{v.unit}</p>
                      </div>
                    ))}
                  </div>
                  {entry.notes && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 italic">{entry.notes}</p>}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
