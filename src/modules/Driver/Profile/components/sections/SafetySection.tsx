import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Shield, FileCheck, Check } from 'lucide-react';
import { DriverProfile } from '../../../types';
import TabHeader from '@/components/ui/tab-header';
import Button from '@/components/ui/button';

interface Props {
    profile: DriverProfile;
}

const KeyValueItem = ({ 
    label, 
    value, 
    isMono = false,
    action
}: { 
    label: string; 
    value: React.ReactNode; 
    isMono?: boolean;
    action?: React.ReactNode;
}) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-36 sm:w-48 shrink-0 text-slate-500 dark:text-slate-400 font-medium">{label}</span>
            <span className="text-slate-300 dark:text-slate-600 font-bold select-none">:</span>
            <span className={`truncate ${isMono ? 'font-mono' : ''} font-semibold text-slate-800 dark:text-slate-200`}>
                {value}
            </span>
        </div>
        {action && <div className="shrink-0">{action}</div>}
    </div>
);

export const SafetySection: React.FC<Props> = ({ profile }) => {
    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            <TabHeader title="Safety & Regulatory Compliance" icon={ShieldCheck} />

            {/* 1. Safety Record Key-Value Group */}
            <div className="space-y-1">
                <div className="flex items-center justify-between pb-1">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        FMCSA Driving Record & Safety Score
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-[3px]">
                        Tier 1 Gold Rating
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0.5">
                    <KeyValueItem 
                        label="Overall Safety Score" 
                        value={<span className="font-bold text-emerald-600 dark:text-emerald-400">99.4 / 100</span>} 
                    />
                    <KeyValueItem 
                        label="FMCSA Violation Record" 
                        value={<span className="font-bold text-emerald-600 dark:text-emerald-400">0 Violations (Clean 3-Yr)</span>} 
                    />
                    <KeyValueItem 
                        label="DOT Clearinghouse" 
                        value="Verified Eligible (No Prohibitions)" 
                    />
                    <KeyValueItem 
                        label="Daily Pre-Trip Inspection" 
                        value="Completed Today at 07:15 AM (Passed)" 
                    />
                    <KeyValueItem 
                        label="HOS / ELD Compliance" 
                        value="100% (70-Hour / 8-Day Cycle)" 
                    />
                    <KeyValueItem 
                        label="Drug & Alcohol Testing" 
                        value="Annual Clearinghouse Certified" 
                    />
                </div>
            </div>

            {/* 2. Endorsements & Certifications */}
            <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between pb-1">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Commercial Certifications & Training
                    </h3>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        4 Active Badges
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0.5">
                    <KeyValueItem 
                        label="HazMat Transport (H)" 
                        value="Class 3, 8 & 9 Certified (Exp: 2027)" 
                    />
                    <KeyValueItem 
                        label="Tanker Vehicle (N)" 
                        value="Liquid Bulk Clearance (Active)" 
                    />
                    <KeyValueItem 
                        label="Defensive Driving (NSC)" 
                        value="Commercial Master Certified" 
                    />
                    <KeyValueItem 
                        label="Winter Mountain Transit" 
                        value="Chaining & Alpine Grade Certified" 
                    />
                    <KeyValueItem 
                        label="TWIC Port Security" 
                        value="Port & Rail Authorized (Exp: 2028)" 
                    />
                    <KeyValueItem 
                        label="Cargo Securement Standard" 
                        value="FMCSA 393 Compliant" 
                    />
                </div>
            </div>

            {/* Bottom 3-Step Compliance Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[11.5px] text-slate-500 dark:text-slate-400">
                    Want to view or update your full 3-step carrier compliance checklist?
                </span>

                <Button
                    type="button"
                    size="sm"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-driver-compliance'))}
                    className="h-8 px-3.5 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap ml-auto"
                >
                    <ShieldCheck size={13} />
                    <span>Open 3-Step Compliance</span>
                </Button>
            </div>
        </div>
    );
};
