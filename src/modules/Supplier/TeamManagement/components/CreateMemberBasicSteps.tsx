import React from 'react';
import { Mail } from 'lucide-react';
import Input from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import Select from '@/components/ui/select';
import { STANDARD_DEPARTMENTS, STANDARD_DESIGNATIONS } from '../hooks/useCreateTeamMember';

interface StepProps {
    formData: any;
    handleChange: (field: string, val: string) => void;
}

export const CreateMemberPersonalStep: React.FC<StepProps> = ({ formData, handleChange }) => (
    <div className="space-y-3.5 max-w-lg">
        <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Personal Information</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Provide staff member full name and contact information.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                <Input
                    placeholder="e.g. John"
                    className="h-8.5 text-xs rounded-[4px]"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                />
            </div>
            <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                <Input
                    placeholder="e.g. Doe"
                    className="h-8.5 text-xs rounded-[4px]"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                />
            </div>
        </div>
        <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address (Login Username) *</label>
            <div className="relative">
                <Input
                    placeholder="john.doe@carrierdirect.com"
                    type="email"
                    className="h-8.5 text-xs pr-8 rounded-[4px]"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                />
                <Mail size={13} className="absolute right-2.5 top-2.5 text-slate-400" />
            </div>
        </div>
        <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone Number</label>
            <PhoneInput
                value={formData.phone}
                onChange={(e: any) => {
                    const val = e?.target?.value !== undefined ? e.target.value : (typeof e === 'string' ? e : '');
                    handleChange('phone', val);
                }}
                defaultCountry="BD"
                className="w-full text-xs rounded-[4px]"
                placeholder="Enter phone number"
            />
        </div>
    </div>
);

export const CreateMemberDepartmentStep: React.FC<StepProps> = ({ formData, handleChange }) => (
    <div className="space-y-3.5 max-w-lg">
        <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Department & Designation</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Assign member to an operational department or create a new one.</p>
        </div>
        <div className="space-y-3">
            <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                <Select
                    value={formData.department}
                    onChange={(e: any) => {
                        const val = e?.target?.value !== undefined ? e.target.value : e;
                        handleChange('department', val);
                    }}
                    options={STANDARD_DEPARTMENTS}
                    showSearch={false}
                    placeholder="Select department..."
                    triggerClassName="rounded-[4px]"
                />
            </div>
            <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation / Job Title *</label>
                <Select
                    value={formData.designation}
                    onChange={(e: any) => {
                        const val = e?.target?.value !== undefined ? e.target.value : e;
                        handleChange('designation', val);
                    }}
                    options={STANDARD_DESIGNATIONS}
                    showSearch={true}
                    placeholder="Select job title / designation..."
                    triggerClassName="rounded-[4px]"
                />
            </div>
        </div>
    </div>
);
