import React, { useState } from 'react';
import { Phone, Mail, Truck, Award, Calendar, Copy, Check, ShieldCheck } from 'lucide-react';
import { DriverProfile } from '../../types';

interface Props {
    profile: DriverProfile;
}

export const DriverInfoSection: React.FC<Props> = ({ profile }) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1800);
    };

    return (
        <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-0.5">
                Driver Information
            </h3>

            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-2xs overflow-hidden">
                {/* 1. Phone */}
                <div className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-[#161a22]/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <Phone size={15} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">Phone</div>
                            <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                                {profile.phone}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleCopy(profile.phone, 'phone')}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Copy phone number"
                    >
                        {copiedField === 'phone' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                </div>

                {/* 2. Email */}
                <div className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-[#161a22]/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <Mail size={15} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">Email</div>
                            <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                                {profile.email}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleCopy(profile.email, 'email')}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Copy email"
                    >
                        {copiedField === 'email' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                </div>

                {/* 3. Vehicle Assigned */}
                <div className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-[#161a22]/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <Truck size={15} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">Vehicle Assigned</div>
                            <div className="text-xs sm:text-[13px] font-mono font-bold text-slate-900 dark:text-white">
                                {profile.vehicleAssigned?.plate || 'ABC-987654'}
                            </div>
                        </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 rounded-[4px]">
                        {profile.vehicleAssigned?.status || 'Active'}
                    </span>
                </div>

                {/* 4. Driver License */}
                <div className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-[#161a22]/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <Award size={15} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">Driver License</div>
                            <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                                {profile.driverLicense || 'Not Specified'}
                            </div>
                        </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <ShieldCheck size={13} />
                        <span>Verified</span>
                    </span>
                </div>

                {/* 5. Joined Date */}
                <div className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-[#161a22]/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <Calendar size={15} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">Joined Date</div>
                            <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                                {profile.joinedDate || 'May 12, 2024'}
                            </div>
                        </div>
                    </div>
                    <span className="text-[11px] text-slate-400">Carrier Direct Fleet</span>
                </div>
            </div>
        </div>
    );
};
