import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Landing page
import LandingPage from './pages/landing/LandingPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Dashboard redirect
import DashboardRedirect from './pages/DashboardRedirect';

// Role portals
import { PatientPortal } from './pages/patient/PatientPortal';
import { DoctorPortal } from './pages/doctor/DoctorPortal';
import { NursePortal } from './pages/nurse/NursePortal';
import { AdminPortal } from './pages/admin/AdminPortal';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Smart dashboard redirect — routes by role */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* Patient portal */}
            <Route
              path="/patient/*"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PatientPortal />
                </ProtectedRoute>
              }
            />

            {/* Doctor portal */}
            <Route
              path="/doctor/*"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DoctorPortal />
                </ProtectedRoute>
              }
            />

            {/* Nurse portal */}
            <Route
              path="/nurse/*"
              element={
                <ProtectedRoute allowedRoles={['NURSE']}>
                  <NursePortal />
                </ProtectedRoute>
              }
            />

            {/* Admin portal */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminPortal />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ErrorBoundary>
  );
}

export default App;
