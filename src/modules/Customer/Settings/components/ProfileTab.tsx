import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/input';
import { User, Mail, Phone, Camera, Check, Building2, Briefcase, AlertCircle, Loader2 } from 'lucide-react';
import PhoneInput from '@/components/ui/phone-input';
import { TOKEN_CONFIG } from '@/config/auth';
import apiClient from '@/lib/axios';

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

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const res = await apiClient.get('/customer/profile');
        const d = res.data || res;
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
      } catch (err: any) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      await apiClient.post('/customer/profile/update', {
        name: profile.fullName,
        phone: profile.phone,
        company_name: profile.companyName,
      });

      const cached = JSON.parse(localStorage.getItem(TOKEN_CONFIG.userKey) || '{}');
      localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify({ ...cached, name: profile.fullName }));

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm flex items-center gap-4">
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
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative shrink-0">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Avatar"
              className="w-14 h-14 rounded-full object-cover shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-700 text-white flex items-center justify-center text-lg font-bold shadow-sm">
              {initials(profile.fullName)}
            </div>
          )}
          <button
            type="button"
            className="absolute bottom-0 right-0 p-1 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-[#ff4a1f] shadow-sm cursor-pointer"
          >
            <Camera className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 truncate">{profile.fullName || 'Your Name'}</h3>
          <p className="text-xs text-slate-500 truncate">{profile.email || 'your@email.com'}</p>
          <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md border ${profile.isVerified
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
            {profile.isVerified ? 'Verified Customer' : 'Pending Verification'}
          </span>
        </div>
      </div>

      {saveError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {saveError}
        </div>
      )}

      <div className="bg-white p-4 sm:p-5 rounded-md border border-slate-200 shadow-sm space-y-4">
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
            onChange={() => { }}
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

      {savedSuccess && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2.5 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-md shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>Profile updated successfully!</span>
        </div>
      )}
    </form>
  );
}
