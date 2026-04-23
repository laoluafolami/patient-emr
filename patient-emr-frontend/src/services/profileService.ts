import apiClient from './apiClient';

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
}

export const profileService = {
  updateProfile: async (profileData: ProfileUpdateData): Promise<{ success: boolean; message: string; data: { user: any } }> => {
    // Get current user ID from the /auth/me endpoint first
    const meResponse = await apiClient.get('/auth/me');
    const userId = meResponse.data.data.user.id;
    
    // Update the user profile using the users endpoint
    const response = await apiClient.put(`/users/${userId}`, {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phone: profileData.phone || null,
      dateOfBirth: profileData.dateOfBirth || null,
    });
    
    return response.data;
  },
};