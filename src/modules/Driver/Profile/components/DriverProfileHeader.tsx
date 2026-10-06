import React from 'react';
import { CheckCircle2, Edit3, Sparkles } from 'lucide-react';
import { DriverProfile } from '../../types';

interface Props {
    profile: DriverProfile;
    onEditClick: () => void;
}

export const DriverProfileHeader: React.FC<Props> = ({ profile, onEditClick }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs relative overflow-hidden">
            {/* Background ambient accent */}
            <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-orange-50/50 via-transparent to-transparent dark:from-orange-950/10 dark:via-transparent pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5 sm:gap-4">
                    {/* Avatar with live green status dot */}
                    <div className="relative shrink-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-orange-100 dark:ring-orange-950/50 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs">
                            <img
                                src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Live active ring */}
                        <div
                            title={profile.dutyStatus === 'online' ? 'Active on Duty' : 'Off Duty'}
                            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-[#1e2329] flex items-center justify-center ${
                                profile.dutyStatus === 'online'
                                    ? 'bg-emerald-500 shadow-xs'
                                    : 'bg-slate-400'
                            }`}
                        >
                            {profile.dutyStatus === 'online' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                        </div>
                    </div>

                    {/* Driver details */}
                    <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                {profile.name}
                            </h1>
                            {profile.isVerified && (
                                <div className="inline-flex items-center text-blue-500 dark:text-blue-400" title="Verified Commercial Carrier Driver">
                                    <CheckCircle2 size={16} className="fill-blue-500 text-white dark:fill-blue-500 dark:text-[#1e2329]" />
                                </div>
                            )}
                            {profile.licenseBadge && (
                                <span className="inline-flex items-center px-2 py-0.5 text-[10.5px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-[4px] border border-blue-200/60 dark:border-blue-800/60">
                                    {profile.licenseBadge}
                                </span>
                            )}
                        </div>

                        <div className="text-xs font-bold text-[#FF4A1F] dark:text-orange-400">
                            {profile.title}
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
                            <Sparkles size={12} className="text-amber-500 shrink-0" />
                            <span>{profile.slogan}</span>
                        </p>
                    </div>
                </div>

                {/* Edit profile action */}
                <button
                    type="button"
                    onClick={onEditClick}
                    className="self-end sm:self-center px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-[#161a22] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                    <Edit3 size={13} className="text-[#FF4A1F]" />
                    <span>Edit Profile</span>
                </button>
            </div>
        </div>
    );
};
