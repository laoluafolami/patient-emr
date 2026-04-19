import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout, NavItem } from '../../layouts/DashboardLayout';
import { DoctorDashboard } from './DoctorDashboard';
import { PatientsPage } from './PatientsPage';
import { ConsultationPage } from './ConsultationPage';
import { DoctorLabResultsPage } from './LabResultsPage';
import { ReportsPage } from './ReportsPage';
import { SchedulePage } from './SchedulePage';
import { DoctorMessagesPage } from './DoctorMessagesPage';

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/doctor/dashboard',
    section: 'Overview',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    id: 'patients',
    label: 'My Patients',
    path: '/doctor/patients',
    section: 'Clinical',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    id: 'consultations',
    label: 'Consultations',
    path: '/doctor/consultations',
    section: 'Clinical',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  },
  {
    id: 'lab-results',
    label: 'Lab Results',
    path: '/doctor/lab-results',
    section: 'Clinical',
    badge: 3,
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/doctor/reports',
    section: 'Clinical',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    id: 'prescriptions',
    label: 'Prescriptions',
    path: '/doctor/prescriptions',
    section: 'Clinical',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    id: 'schedule',
    label: 'Schedule',
    path: '/doctor/schedule',
    section: 'Planning',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
  {
    id: 'messages',
    label: 'Messages',
    path: '/doctor/messages',
    section: 'Communication',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  },
];

const ComingSoon: React.FC<{ page: string }> = ({ page }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
    <div className="text-5xl mb-4">🚧</div>
    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">{page}</h2>
    <p className="text-sm text-neutral-500 dark:text-neutral-400">This section is coming in the next phase.</p>
  </div>
);

export const DoctorPortal: React.FC = () => (
  <DashboardLayout navItems={navItems} role="DOCTOR">
    <Routes>
      <Route path="dashboard" element={<DoctorDashboard />} />
      <Route path="patients" element={<PatientsPage />} />
      <Route path="consultations" element={<ConsultationPage />} />
      <Route path="lab-results" element={<DoctorLabResultsPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="prescriptions" element={<ComingSoon page="Prescriptions" />} />
      <Route path="schedule" element={<SchedulePage />} />
      <Route path="messages" element={<DoctorMessagesPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </DashboardLayout>
);
