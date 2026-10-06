import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/input';
import { User, Mail, Camera, Building2, Briefcase, Loader2 } from 'lucide-react';
import PhoneInput from '@/components/ui/phone-input';
import { TOKEN_CONFIG } from '@/config/auth';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';

interface ProfileState {
  fullName: string;
  email: string;
  phone: string;
  secondaryPhone: string;
  companyName: string;
  designation: string;
  profilePicture: string | null;
  isVerified: boolean;
}

export default function ProfileTab() {
  const showToast = useToastStore((state) => state.showToast);

  const [profile, setProfile] = useState<ProfileState>({
    fullName: '',
    email: '',
    phone: '',
    secondaryPhone: '',
    companyName: '',
    designation: '',
    profilePicture: null,
    isVerified: false,
  });

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

        const cached = JSON.parse(localStorage.getItem(TOKEN_CONFIG.userKey) || '{}');
        if (d.profile_picture && cached.profile_picture !== d.profile_picture) {
          localStorage.setItem(
            TOKEN_CONFIG.userKey,
            JSON.stringify({ ...cached, profile_picture: d.profile_picture, name: d.name || cached.name })
          );
          window.dispatchEvent(new Event('user-profile-updated'));
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

      // Preview immediately
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setSelectedFile(file);

      // Upload immediately via backend Helper
      setIsUploadingImage(true);
      try {
        const uploadData = new FormData();
        uploadData.append('profile_picture', file);
        const res = await apiClient.post('/customer/profile/update', uploadData);
        const resData = res.data?.data || res.data || {};
        if (resData.profile_picture) {
          setProfile((prev) => ({ ...prev, profilePicture: resData.profile_picture }));
          setPreviewUrl(null);
          setSelectedFile(null);
        }
        const cached = JSON.parse(localStorage.getItem(TOKEN_CONFIG.userKey) || '{}');
        localStorage.setItem(
          TOKEN_CONFIG.userKey,
          JSON.stringify({ ...cached, profile_picture: resData.profile_picture || cached.profile_picture })
        );
        window.dispatchEvent(new Event('user-profile-updated'));
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

      const cached = JSON.parse(localStorage.getItem(TOKEN_CONFIG.userKey) || '{}');
      localStorage.setItem(
        TOKEN_CONFIG.userKey,
        JSON.stringify({
          ...cached,
          name: profile.fullName,
          phone: profile.phone,
          company_name: profile.companyName,
          profile_picture: resData.profile_picture || cached.profile_picture,
        })
      );
      window.dispatchEvent(new Event('user-profile-updated'));

      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile. Please try again.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const activeAvatar = previewUrl || profile.profilePicture;

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
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
        <label className="relative shrink-0 group cursor-pointer block">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
          {activeAvatar ? (
            <img
              src={activeAvatar}
              alt="Avatar"
              className="w-14 h-14 rounded-full object-cover shadow-sm border border-slate-200 group-hover:opacity-85 transition-opacity"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-700 text-white flex items-center justify-center text-lg font-bold shadow-sm group-hover:bg-slate-800 transition-colors">
              {initials(profile.fullName)}
            </div>
          )}
          {isUploadingImage ? (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
          ) : (
            <div
              title="Upload Profile Picture"
              className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-slate-600 group-hover:text-[#ff4a1f] shadow-sm transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </div>
          )}
        </label>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 truncate">{profile.fullName || 'Your Name'}</h3>
          <p className="text-xs text-slate-500 truncate">{profile.email || 'your@email.com'}</p>
          <span
            className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md border ${
              profile.isVerified
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {profile.isVerified ? 'Verified Customer' : 'Pending Verification'}
          </span>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Full Name *"
            type="text"
            icon={<User className="w-4 h-4 text-slate-400" />}
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            placeholder="Your full name"
            required
          />

          <Input
            label="Primary Email Address"
            type="email"
            icon={<Mail className="w-4 h-4 text-slate-400" />}
            value={profile.email}
            onChange={() => {}}
            placeholder="you@example.com"
            disabled
          />

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[13px] font-semibold text-slate-700 font-sans">Primary Phone Number</label>
            <PhoneInput
              name="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="7000 000000"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[13px] font-semibold text-slate-700 font-sans">Secondary Phone Number</label>
            <PhoneInput
              name="secondaryPhone"
              value={profile.secondaryPhone}
              onChange={(e) => setProfile({ ...profile, secondaryPhone: e.target.value })}
              placeholder="20 0000 0000"
            />
          </div>

          <Input
            label="Company Name"
            type="text"
            icon={<Building2 className="w-4 h-4 text-slate-400" />}
            value={profile.companyName}
            onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
            placeholder="Your company"
          />

          <Input
            label="Designation / Role"
            type="text"
            icon={<Briefcase className="w-4 h-4 text-slate-400" />}
            value={profile.designation}
            onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
            placeholder="e.g. Logistics Manager"
          />
        </div>

        {/* Submit Bar */}
        <div className="pt-2 flex items-center justify-end border-t border-slate-100 mt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="h-9 px-5 rounded-md bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isSaving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </div>
    </form>
  );
}
