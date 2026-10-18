import React from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import PhoneInput from '@/components/ui/phone-input';
import { User, Mail, Building2, Briefcase } from 'lucide-react';
import { ProfileState } from '../types/profileTypes';

interface ProfileFormFieldsProps {
  profile: ProfileState;
  setProfile: React.Dispatch<React.SetStateAction<ProfileState>>;
  isSaving: boolean;
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  profile,
  setProfile,
  isSaving,
}) => {
  return (
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
          <label className="text-[13px] font-semibold text-slate-700 font-sans">
            Primary Phone Number
          </label>
          <PhoneInput
            name="phone"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="7000 000000"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-[13px] font-semibold text-slate-700 font-sans">
            Secondary Phone Number
          </label>
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

      <div className="pt-2 flex items-center justify-end border-t border-slate-100 mt-2">
        <Button
          type="submit"
          isLoading={isSaving}
          disabled={isSaving}
          className="h-9 px-5 rounded-md bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
        >
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileFormFields;
