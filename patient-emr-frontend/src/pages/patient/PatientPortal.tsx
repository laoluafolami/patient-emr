import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout, NavItem } from '../../layouts/DashboardLayout';
import { PatientDashboard } from './PatientDashboard';
import { AppointmentsPage } from './AppointmentsPage';
import { LabResultsPage } from './LabResultsPage';
import { PrescriptionsPage } from './PrescriptionsPage';
import { MessagesPage } from './MessagesPage';
import { ProfilePage } from '../shared/ProfilePage';
import { ChangePasswordPage } from '../shared/ChangePasswordPage';

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/patient/dashboard',
    section: 'Overview',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'appointments',
    label: 'Appointments',
    path: '/patient/appointments',
    section: 'My Health',
    badge: 2,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'lab-results',
    label: 'Lab Results',
    path: '/patient/lab-results',
    section: 'My Health',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: 'prescriptions',
    label: 'Prescriptions',
    path: '/patient/prescriptions',
    section: 'My Health',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: 'messages',
    label: 'Messages',
    path: '/patient/messages',
    section: 'Communication',
    badge: 1,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'My Profile',
    path: '/patient/profile',
    section: 'Account',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export const PatientPortal: React.FC = () => (
  <DashboardLayout navItems={navItems} role="PATIENT">
    <Routes>
      <Route path="dashboard" element={<PatientDashboard />} />
      <Route path="appointments" element={<AppointmentsPage />} />
      <Route path="lab-results" element={<LabResultsPage />} />
      <Route path="prescriptions" element={<PrescriptionsPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="change-password" element={<ChangePasswordPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </DashboardLayout>
);
