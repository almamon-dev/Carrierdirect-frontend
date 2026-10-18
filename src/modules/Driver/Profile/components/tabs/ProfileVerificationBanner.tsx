import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import { DriverProfile } from '../../../types';

interface Props {
    profile: DriverProfile;
    isVerified: boolean;
    toggleDuty: (status: 'online' | 'break' | 'offline') => void;
}

export const ProfileVerificationBanner: React.FC<Props> = ({
    profile,
    isVerified,
    toggleDuty,
}) => {
    const carrier = profile.employerCarrier;

    return (
        <div className="p-2 sm:p-2.5 bg-white dark:bg-[#181a20] rounded-[4px] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2 flex-wrap">
                <ShieldCheck
                    className={`w-4 h-4 ${
                        isVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'
                    }`}
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Driver Verification:
                </span>
                {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-[3px]">
                        <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" /> Verified Active (CDL-A)
                    </span>
                ) : (
                    <span className="inline-flex items-center text-[10.5px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded-[3px]">
                        Pending Compliance Review
                    </span>
                )}
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                <span className="text-[11.5px] text-slate-600 dark:text-slate-400 font-medium">
                    {carrier?.company_name || carrier?.companyName || 'Supplier Fleet HQ'} (USDOT {carrier?.dot_number || '3920194'})
                </span>
            </div>

            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800 text-[10.5px] font-semibold shrink-0">
                <button
                    type="button"
                    onClick={() => toggleDuty('online')}
                    className={`px-2 py-0.5 rounded-[2px] transition-all cursor-pointer flex items-center gap-1 ${
                        profile.dutyStatus === 'online'
                            ? 'bg-white dark:bg-[#1e2329] text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Online</span>
                </button>
                <button
                    type="button"
                    onClick={() => toggleDuty('break')}
                    className={`px-2 py-0.5 rounded-[2px] transition-all cursor-pointer flex items-center gap-1 ${
                        profile.dutyStatus === 'break'
                            ? 'bg-white dark:bg-[#1e2329] text-amber-600 dark:text-amber-400 font-bold shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Break</span>
                </button>
                <button
                    type="button"
                    onClick={() => toggleDuty('offline')}
                    className={`px-2 py-0.5 rounded-[2px] transition-all cursor-pointer flex items-center gap-1 ${
                        profile.dutyStatus === 'offline'
                            ? 'bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 font-bold shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>Offline</span>
                </button>
            </div>
        </div>
    );
};
