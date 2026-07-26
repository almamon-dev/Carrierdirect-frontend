import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Globe, DollarSign, Camera, Check, Loader2, AlertCircle, Building2, Briefcase } from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { TOKEN_CONFIG } from '@/config/auth';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';

// ── Helpers ──────────────────────────────────────────────────────────────────
function getAuthUser() {
  try {
    const raw = localStorage.getItem(TOKEN_CONFIG.userKey);
    return raw ? JSON.parse(raw) as { name?: string; email?: string; user_type?: string; phone_number?: string; company_name?: string; designation?: string } : null;
  } catch {
    return null;
  }
}

function initials(name?: string): string {
  if (!name) return 'U';
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

// ── Types ────────────────────────────────────────────────────────────────────
interface ProfileState {
  fullName:       string;
  email:          string;
  phone:          string;
  secondaryPhone: string;
  companyName:    string;
  designation:    string;
  bio:            string;
  language:       string;
  currency:       string;
  timezone:       string;
  profilePicture?: string;
  isVerified?:    boolean;
}

const DEFAULT_PROFILE: ProfileState = {
  fullName:       '',
  email:          '',
  phone:          '',
  secondaryPhone: '',
  companyName:    '',
  designation:    '',
  bio:            '',
  language:       'English (UK)',
  currency:       'GBP (£)',
  timezone:       'Europe/London (GMT+0)',
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProfileTab() {
  const authUser = getAuthUser();

  const [profile, setProfile]         = useState<ProfileState>({
    ...DEFAULT_PROFILE,
    fullName:    authUser?.name         || '',
    email:       authUser?.email        || '',
    phone:       authUser?.phone_number || '',
    companyName: authUser?.company_name || '',
    designation: authUser?.designation  || '',
  });
  const [isLoading, setIsLoading]     = useState(false);
  const [isSaving, setIsSaving]       = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [saveError, setSaveError]     = useState<string | null>(null);

  // ── Fetch profile from API on mount ─────────────────────────────────────
  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        const res = await apiClient.get(ENDPOINTS.CUSTOMER.PROFILE);
        const d   = res.data ?? res;

        setProfile(prev => ({
          ...prev,
          fullName:       d.name            || prev.fullName    || authUser?.name  || '',
          email:          d.email           || prev.email       || authUser?.email || '',
          phone:          d.phone           || prev.phone       || authUser?.phone_number || '',
          secondaryPhone: d.secondary_phone || prev.secondaryPhone || '',
          companyName:    d.company_name    || prev.companyName || authUser?.company_name || '',
          designation:    d.designation     || prev.designation || '',
          bio:            d.bio             || prev.bio         || '',
          profilePicture: d.profile_picture || prev.profilePicture,
          isVerified:     d.is_verified     ?? prev.isVerified,
        }));
      } catch (err) {
        console.error('Failed to load profile from API:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const showToast = useToastStore(state => state.showToast);

  // ── Save profile to API ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      await apiClient.post(ENDPOINTS.CUSTOMER.PROFILE, {
        name:            profile.fullName,
        phone:           profile.phone,
        secondary_phone: profile.secondaryPhone,
        company_name:    profile.companyName,
        designation:     profile.designation,
        bio:             profile.bio,
      });

      // Also update the name in cached auth user
      const cached = getAuthUser();
      if (cached) {
        localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify({ ...cached, name: profile.fullName }));
      }

      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      const msg = err.data?.message || err.message || 'Failed to save profile. Please try again.';
      setSaveError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const languageOptions = [
    { id: 'English (UK)', name: 'English (UK)' },
    { id: 'English (US)', name: 'English (US)' },
    { id: 'French', name: 'French' },
    { id: 'German', name: 'German' },
  ];
  const currencyOptions = [
    { id: 'GBP (£)', name: 'GBP (£)' },
    { id: 'EUR (€)', name: 'EUR (€)' },
    { id: 'USD ($)', name: 'USD ($)' },
  ];
  const timezoneOptions = [
    { id: 'Europe/London (GMT+0)', name: 'Europe/London (GMT+0)' },
    { id: 'Europe/Paris (GMT+1)', name: 'Europe/Paris (GMT+1)' },
    { id: 'America/New_York (EST)', name: 'America/New_York (EST)' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Avatar card skeleton */}
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-slate-200 rounded w-32" />
            <div className="h-2.5 bg-slate-100 rounded w-48" />
            <div className="h-4 bg-slate-100 rounded w-24 mt-1" />
          </div>
        </div>

        {/* Form card skeleton */}
        <div className="bg-white p-4 sm:p-5 rounded-md border border-slate-200 shadow-sm space-y-4">
          {/* Section heading */}
          <div className="h-3 bg-slate-200 rounded w-36 border-b border-slate-100 pb-2" />

          {/* 2-col grid of input skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-2.5 bg-slate-200 rounded w-24" />
                <div className="h-10 bg-slate-100 rounded-md w-full" />
              </div>
            ))}
          </div>

          {/* Section heading */}
          <div className="h-3 bg-slate-200 rounded w-44 border-b border-slate-100 pb-2 pt-2" />

          {/* 3-col preferences skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-2.5 bg-slate-200 rounded w-20" />
                <div className="h-10 bg-slate-100 rounded-md w-full" />
              </div>
            ))}
          </div>

          {/* Submit bar */}
          <div className="pt-2 flex justify-end border-t border-slate-100 mt-2">
            <div className="h-9 w-24 bg-slate-200 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Avatar & Header Card */}
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
          <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md border ${
            profile.isVerified
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {profile.isVerified ? 'Verified Customer' : 'Pending Verification'}
          </span>
        </div>
      </div>

      {/* Save error */}
      {saveError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {saveError}
        </div>
      )}

      {/* Main Profile Inputs Card */}
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
            onChange={() => {}}
            placeholder="you@example.com"
            disabled
          />

          <Input
            label="Primary Phone Number"
            type="tel"
            icon={<Phone className="w-4 h-4 text-slate-400" />}
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="+44 7000 000000"
          />

          <Input
            label="Secondary Phone Number"
            type="tel"
            icon={<Phone className="w-4 h-4 text-slate-400" />}
            value={profile.secondaryPhone}
            onChange={(e) => setProfile({ ...profile, secondaryPhone: e.target.value })}
            placeholder="+44 20 0000 0000"
          />

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

        {/* Regional Preferences */}
        <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 pt-2">
          Regional &amp; Display Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-bold text-[#202223]">Preferred Language</label>
            <Select
              value={profile.language}
              onChange={(opt) => setProfile({ ...profile, language: typeof opt === 'object' ? opt.id : opt })}
              options={languageOptions}
              icon={Globe}
              showSearch={false}
              placeholder="Select language..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-bold text-[#202223]">Default Currency</label>
            <Select
              value={profile.currency}
              onChange={(opt) => setProfile({ ...profile, currency: typeof opt === 'object' ? opt.id : opt })}
              options={currencyOptions}
              icon={DollarSign}
              showSearch={false}
              placeholder="Select currency..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-bold text-[#202223]">Timezone</label>
            <Select
              value={profile.timezone}
              onChange={(opt) => setProfile({ ...profile, timezone: typeof opt === 'object' ? opt.id : opt })}
              options={timezoneOptions}
              showSearch={false}
              placeholder="Select timezone..."
            />
          </div>
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

      {/* Floating Toast Notification */}
      {savedSuccess && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2.5 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>Profile updated successfully!</span>
        </div>
      )}
    </form>
  );
}
