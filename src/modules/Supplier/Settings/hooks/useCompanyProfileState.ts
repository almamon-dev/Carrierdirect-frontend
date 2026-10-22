import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { TOKEN_CONFIG } from '@/config/auth';
import { useToastStore } from '@/stores/useToastStore';

// Helper to reliably sync user data across all localStorage keys and notify layouts instantly
function syncUserAcrossStorage(updatedFields: Record<string, any>) {
  const keys = [TOKEN_CONFIG.userKey, 'carrierdirect_user_data', 'user'];
  keys.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      const current = raw ? JSON.parse(raw) : {};
      const merged = { ...current, ...updatedFields };
      localStorage.setItem(key, JSON.stringify(merged));
    } catch (e) {
      console.warn(`Failed to sync storage key ${key}:`, e);
    }
  });

  // Dispatch both standard and CustomEvent with payload for instantaneous React state updates
  window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: updatedFields }));
  window.dispatchEvent(new Event('user-profile-updated'));
  window.dispatchEvent(new Event('storage'));
}

export function useCompanyProfileState() {
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    address: '',
  });

  const [complianceData, setComplianceData] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsFetching(true);
    try {
      const res = await apiClient.get('/supplier/profile');
      const data = res?.data?.data || res?.data || res || {};
      
      setFormData({
        fullName: data.name || '',
        companyName: data.company_name || '',
        email: data.email || '',
        phone: data.phone_number || '',
        country: data.country || '',
        state: data.state || '',
        city: data.city || '',
        zipCode: data.zip_code || '',
        address: data.business_address || '',
      });

      if (data.profile_picture) setLogoPreview(data.profile_picture);
      if (data.compliance) setComplianceData(data.compliance);
      setIsVerified(!!data.is_verified || !!data.compliance?.is_verified);

      syncUserAcrossStorage(data);
    } catch (err: any) {
      console.error('Fetch profile error:', err);
      const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey) || localStorage.getItem('user');
      if (rawUser) {
        try {
          const u = JSON.parse(rawUser);
          setFormData({
            fullName: u.name || '',
            companyName: u.company_name || '',
            email: u.email || '',
            phone: u.phone_number || '',
            country: u.country || '',
            state: u.state || '',
            city: u.city || '',
            zipCode: u.zip_code || '',
            address: u.business_address || '',
          });
          if (u.profile_picture) setLogoPreview(u.profile_picture);
        } catch {}
      }
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const rawUser = localStorage.getItem(TOKEN_CONFIG.userKey) || localStorage.getItem('user');
      const currentUser = rawUser ? JSON.parse(rawUser) : {};

      const payload = {
        name: formData.fullName || currentUser.name,
        company_name: formData.companyName,
        phone_number: formData.phone,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zip_code: formData.zipCode,
        business_address: formData.address,
      };

      const res = await apiClient.post('/supplier/profile', payload);
      const updatedProfile = res?.data?.data || res?.data || payload;

      const updatedUser = {
        ...currentUser,
        ...updatedProfile,
        name: formData.fullName || updatedProfile.name || currentUser.name,
        company_name: formData.companyName,
      };

      syncUserAcrossStorage(updatedUser);

      setIsSaved(true);
      useToastStore.getState().showToast('Profile updated successfully!', 'success');
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      console.error('Update profile error:', err);
      const msg = err.data?.message || err.message || 'Failed to update profile.';
      useToastStore.getState().showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        useToastStore.getState().showToast('Logo file size must be less than 5MB', 'error');
        return;
      }

      // 1. Instant optimistic preview for immediate visual feedback
      const localPreviewUrl = URL.createObjectURL(file);
      setLogoPreview(localPreviewUrl);

      // Also optimistically notify header with local preview so it changes instantly
      syncUserAcrossStorage({ profile_picture: localPreviewUrl });

      setIsUploadingLogo(true);
      const uploadData = new FormData();
      uploadData.append('logo', file);
      try {
        const res = await apiClient.post('/supplier/profile/logo', uploadData);
        useToastStore.getState().showToast('Company logo updated successfully!', 'success');

        // Extract real permanent server URL from response
        const serverUrl =
          res?.data?.profile_picture ||
          res?.data?.data?.profile_picture ||
          res?.profile_picture ||
          res?.data?.url;

        if (serverUrl) {
          setLogoPreview(serverUrl);
          syncUserAcrossStorage({ profile_picture: serverUrl });
        }
      } catch (err: any) {
        // Revert on failure
        fetchProfile();
        useToastStore.getState().showToast(err.message || 'Failed to upload logo', 'error');
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  const handleLogoRemove = async () => {
    setIsUploadingLogo(true);
    try {
      await apiClient.post('/supplier/profile/logo-remove');
      setLogoPreview(null);
      syncUserAcrossStorage({ profile_picture: null });
      useToastStore.getState().showToast('Logo removed successfully!', 'success');
    } catch (err: any) {
      useToastStore.getState().showToast(err.message || 'Failed to remove logo', 'error');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return {
    isFetching,
    isLoading,
    isSaved,
    logoPreview,
    isUploadingLogo,
    formData,
    complianceData,
    isVerified,
    handleChange,
    handleSave,
    handleLogoUpload,
    handleLogoRemove,
    fetchProfile,
  };
}
