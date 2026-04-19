import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/dashboard/EmptyState';
import apiClient from '../../services/apiClient';

const FALLBACK_PATIENTS = [
  { id: 1, name: 'John Doe', patientId: 'P-001', age: 45, gender: 'Male', condition: 'Hypertension, Type 2 Diabetes', lastVisit: 'Dec 15, 2024', nextVisit: 'Dec 17, 2024', status: 'active', bloodType: 'O+', phone: '+1 (555) 123-4567', allergies: 'Penicillin' },
  { id: 2, name: 'Mary Johnson', patientId: 'P-002', age: 32, gender: 'Female', condition: 'Type 2 Diabetes', lastVisit: 'Dec 14, 2024', nextVisit: 'Dec 20, 2024', status: 'active', bloodType: 'A+', phone: '+1 (555) 234-5678', allergies: 'None known' },
  { id: 3, name: 'Robert Chen', patientId: 'P-003', age: 58, gender: 'Male', condition: 'Cardiac Arrhythmia', lastVisit: 'Dec 10, 2024', nextVisit: 'Jan 5, 2025', status: 'monitoring', bloodType: 'B-', phone: '+1 (555) 345-6789', allergies: 'Aspirin, Sulfa drugs' },
  { id: 4, name: 'Sarah Williams', patientId: 'P-004', age: 27, gender: 'Female', condition: 'Asthma', lastVisit: 'Dec 8, 2024', nextVisit: 'Jan 8, 2025', status: 'stable', bloodType: 'AB+', phone: '+1 (555) 456-7890', allergies: 'None known' },
  { id: 5, name: 'David Brown', patientId: 'P-005', age: 63, gender: 'Male', condition: 'COPD, Hypertension', lastVisit: 'Dec 5, 2024', nextVisit: 'Dec 19, 2024', status: 'monitoring', bloodType: 'O-', phone: '+1 (555) 567-8901', allergies: 'Codeine' },
];

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: 'Active', color: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300', dot: 'bg-secondary-500' },
  monitoring: { label: 'Monitoring', color: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300', dot: 'bg-accent-500' },
  stable: { label: 'Stable', color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300', dot: 'bg-primary-500' },
};

export const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<typeof FALLBACK_PATIENTS[0] | null>(null);
  const [allPatients, setAllPatients] = useState(FALLBACK_PATIENTS);

  useEffect(() => {
    apiClient.get('/patients?limit=100')
      .then(res => {
        const list = res.data?.data?.patients || [];
        if (list.length > 0) {
          const mapped = list.map((p: any, i: number) => ({
            id: i + 1,
            name: `${p.firstName} ${p.lastName}`,
            patientId: p.patientProfile?.patientId || `P-${String(i + 1).padStart(3, '0')}`,
            age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 0,
            gender: 'N/A',
            condition: 'See medical records',
            lastVisit: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            nextVisit: 'N/A',
            status: 'active',
            bloodType: p.patientProfile?.bloodType || 'N/A',
            phone: p.phone || 'N/A',
            allergies: p.patientProfile?.allergies || 'None known',
          }));
          setAllPatients(mapped);
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const filtered = allPatients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.patientId.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">My Patients</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{allPatients.length} patients under your care</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by name, ID, or condition..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all" />
        </div>
        <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          {['all', 'active', 'monitoring', 'stable'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${statusFilter === s ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-elevation-1' : 'text-neutral-500 dark:text-neutral-400'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Patient list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-8">
              <EmptyState icon="👥" title="No patients found" description="Try adjusting your search or filter." />
            </div>
          ) : (
            filtered.map((patient, i) => {
              const sc = statusConfig[patient.status];
              const isSelected = selectedPatient?.id === patient.id;
              return (
                <div key={patient.id}
                  onClick={() => setSelectedPatient(isSelected ? null : patient)}
                  className={`bg-white dark:bg-neutral-900 rounded-2xl border shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer animate-fade-up ${isSelected ? 'border-purple-300 dark:border-purple-700 ring-2 ring-purple-200 dark:ring-purple-900/40' : 'border-neutral-100 dark:border-neutral-800'}`}
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-elevation-1">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-neutral-900 dark:text-white">{patient.name}</h3>
                        <span className="text-xs text-neutral-400 font-mono">{patient.patientId}</span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">{patient.condition}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-400">
                        <span>Age {patient.age}</span>
                        <span>•</span>
                        <span>{patient.gender}</span>
                        <span>•</span>
                        <span>Last: {patient.lastVisit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.color}`}>{sc.label}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Patient detail panel */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden">
          {selectedPatient ? (
            <div className="animate-fade-in">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-400 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{selectedPatient.name}</h3>
                    <p className="text-purple-100 text-sm">{selectedPatient.patientId}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Quick info */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Age', value: `${selectedPatient.age} years` },
                    { label: 'Gender', value: selectedPatient.gender },
                    { label: 'Blood Type', value: selectedPatient.bloodType },
                    { label: 'Status', value: statusConfig[selectedPatient.status].label },
                  ].map(item => (
                    <div key={item.label} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Condition */}
                <div>
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">Conditions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.condition.split(', ').map(c => (
                      <span key={c} className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">{c}</span>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="p-3 rounded-xl bg-accent-50 dark:bg-accent-950/20 border border-accent-100 dark:border-accent-900/40">
                  <p className="text-xs font-semibold text-accent-700 dark:text-accent-300 mb-1">⚠ Allergies</p>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{selectedPatient.allergies}</p>
                </div>

                {/* Contact */}
                <div>
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">Contact</p>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{selectedPatient.phone}</p>
                </div>

                {/* Visits */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-3">
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Last Visit</p>
                    <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100 mt-0.5">{selectedPatient.lastVisit}</p>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-3">
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Next Visit</p>
                    <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100 mt-0.5">{selectedPatient.nextVisit}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => navigate('/doctor/consultations')}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 shadow-elevation-1 transition-all hover:scale-[1.02]">
                    Start Consultation
                  </button>
                  <button
                    onClick={() => navigate('/doctor/reports')}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/40 transition-all">
                    View Full History
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <EmptyState icon="👤" title="Select a patient" description="Click on a patient to view their details." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
