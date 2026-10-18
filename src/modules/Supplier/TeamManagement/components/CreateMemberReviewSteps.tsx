import React from 'react';
import Input from '@/components/ui/input';

interface StepProps {
    formData: any;
    handleChange: (field: string, val: string) => void;
}

export const CreateMemberSecurityStep: React.FC<StepProps> = ({ formData, handleChange }) => (
    <div className="space-y-3 max-w-lg">
        <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Security & Access Method</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Define how the team member logs into the portal.</p>
        </div>
        <div className="space-y-2">
            <div
                onClick={() => handleChange('accessMethod', 'email')}
                className={`p-2.5 rounded-[3px] border cursor-pointer flex items-start gap-2.5 transition-all ${
                    formData.accessMethod === 'email'
                        ? 'border-[#FF4A1F] bg-orange-50/40 dark:bg-[#ff4a1f]/10 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#181d24]'
                }`}
            >
                <input type="radio" name="accessMethod" checked={formData.accessMethod === 'email'} readOnly className="mt-0.5 accent-[#FF4A1F]" />
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Send Email Invitation Link (Recommended)</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">The user will receive an email with a secure token to set their password.</p>
                </div>
            </div>

            <div
                onClick={() => handleChange('accessMethod', 'temp')}
                className={`p-2.5 rounded-[3px] border cursor-pointer transition-all ${
                    formData.accessMethod === 'temp'
                        ? 'border-[#FF4A1F] bg-orange-50/40 dark:bg-[#ff4a1f]/10 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#181d24]'
                }`}
            >
                <div className="flex items-start gap-2.5">
                    <input type="radio" name="accessMethod" checked={formData.accessMethod === 'temp'} readOnly className="mt-0.5 accent-[#FF4A1F]" />
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Set Temporary Initial Password</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Manually specify a temporary password for immediate first-time access.</p>
                    </div>
                </div>

                {formData.accessMethod === 'temp' && (
                    <div className="mt-2.5 pt-2 border-t border-orange-200/60 dark:border-orange-500/20 pl-6" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Temporary Password * (Min. 6 characters)
                        </label>
                        <Input
                            type="text"
                            placeholder="e.g. Carrier#2026"
                            value={formData.tempPassword}
                            onChange={(e) => handleChange('tempPassword', e.target.value)}
                            className="h-8 text-xs bg-white dark:bg-slate-900"
                        />
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            This password will be sent in the invitation email for login.
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export const CreateMemberReviewStep: React.FC<{ formData: any }> = ({ formData }) => (
    <div className="space-y-3.5 max-w-lg">
        <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Review & Confirm Account</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Please review member details before dispatching access.</p>
        </div>
        <div className="bg-slate-50 dark:bg-[#181d24] rounded-lg p-3.5 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center font-bold text-xs">
                    {(formData.firstName?.charAt(0) || 'J') + (formData.lastName?.charAt(0) || 'D')}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {formData.firstName || 'John'} {formData.lastName || 'Doe'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{formData.email || 'john.doe@carrierdirect.com'}</p>
                </div>
            </div>

            <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-2.5 text-xs">
                <div>
                    <span className="block text-[10px] font-medium text-slate-400">Role</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 capitalize text-[11.5px]">{formData.role}</span>
                </div>
                <div>
                    <span className="block text-[10px] font-medium text-slate-400">Department</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 capitalize text-[11.5px]">{formData.department}</span>
                </div>
                <div>
                    <span className="block text-[10px] font-medium text-slate-400">Title</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">{formData.designation || '-'}</span>
                </div>
                <div>
                    <span className="block text-[10px] font-medium text-slate-400">Phone</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">{formData.phone || '-'}</span>
                </div>
            </div>
        </div>
    </div>
);
