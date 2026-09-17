import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Clock, FileCheck2, HardHat, FileText } from 'lucide-react';
import Button from '@/components/ui/button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const SafetyComplianceModal: React.FC<Props> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const safetyChecklist = [
        { title: 'Electronic Logbook (ELD) Active', desc: 'Syncing duty status and driving limits in real time', status: 'Compliant' },
        { title: 'Pre-Trip Vehicle Inspection (DVIR)', desc: 'Brakes, tires, reefer temperature unit, lights verified', status: 'Passed' },
        { title: 'DOT Medical Certificate', desc: 'Valid through Nov 2027 (Certified Examiner Registry #9982)', status: 'Valid' },
        { title: 'Hazardous Materials Endorsement', desc: 'Compliant with HazMat 49 CFR security clearance', status: 'Active' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#12161c] rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">Safety & Route Compliance</h2>
                            <p className="text-xs text-slate-500">Carrier safety protocols & federal driver standards</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Hours of Service (HOS) widget */}
                    <div className="bg-slate-50 dark:bg-[#1a1f26] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <Clock size={15} className="text-[#FF4A1F]" />
                                <span>Hours of Service (HOS) Today</span>
                            </span>
                            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full">
                                In Good Standing
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2.5 bg-white dark:bg-[#12161c] rounded-lg border border-slate-200/60 dark:border-slate-800">
                                <div className="text-xs text-slate-400 font-medium">Drive Time Left</div>
                                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">5h 15m</div>
                            </div>
                            <div className="p-2.5 bg-white dark:bg-[#12161c] rounded-lg border border-slate-200/60 dark:border-slate-800">
                                <div className="text-xs text-slate-400 font-medium">On-Duty Left</div>
                                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">7h 30m</div>
                            </div>
                            <div className="p-2.5 bg-white dark:bg-[#12161c] rounded-lg border border-slate-200/60 dark:border-slate-800">
                                <div className="text-xs text-slate-400 font-medium">Cycle (70h/8d)</div>
                                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">38h Left</div>
                            </div>
                        </div>
                    </div>

                    {/* Compliance checklist */}
                    <div className="space-y-2.5">
                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-600 dark:text-slate-400">Driver Credentials & DVIR</h3>
                        {safetyChecklist.map((item, idx) => (
                            <div key={idx} className="p-3.5 bg-white dark:bg-[#1a1f26] rounded-xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3">
                                <div>
                                    <div className="text-xs sm:text-[13.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                                        <span>{item.title}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 pl-5">{item.desc}</p>
                                </div>
                                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full shrink-0">
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-[#161a22]">
                    <Button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 text-white text-xs sm:text-[13px] px-5 py-2 rounded-lg font-bold">
                        Close Safety Overview
                    </Button>
                </div>
            </div>
        </div>
    );
};
