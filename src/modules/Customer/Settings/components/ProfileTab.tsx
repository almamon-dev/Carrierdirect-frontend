import React, { useState, useEffect } from 'react';
import { TOKEN_CONFIG } from '@/config/auth';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { ProfileState, BLANK_PROFILE } from '../types/profileTypes';
import ProfileAvatarCard from './ProfileAvatarCard';
import ProfileFormFields from './ProfileFormFields';

// Helper to sync user across all storage keys and trigger zero-latency layout updates
function syncCustomerAcrossStorage(updatedFields: Record<string, any>) {
  const keys = [TOKEN_CONFIG.userKey, 'carrierdirect_user_data', 'user'];
  keys.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      const current = raw ? JSON.parse(raw) : {};
      localStorage.setItem(key, JSON.stringify({ ...current, ...updatedFields }));
    } catch {}
  });
  window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: updatedFields }));
  window.dispatchEvent(new Event('user-profile-updated'));
  window.dispatchEvent(new Event('storage'));
}

export default function ProfileTab() {
  const showToast = useToastStore((state) => state.showToast);

  const [profile, setProfile] = useState<ProfileState>(BLANK_PROFILE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const res = await apiClient.get('/customer/profile');
        const d = res.data?.data || res.data || res;
        setProfile({
          fullName: d.name || d.user?.name || '',
          email: d.email || d.user?.email || '',
          phone: d.phone || d.phone_number || d.user?.phone || '',
          secondaryPhone: d.secondary_phone || '',
          companyName: d.company_name || d.user?.company_name || '',
          designation: d.designation || '',
          profilePicture: d.profile_picture || null,
          isVerified: Boolean(d.email_verified_at || d.is_verified),
        });

        if (d.profile_picture) {
          syncCustomerAcrossStorage({ profile_picture: d.profile_picture, name: d.name });
        }
      } catch (err: any) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size must be less than 5MB', 'error');
        return;
      }

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setSelectedFile(file);
      // Optimistic header update
      syncCustomerAcrossStorage({ profile_picture: preview });

      setIsUploadingImage(true);
      try {
        const uploadData = new FormData();
        uploadData.append('profile_picture', file);
        const res = await apiClient.post('/customer/profile/update', uploadData);
        const resData = res.data?.data || res.data || {};
        const newUrl = resData.profile_picture || res?.profile_picture;
        if (newUrl) {
          setProfile((prev) => ({ ...prev, profilePicture: newUrl }));
          setPreviewUrl(null);
          setSelectedFile(null);
          syncCustomerAcrossStorage({ profile_picture: newUrl });
        }
        showToast('Profile picture updated successfully!', 'success');
      } catch (err: any) {
        console.error('Image upload error:', err);
        const msg = err.response?.data?.message || err.message || 'Failed to upload image.';
        showToast(msg, 'error');
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', profile.fullName);
      formData.append('phone', profile.phone);
      formData.append('secondary_phone', profile.secondaryPhone);
      formData.append('company_name', profile.companyName);
      formData.append('designation', profile.designation);

      if (selectedFile) {
        formData.append('profile_picture', selectedFile);
      }

      const res = await apiClient.post('/customer/profile/update', formData);
      const resData = res.data?.data || res.data || {};

      if (resData.profile_picture) {
        setProfile((prev) => ({ ...prev, profilePicture: resData.profile_picture }));
      }
      setSelectedFile(null);
      setPreviewUrl(null);

      const updatedFields: Record<string, any> = {
        name: profile.fullName,
        phone: profile.phone,
        company_name: profile.companyName,
      };
      if (resData.profile_picture) {
        updatedFields.profile_picture = resData.profile_picture;
      }
      syncCustomerAcrossStorage(updatedFields);

      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile. Please try again.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-200" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProfileAvatarCard
        profile={profile}
        previewUrl={previewUrl}
        isUploadingImage={isUploadingImage}
        onImageChange={handleImageChange}
      />
      <ProfileFormFields
        profile={profile}
        setProfile={setProfile}
        isSaving={isSaving}
      />
    </form>
  );
}
