import React from 'react';
import { ChevronRight, Settings, Navigation, ShieldCheck, Headphones } from 'lucide-react';
import { DriverProfile } from '../../types';

interface Props {
    profile: DriverProfile;
    onOpenAccountSettings: () => void;
    onOpenNavPreferences: () => void;
    onOpenSafetyCompliance: () => void;
    onOpenDispatcherSupport: () => void;
}

export const DriverPreferencesList: React.FC<Props> = ({
    profile,
    onOpenAccountSettings,
    onOpenNavPreferences,
    onOpenSafetyCompliance,
    onOpenDispatcherSupport,
}) => {
    return (
        <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                Preferences & Support
            </h2>

            <div className="bg-white dark:bg-[#12161c] rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 shadow-xs overflow-hidden">
                {/* 0. Driver Compliance Verification (CDL, DOT, Insurance) */}
                <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-driver-compliance'))}
                    className="w-full p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-[#1a1f26]/50 transition-colors text-left group cursor-pointer"
                >
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                            <ShieldCheck size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#FF4A1F] transition-colors flex items-center gap-2">
                                <span>Driver Compliance Verification</span>
                                <span className="px-1.5 py-0.2 bg-orange-100 dark:bg-[#FF4A1F]/20 text-[#FF4A1F] text-[10px] font-extrabold rounded-[3px]">
                                    3 Steps
                                </span>
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">
                                CDL-A License, DOT Medical Card, and Insurance
                            </div>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 1. Account Settings */}
                <button
                    onClick={onOpenAccountSettings}
                    className="w-full p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-[#1a1f26]/50 transition-colors text-left group cursor-pointer"
                >
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <Settings size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#FF4A1F] transition-colors">
                                Account Settings
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">
                                Profile, credentials and account
                            </div>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 2. Navigation App Preferences */}
                <button
                    onClick={onOpenNavPreferences}
                    className="w-full p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-[#1a1f26]/50 transition-colors text-left group cursor-pointer"
                >
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <Navigation size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#FF4A1F] transition-colors">
                                Navigation App Preferences
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">
                                Current: {profile.preferences?.navigationApp || 'Google Truck GPS'}
                            </div>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 3. Safety & Route Compliance */}
                <button
                    onClick={onOpenSafetyCompliance}
                    className="w-full p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-[#1a1f26]/50 transition-colors text-left group cursor-pointer"
                >
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <ShieldCheck size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#FF4A1F] transition-colors">
                                Safety & Route Compliance
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">
                                Carrier protocols & safety terms
                            </div>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 4. 24/7 Dispatcher & Safety Support */}
                <button
                    onClick={onOpenDispatcherSupport}
                    className="w-full p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-[#1a1f26]/50 transition-colors text-left group cursor-pointer"
                >
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <Headphones size={18} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#FF4A1F] transition-colors">
                                24/7 Dispatcher & Safety Support
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">
                                Direct priority line and SOS
                            </div>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
            </div>
        </div>
    );
};
