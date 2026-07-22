import React, { useState } from 'react';
import { User, Mail, Phone, Globe, DollarSign, Camera, Check } from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

export default function ProfileTab() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('customer_profile_settings');
      return saved ? JSON.parse(saved) : {
        fullName: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '+44 7700 900077',
        secondaryPhone: '+44 20 7946 0912',
        language: 'English (UK)',
        currency: 'GBP (£)',
        timezone: 'Europe/London (GMT+0)',
      };
    } catch {
      return {
        fullName: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '+44 7700 900077',
        secondaryPhone: '',
        language: 'English (UK)',
        currency: 'GBP (£)',
        timezone: 'Europe/London (GMT+0)',
      };
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('customer_profile_settings', JSON.stringify(profile));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Avatar & Header Card */}
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ff4a1f] to-orange-400 text-white flex items-center justify-center text-lg font-bold shadow-sm">
            AM
          </div>
          <button 
            type="button" 
            className="absolute bottom-0 right-0 p-1 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-[#ff4a1f] shadow-sm cursor-pointer"
          >
            <Camera className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 truncate">{profile.fullName}</h3>
          <p className="text-xs text-slate-500 truncate">{profile.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-md border border-green-200">
            Verified Customer
          </span>
        </div>
      </div>

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
            label="Primary Email Address *"
            type="email"
            icon={<Mail className="w-4 h-4 text-slate-400" />}
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Primary Phone Number *"
            type="tel"
            icon={<Phone className="w-4 h-4 text-slate-400" />}
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="+44 7000 000000"
            required
          />

          <Input
            label="Secondary Phone Number"
            type="tel"
            icon={<Phone className="w-4 h-4 text-slate-400" />}
            value={profile.secondaryPhone}
            onChange={(e) => setProfile({ ...profile, secondaryPhone: e.target.value })}
            placeholder="+44 20 0000 0000"
          />
        </div>

        {/* Regional Preferences */}
        <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 pt-2">
          Regional & Display Preferences
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
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
          {savedSuccess ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
              <Check className="w-3.5 h-3.5" /> Updated!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="h-9 px-5 rounded-md bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Save Profile
          </button>
        </div>

      </div>
    </form>
  );
}
