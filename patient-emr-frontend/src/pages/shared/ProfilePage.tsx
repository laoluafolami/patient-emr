import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await profileService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
      });
      
      // Update the user context with the new data
      await refreshUser();
      
      setIsEditing(false);
      
      // Show success message (you can replace this with a toast notification)
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      const message = error.response?.data?.message || 'Failed to update profile. Please try again.';
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    });
    setIsEditing(false);
  };

  const roleColors: Record<string, string> = {
    PATIENT: 'from-blue-500 to-cyan-400',
    DOCTOR: 'from-purple-500 to-indigo-400',
    NURSE: 'from-emerald-500 to-teal-400',
    ADMIN: 'from-orange-500 to-amber-400',
  };

  const roleLabels: Record<string, string> = {
    PATIENT: 'Patient',
    DOCTOR: 'Doctor',
    NURSE: 'Nurse',
    ADMIN: 'Administrator',
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden">
        {/* Header with gradient */}
        <div className={`h-24 bg-gradient-to-r ${roleColors[user?.role || 'PATIENT']} relative`}>
          <div className="absolute -bottom-12 left-6">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${roleColors[user?.role || 'PATIENT']} flex items-center justify-center text-white font-bold text-3xl shadow-elevation-3 border-4 border-white dark:border-neutral-900`}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 px-6 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {roleLabels[user?.role || 'PATIENT']}
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>

          {/* Form */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-neutral-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="(555) 123-4567"
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Role
              </label>
              <input
                type="text"
                value={roleLabels[user?.role || 'PATIENT']}
                disabled
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Action buttons */}
          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${roleColors[user?.role || 'PATIENT']} disabled:opacity-60 transition-all`}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
