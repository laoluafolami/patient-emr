import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Redirects authenticated users to their role-specific dashboard
 */
export const DashboardRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (user) {
      switch (user.role) {
        case 'PATIENT': navigate('/patient/dashboard', { replace: true }); break;
        case 'DOCTOR': navigate('/doctor/dashboard', { replace: true }); break;
        case 'NURSE': navigate('/nurse/dashboard', { replace: true }); break;
        case 'ADMIN': navigate('/admin/dashboard', { replace: true }); break;
        default: navigate('/login', { replace: true });
      }
    }
  }, [user, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-elevation-3 mb-4 animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;
