import React, { useState, useEffect } from 'react';
import { EmptyState } from '../../components/dashboard/EmptyState';
import apiClient from '../../services/apiClient';

interface PatientOption { id: string | number; name: string; patientId: string; room: string; doctor: string; }

const FALLBACK_PATIENTS: PatientOption[] = [
  { id: 1, name: 'John Doe', patientId: 'P-001', room: 'OPD-1', doctor: 'Dr. Smith' },
  { id: 2, name: 'Mary Johnson', patientId: 'P-002', room: 'OPD-2', doctor: 'Dr. Smith' },
  { id: 3, name: 'Robert Chen', patientId: 'P-003', room: 'OPD-3', doctor: 'Dr. Smith' },
  { id: 4, name: 'Sarah Williams', patientId: 'P-004', room: 'OPD-4', doctor: 'Dr. Smith' },
];

const recentRecords = [
  { id: 1, patient: 'Mary Johnson', time: '09:45 AM', complaint: 'Fatigue and dizziness', symptoms: 'Persistent fatigue for 3 days, occasional dizziness when standing', observations: 'Patient appears pale, slightly dehydrated', status: 'flagged' },
  { id: 2, patient: 'John Doe', time: '08:30 AM', complaint: 'Routine check-in', symptoms: 'No acute complaints', observations: 'Patient in good spirits, compliant with medications', status: 'normal' },
];

const commonSymptoms = ['Fever', 'Headache', 'Fatigue', 'Nausea', 'Vomiting', 'Chest pain', 'Shortness of breath', 'Dizziness', 'Abdominal pain', 'Back pain', 'Joint pain', 'Cough'];

export const PatientRecordsPage: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [complaint, setComplaint] = useState('');
  const [patients, setPatients] = useState<PatientOption[]>(FALLBACK_PATIENTS);
  const [recentRecords, setRecentRecords] = useState<any[]>([]);

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

  const loadRecords = () => {
    apiClient.get('/records')
      .then(res => setRecentRecords(res.data?.data?.records || []))
      .catch(() => {});
  };

  useEffect(() => { loadRecords(); }, []);

  const [symptoms, setSymptoms] = useState('');
  const [observations, setObservations] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'entry' | 'records'>('entry');

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !complaint) return;
    setSubmitting(true);
    try {
      await apiClient.post('/records', {
        patientId: selectedPatientId,
        chiefComplaint: complaint,
        symptoms: selectedSymptoms.length > 0 ? `${selectedSymptoms.join(', ')}. ${symptoms}`.trim() : symptoms,
        observations,
      });
      setSubmitted(true);
      loadRecords(); // refresh list immediately
      setTimeout(() => {
        setSubmitted(false);
        setSelectedPatientId('');
        setComplaint('');
        setSymptoms('');
        setObservations('');
        setSelectedSymptoms([]);
      }, 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Patient Records</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Enter and manage patient clinical information</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
        {(['entry', 'records'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-elevation-1' : 'text-neutral-500 dark:text-neutral-400'}`}>
            {tab === 'entry' ? '📝 New Entry' : '📋 Recent Records'}
          </button>
        ))}
      </div>

      {activeTab === 'entry' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 p-6">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Record Saved!</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Patient record has been saved and is available to the assigned doctor.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Select Patient *</label>
                  <select required value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all">
                    <option value="">Choose a patient...</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name} — {p.room}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Chief Complaint *</label>
                  <input required type="text" value={complaint} onChange={e => setComplaint(e.target.value)} placeholder="Patient's primary reason for visit..."
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Quick Symptom Selection</label>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptoms.map(s => (
                      <button key={s} type="button" onClick={() => toggleSymptom(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${selectedSymptoms.includes(s) ? 'bg-emerald-500 text-white shadow-elevation-1' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Symptoms Description</label>
                  <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={3}
                    placeholder="Describe symptoms in detail (onset, duration, severity)..."
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Nurse Observations</label>
                  <textarea value={observations} onChange={e => setObservations(e.target.value)} rows={3}
                    placeholder="Your clinical observations about the patient's condition..."
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all resize-none" />
                </div>

                <button type="submit" disabled={!selectedPatientId || !complaint || submitting}
                  className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Saving...
                    </span>
                  ) : 'Save Patient Record'}
                </button>
              </form>
            )}
          </div>

          {/* Tips panel */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 p-5">
            <h3 className="font-bold text-neutral-800 dark:text-neutral-100 mb-4">Documentation Tips</h3>
            <div className="space-y-3">
              {[
                { icon: '✅', tip: 'Be specific about symptom onset and duration' },
                { icon: '✅', tip: 'Note any recent changes in medications' },
                { icon: '✅', tip: 'Document patient\'s pain scale (1-10)' },
                { icon: '✅', tip: 'Record any allergic reactions observed' },
                { icon: '✅', tip: 'Note patient\'s emotional state if relevant' },
                { icon: '⚠️', tip: 'Flag urgent symptoms for immediate doctor review' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <span className="text-sm flex-shrink-0">{item.icon}</span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="space-y-3">
          {recentRecords.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-8">
              <EmptyState icon="📋" title="No records yet" description="Patient records you enter will appear here." />
            </div>
          ) : (
            recentRecords.map((record: any, i: number) => {
              const patientName = record.patientProfile?.user
                ? `${record.patientProfile.user.firstName} ${record.patientProfile.user.lastName}`
                : 'Unknown Patient';
              const timeStr = new Date(record.recordedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={record.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 p-5 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {patientName.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{patientName}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{timeStr} · {new Date(record.recordedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                      <p className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Chief Complaint</p>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">{record.chiefComplaint}</p>
                    </div>
                    {record.symptoms && (
                      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                        <p className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Symptoms</p>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">{record.symptoms}</p>
                      </div>
                    )}
                    {record.observations && (
                      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                        <p className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Observations</p>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">{record.observations}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
