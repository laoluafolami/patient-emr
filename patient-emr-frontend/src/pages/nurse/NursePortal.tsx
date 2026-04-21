import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout, NavItem } from '../../layouts/DashboardLayout';
import { NurseDashboard } from './NurseDashboard';
import { VitalsPage } from './VitalsPage';
import { PatientRecordsPage } from './PatientRecordsPage';
import { ProfilePage } from '../shared/ProfilePage';
import { ChangePasswordPage } from '../shared/ChangePasswordPage';

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/nurse/dashboard',
    section: 'Overview',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    id: 'vitals',
    label: 'Record Vitals',
    path: '/nurse/vitals',
    section: 'Patient Care',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
  {
    id: 'patient-records',
    label: 'Patient Records',
    path: '/nurse/patient-records',
    section: 'Patient Care',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  },
  {
    id: 'patients',
    label: 'My Patients',
    path: '/nurse/patients',
    section: 'Patient Care',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    id: 'history',
    label: 'Entry History',
    path: '/nurse/history',
    section: 'Records',
    icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
];

const ComingSoon: React.FC<{ page: string }> = ({ page }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
    <div className="text-5xl mb-4">🚧</div>
    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">{page}</h2>
    <p className="text-sm text-neutral-500 dark:text-neutral-400">This section is coming in the next phase.</p>
  </div>
);

export const NursePortal: React.FC = () => (
  <DashboardLayout navItems={navItems} role="NURSE">
    <Routes>
      <Route path="dashboard" element={<NurseDashboard />} />
      <Route path="vitals" element={<VitalsPage />} />
      <Route path="patient-records" element={<PatientRecordsPage />} />
      <Route path="patients" element={<ComingSoon page="My Patients" />} />
      <Route path="history" element={<ComingSoon page="Entry History" />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="change-password" element={<ChangePasswordPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </DashboardLayout>
);
