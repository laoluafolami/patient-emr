import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const ChangePasswordPage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const roleColors: Record<string, string> = {
    PATIENT: 'from-blue-500 to-cyan-400',
    DOCTOR: 'from-purple-500 to-indigo-400',
    NURSE: 'from-emerald-500 to-teal-400',
    ADMIN: 'from-orange-500 to-amber-400',
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validate()) return;

    setIsSubmitting(true);
    // TODO: Implement API call to change password
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSuccess(true);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Change Password</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Update your account password</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-secondary-50 dark:bg-secondary-950/20 border border-secondary-200 dark:border-secondary-800/40 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
          <svg className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">Password changed successfully!</p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-0.5">Your password has been updated.</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={e => {
                setFormData({ ...formData, currentPassword: e.target.value });
                if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
              }}
              className={`w-full px-3 py-2.5 rounded-xl border ${
                errors.currentPassword
                  ? 'border-error-300 dark:border-error-700 bg-error-50 dark:bg-error-950/20'
                  : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
              } text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all`}
              placeholder="Enter your current password"
            />
            {errors.currentPassword && (
              <p className="text-xs text-error-600 dark:text-error-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={e => {
                setFormData({ ...formData, newPassword: e.target.value });
                if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
              }}
              className={`w-full px-3 py-2.5 rounded-xl border ${
                errors.newPassword
                  ? 'border-error-300 dark:border-error-700 bg-error-50 dark:bg-error-950/20'
                  : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
              } text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all`}
              placeholder="Enter your new password"
            />
            {errors.newPassword && (
              <p className="text-xs text-error-600 dark:text-error-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.newPassword}
              </p>
            )}
            {!errors.newPassword && formData.newPassword && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Password strength: {formData.newPassword.length >= 12 ? 'Strong' : formData.newPassword.length >= 8 ? 'Medium' : 'Weak'}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={e => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              className={`w-full px-3 py-2.5 rounded-xl border ${
                errors.confirmPassword
                  ? 'border-error-300 dark:border-error-700 bg-error-50 dark:bg-error-950/20'
                  : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
              } text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all`}
              placeholder="Confirm your new password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-error-600 dark:text-error-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-100 dark:border-neutral-800">
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Password Requirements:</p>
            <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
              <li className="flex items-center gap-2">
                <svg className={`w-3 h-3 ${formData.newPassword.length >= 8 ? 'text-secondary-500' : 'text-neutral-300 dark:text-neutral-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <svg className={`w-3 h-3 ${/[A-Z]/.test(formData.newPassword) ? 'text-secondary-500' : 'text-neutral-300 dark:text-neutral-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Contains uppercase letter
              </li>
              <li className="flex items-center gap-2">
                <svg className={`w-3 h-3 ${/[a-z]/.test(formData.newPassword) ? 'text-secondary-500' : 'text-neutral-300 dark:text-neutral-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Contains lowercase letter
              </li>
              <li className="flex items-center gap-2">
                <svg className={`w-3 h-3 ${/[0-9]/.test(formData.newPassword) ? 'text-secondary-500' : 'text-neutral-300 dark:text-neutral-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Contains number
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${roleColors[user?.role || 'PATIENT']} disabled:opacity-60 transition-all hover:shadow-elevation-2`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Changing Password...
              </span>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Security Tips</p>
            <ul className="text-xs text-blue-600 dark:text-blue-400 mt-1 space-y-0.5 list-disc list-inside">
              <li>Use a unique password that you don't use elsewhere</li>
              <li>Consider using a password manager</li>
              <li>Change your password regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
