import React from 'react';
import { CheckCircle } from 'lucide-react';
import { CreateMemberPersonalStep, CreateMemberDepartmentStep } from './CreateMemberBasicSteps';
import { CreateMemberSecurityStep, CreateMemberReviewStep } from './CreateMemberReviewSteps';

interface CreateTeamMemberStepsProps {
    step: number;
    formData: any;
    handleChange: (field: string, val: string) => void;
    displayRoles: any[];
    isSubmitted: boolean;
}

export const CreateTeamMemberSteps: React.FC<CreateTeamMemberStepsProps> = ({
    step,
    formData,
    handleChange,
    displayRoles,
    isSubmitted,
}) => {
    if (isSubmitted) {
        return (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center animate-bounce">
                    <CheckCircle size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Team Member Invited!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                    An invitation email with access credentials has been dispatched to <strong>{formData.email || 'the user'}</strong>.
                </p>
            </div>
        );
    }

    return (
        <>
            {step === 1 && <CreateMemberPersonalStep formData={formData} handleChange={handleChange} />}
            {step === 2 && <CreateMemberDepartmentStep formData={formData} handleChange={handleChange} />}

            {step === 3 && (
                <div className="space-y-3 max-w-lg">
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Select Access Role</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose the permission level from database configured roles.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                        {displayRoles.map((r) => {
                            const isSelected = formData.role === r.id;
                            return (
                                <div
                                    key={r.id}
                                    onClick={() => handleChange('role', r.id)}
                                    className={`p-2 sm:py-2 sm:px-2.5 rounded-[3px] border cursor-pointer transition-all flex items-start gap-2 ${
                                        isSelected
                                            ? 'border-[#FF4A1F] bg-orange-50/50 dark:bg-[#ff4a1f]/10 shadow-2xs'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#181d24]'
                                    }`}
                                >
                                    <div className={`w-3.5 h-3.5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                                        isSelected ? 'border-[#FF4A1F] bg-[#FF4A1F]' : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-[#FF4A1F] dark:text-[#ff4a1f]' : 'text-slate-900 dark:text-slate-100'}`}>
                                            {r.name}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">
                                            {r.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {step === 4 && <CreateMemberSecurityStep formData={formData} handleChange={handleChange} />}
            {step === 5 && <CreateMemberReviewStep formData={formData} />}
        </>
    );
};
