import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const patients = [
  { id: 1, name: 'John Doe', patientId: 'P-001', age: 45, condition: 'Hypertension, Type 2 Diabetes', bloodType: 'O+', allergies: 'Penicillin' },
  { id: 2, name: 'Mary Johnson', patientId: 'P-002', age: 32, condition: 'Type 2 Diabetes', bloodType: 'A+', allergies: 'None known' },
  { id: 3, name: 'Robert Chen', patientId: 'P-003', age: 58, condition: 'Cardiac Arrhythmia', bloodType: 'B-', allergies: 'Aspirin, Sulfa drugs' },
];

const patientHistory: Record<number, { vitals: any; lastVisit: string; medications: string[] }> = {
  1: { vitals: { bp: '138/88', hr: '82', temp: '36.8', o2: '97' }, lastVisit: 'Dec 10, 2024', medications: ['Metformin 500mg', 'Lisinopril 10mg'] },
  2: { vitals: { bp: '122/78', hr: '74', temp: '36.6', o2: '99' }, lastVisit: 'Dec 8, 2024', medications: ['Metformin 1000mg'] },
  3: { vitals: { bp: '145/92', hr: '88', temp: '37.1', o2: '96' }, lastVisit: 'Dec 5, 2024', medications: ['Amiodarone 200mg', 'Warfarin 5mg'] },
};

type ConsultStep = 'select' | 'active' | 'complete';

export const ConsultationPage: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<ConsultStep>('select');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [prescription, setPrescription] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (step !== 'active') return;
    autoSaveRef.current = setInterval(() => {
      if (notes || diagnosis || chiefComplaint) {
        setIsSaving(true);
        setTimeout(() => {
          setIsSaving(false);
          setLastSaved(new Date());
        }, 800);
      }
    }, 30000);
    return () => { if (autoSaveRef.current) clearInterval(autoSaveRef.current); };
  }, [step, notes, diagnosis, chiefComplaint]);

  const handleStart = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
    setStep('active');
    setNotes('');
    setDiagnosis('');
    setChiefComplaint('');
    setPrescription('');
    setLastSaved(null);
  };

  const handleManualSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); setLastSaved(new Date()); }, 800);
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsCompleting(false);
    setStep('complete');
  };

  const history = selectedPatient ? patientHistory[selectedPatient.id] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Consultations</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Conduct and document patient consultations</p>
      </div>

      {/* Step: Select patient */}
      {step === 'select' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1">
            <h2 className="font-bold text-neutral-800 dark:text-neutral-100 mb-4">Select Patient to Consult</h2>
            <div className="space-y-3">
              {patients.map((patient, i) => (
                <div key={patient.id} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200 cursor-pointer group animate-fade-up border border-transparent hover:border-purple-200 dark:hover:border-purple-800/50"
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={() => handleStart(patient)}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-elevation-1">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-neutral-800 dark:text-neutral-100">{patient.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{patient.condition} · Age {patient.age}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>Blood: {patientHistory[patient.id]?.vitals.bp}</span>
                    <svg className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step: Active consultation */}
      {step === 'active' && selectedPatient && history && (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Patient info sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-400 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-white">{selectedPatient.name}</p>
                    <p className="text-purple-100 text-xs">{selectedPatient.patientId} · Age {selectedPatient.age}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">Current Vitals</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'BP', value: history.vitals.bp, unit: 'mmHg' },
                      { label: 'HR', value: history.vitals.hr, unit: 'bpm' },
                      { label: 'Temp', value: history.vitals.temp, unit: '°C' },
                      { label: 'O₂', value: history.vitals.o2, unit: '%' },
                    ].map(v => (
                      <div key={v.label} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-2.5 text-center">
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{v.label}</p>
                        <p className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-100">{v.value}</p>
                        <p className="text-[9px] text-neutral-400">{v.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1.5">Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPatient.condition.split(', ').map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-accent-50 dark:bg-accent-950/20 border border-accent-100 dark:border-accent-900/40">
                  <p className="text-[10px] font-semibold text-accent-700 dark:text-accent-300">⚠ Allergies</p>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5">{selectedPatient.allergies}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1.5">Current Medications</p>
                  <div className="space-y-1">
                    {history.medications.map(med => (
                      <div key={med} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="text-sm">💊</span>
                        {med}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Auto-save indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {isSaving ? 'Saving...' : lastSaved ? `Auto-saved at ${lastSaved.toLocaleTimeString()}` : 'Auto-saves every 30 seconds'}
                </span>
              </div>
              <button onClick={handleManualSave} disabled={isSaving}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline disabled:opacity-50">
                Save Now
              </button>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 p-5 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Chief Complaint *</label>
                <input type="text" value={chiefComplaint} onChange={e => setChiefComplaint(e.target.value)}
                  placeholder="Patient's primary reason for visit..."
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Consultation Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6}
                  placeholder="Document your clinical findings, observations, and assessment..."
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all resize-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Diagnosis</label>
                <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                  placeholder="Primary diagnosis..."
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">Prescription / Treatment Plan</label>
                <textarea value={prescription} onChange={e => setPrescription(e.target.value)} rows={3}
                  placeholder="Medications, dosages, and treatment instructions..."
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('select')} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                  Cancel
                </button>
                <button onClick={handleComplete} disabled={!chiefComplaint.trim() || isCompleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 shadow-elevation-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  {isCompleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Completing...
                    </span>
                  ) : 'Complete Consultation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step: Complete */}
      {step === 'complete' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-scale-in">
          <div className="w-24 h-24 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white mb-2">Consultation Complete</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-2">Consultation with <strong className="text-neutral-700 dark:text-neutral-300">{selectedPatient?.name}</strong> has been saved.</p>
          <p className="text-sm text-neutral-400 mb-8">The patient's record has been updated and is available in their portal.</p>
          <div className="flex gap-3">
            <button onClick={() => setStep('select')} className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 shadow-elevation-2 transition-all hover:scale-[1.02]">
              New Consultation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
