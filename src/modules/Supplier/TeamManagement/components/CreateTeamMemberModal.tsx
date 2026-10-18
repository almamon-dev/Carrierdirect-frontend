import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    Mail,
    Building2,
    User,
    Briefcase,
    Send,
    Loader2,
    Key,
    Eye,
    EyeOff,
    UserPlus,
} from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { useCreateTeamMember } from '../hooks/useCreateTeamMember';

interface CreateTeamMemberModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const DEPARTMENT_OPTIONS = [
    { id: 'Operations', name: 'Operations' },
    { id: 'Logistics', name: 'Logistics' },
    { id: 'Dispatch', name: 'Dispatch' },
    { id: 'Fleet', name: 'Fleet' },
    { id: 'Management', name: 'Management' },
    { id: 'Customer Support', name: 'Customer Support' },
    { id: 'Finance', name: 'Finance' },
];

const JOB_TITLE_OPTIONS = [
    { id: 'Driver', name: 'Driver' },
    { id: 'Senior Driver', name: 'Senior Driver' },
    { id: 'Delivery Specialist', name: 'Delivery Specialist' },
    { id: 'Dispatcher', name: 'Dispatcher' },
    { id: 'Fleet Coordinator', name: 'Fleet Coordinator' },
    { id: 'Operations Associate', name: 'Operations Associate' },
];

export default function CreateTeamMemberModal({ onClose, onSuccess }: CreateTeamMemberModalProps) {
    const {
        formData,
        isSubmitting,
        roles,
        isValid,
        handleChange,
        handleSubmit,
    } = useCreateTeamMember(onClose, onSuccess);

    const [showPassword, setShowPassword] = useState(false);

    const roleOptions = roles.length > 0
        ? roles.map((r) => ({ id: r.name, name: r.name }))
        : [
            { id: 'Driver', name: 'Driver' },
            { id: 'Dispatcher', name: 'Dispatcher' },
            { id: 'Manager', name: 'Manager' },
            { id: 'Fleet Operator', name: 'Fleet Operator' },
            { id: 'Viewer', name: 'Viewer' },
        ];

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150 font-sans">
            <div className="bg-white dark:bg-[#12161c] w-full max-w-[540px] rounded-[4px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all">
                {/* Modal Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#12161c]">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-orange-500 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center shrink-0">
                            <UserPlus className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Add New Team Member</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Send an invitation to a new team member.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Email Address */}
                    <div>
                        <Input
                            type="email"
                            label="Email Address *"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="driver123@gmail.com"
                            required
                            icon={<Mail className="w-4 h-4 text-slate-400" />}
                            className="rounded-[4px] h-[38px] text-xs sm:text-sm"
                        />
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">An invitation email will be sent to this address.</p>
                    </div>

                    {/* Department & Access Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Department */}
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Department <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <Select
                                value={formData.department}
                                onChange={(val: any) => handleChange('department', typeof val === 'object' ? val?.id || val?.name : String(val))}
                                options={DEPARTMENT_OPTIONS}
                                icon={Building2}
                                placeholder="Select department..."
                                triggerClassName="rounded-[4px] h-[38px] text-xs sm:text-sm"
                            />
                        </div>

                        {/* Access Role */}
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Access Role <span className="text-[#FF4A1F]">*</span>
                            </label>
                            <Select
                                value={formData.accessRole}
                                onChange={(val: any) => {
                                    const roleName = typeof val === 'object' ? val?.id || val?.name : String(val);
                                    handleChange('accessRole', roleName);
                                    if (roleName === 'Driver') {
                                        handleChange('jobTitle', 'Driver');
                                    }
                                }}
                                options={roleOptions}
                                icon={User}
                                placeholder="Select access role..."
                                triggerClassName="rounded-[4px] h-[38px] text-xs sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Job Title */}
                    <div>
                        <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Job Title <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <Select
                            value={formData.jobTitle}
                            onChange={(val: any) => handleChange('jobTitle', typeof val === 'object' ? val?.id || val?.name : String(val))}
                            options={JOB_TITLE_OPTIONS}
                            icon={Briefcase}
                            placeholder="Select job title..."
                            triggerClassName="rounded-[4px] h-[38px] text-xs sm:text-sm"
                        />
                    </div>

                    {/* Account Access Method */}
                    <div>
                        <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Account Access Method
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Option 1: Send Email Invitation */}
                            <div
                                onClick={() => handleChange('accessMethod', 'email_invitation')}
                                className={`relative p-3.5 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-start ${
                                    formData.accessMethod === 'email_invitation'
                                        ? 'border-[#FF4A1F] bg-orange-50/20 dark:bg-orange-950/20 ring-1 ring-[#FF4A1F]/30'
                                        : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#181d24]'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                        formData.accessMethod === 'email_invitation' ? 'border-[#FF4A1F]' : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                        {formData.accessMethod === 'email_invitation' && (
                                            <div className="w-2 h-2 rounded-full bg-[#FF4A1F]" />
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Send Email Invitation</span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 pl-6">
                                    Driver will receive an email with a secure link to set their password and complete their profile.
                                </p>
                            </div>

                            {/* Option 2: Set Temporary Password */}
                            <div
                                onClick={() => handleChange('accessMethod', 'temporary_password')}
                                className={`relative p-3.5 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-start ${
                                    formData.accessMethod === 'temporary_password'
                                        ? 'border-[#FF4A1F] bg-orange-50/20 dark:bg-orange-950/20 ring-1 ring-[#FF4A1F]/30'
                                        : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#181d24]'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                        formData.accessMethod === 'temporary_password' ? 'border-[#FF4A1F]' : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                        {formData.accessMethod === 'temporary_password' && (
                                            <div className="w-2 h-2 rounded-full bg-[#FF4A1F]" />
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Set Temporary Password</span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 pl-6">
                                    Manually set a password for immediate access.
                                </p>
                            </div>
                        </div>

                        {/* Temporary Password Field */}
                        {formData.accessMethod === 'temporary_password' && (
                            <div className="mt-3 animate-in fade-in duration-150">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    label="Temporary Password *"
                                    value={formData.password || ''}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    placeholder="Enter password (minimum 6 characters)"
                                    required
                                    icon={<Key className="w-4 h-4 text-slate-400" />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer pointer-events-auto"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    }
                                    className="rounded-[4px] h-[38px] text-xs sm:text-sm"
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-[4px] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className={`px-5 py-2.5 rounded-[4px] text-xs font-semibold text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                                isValid && !isSubmitting
                                    ? 'bg-[#FF4A1F] hover:bg-[#E03E15]'
                                    : 'bg-slate-300 dark:bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                            }`}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Send Invitation</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
