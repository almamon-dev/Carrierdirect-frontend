import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones, PhoneCall, MessageSquare, ShieldAlert, Phone } from 'lucide-react';
import Button from '@/components/ui/button';
import TabHeader from '@/components/ui/tab-header';

const KeyValueItem = ({ 
    label, 
    value, 
    isMono = false,
    highlight = false,
    action
}: { 
    label: string; 
    value: React.ReactNode; 
    isMono?: boolean;
    highlight?: boolean;
    action?: React.ReactNode;
}) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-36 sm:w-48 shrink-0 text-slate-500 dark:text-slate-400 font-medium">{label}</span>
            <span className="text-slate-300 dark:text-slate-600 font-bold select-none">:</span>
            <span className={`truncate ${isMono ? 'font-mono' : ''} ${highlight ? 'font-bold text-[#ff4a1f]' : 'font-semibold text-slate-800 dark:text-slate-200'}`}>
                {value}
            </span>
        </div>
        {action && <div className="shrink-0">{action}</div>}
    </div>
);

export const SupportSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            <TabHeader title="Support & Dispatch SOS" icon={Headphones} />

            {/* 1. 24/7 Dispatch Operations */}
            <div className="space-y-1">
                <div className="flex items-center justify-between pb-1">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        24/7 Dispatch Operations & Load Assistance
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-[3px]">
                        Dispatch Online
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0.5">
                    <KeyValueItem 
                        label="Direct Dispatch Hotline" 
                        value="+1 (800) 555-LOAD (5623)" 
                        isMono={true}
                        highlight={true}
                        action={
                            <a
                                href="tel:+18005555623"
                                className="px-2 py-0.5 text-[10.5px] font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] rounded-[2px] shadow-2xs"
                            >
                                Call Now
                            </a>
                        }
                    />

                    <KeyValueItem 
                        label="Dispatcher Live Chat" 
                        value="Active (Avg response < 2 mins)" 
                        action={
                            <button
                                type="button"
                                onClick={() => navigate('/driver/chat')}
                                className="px-2 py-0.5 text-[10.5px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-[2px] shadow-2xs cursor-pointer"
                            >
                                Open Chat
                            </button>
                        }
                    />

                    <KeyValueItem 
                        label="Assigned Freight Desk" 
                        value="Northeast Regional Operations Hub" 
                    />

                    <KeyValueItem 
                        label="Lead Dispatch Supervisor" 
                        value="David Miller (Direct Ext #204)" 
                    />

                    <KeyValueItem 
                        label="Detention & Lumper Line" 
                        value="+1 (800) 555-4421" 
                        isMono={true}
                    />

                    <KeyValueItem 
                        label="Gate Pass & Access Codes" 
                        value="support-access@carrierdirect.com" 
                    />
                </div>
            </div>

            {/* 2. Highway Breakdown & Emergency SOS */}
            <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between pb-1">
                    <h3 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <ShieldAlert size={14} />
                        <span>Highway Emergency & Roadside Breakdown</span>
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 rounded-[3px]">
                        24/7 Priority SOS
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0.5">
                    <KeyValueItem 
                        label="National Roadside SOS" 
                        value="1-888-999-TRUCK (8782)" 
                        isMono={true}
                        highlight={true}
                        action={
                            <a
                                href="tel:18889998782"
                                className="px-2.5 py-0.5 text-[10.5px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-[2px] shadow-2xs"
                            >
                                SOS Call
                            </a>
                        }
                    />

                    <KeyValueItem 
                        label="Commercial Heavy Towing" 
                        value="Nationwide Heavy Wrecker Network" 
                    />

                    <KeyValueItem 
                        label="Mobile Tire Repair" 
                        value="Commercial Fleet 24/7 Road Service" 
                    />

                    <KeyValueItem 
                        label="Reefer Unit Emergency" 
                        value="Thermo King / Carrier Priority Care" 
                    />

                    <KeyValueItem 
                        label="Incident / Accident Desk" 
                        value="safety-sos@carrierdirect.com" 
                    />

                    <KeyValueItem 
                        label="Insurance Claims Unit" 
                        value="Policy #CD-COMM-9948201" 
                        isMono={true}
                    />
                </div>
            </div>
        </div>
    );
};
