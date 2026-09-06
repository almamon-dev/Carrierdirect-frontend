import React from 'react';
import { CreditCard } from 'lucide-react';

export default function AmountBreakdown({ pricing }: { pricing: any }) {
    return (
        <div className="bg-white dark:bg-[#1e2329] p-3.5 rounded-[5px] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between h-full font-sans">
            <div>
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2.5 mb-2.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <CreditCard size={14} className="text-[#ff4a1f]" /> Freight Payment Breakdown
                    </p>
                </div>

                <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center min-h-[24px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">Base freight rate</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11.5px]">€{pricing.base.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[24px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">Loading & handling</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11.5px]">€{pricing.loading.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[24px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">CMR cargo insurance</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11.5px]">€{pricing.insurance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[24px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">Escrow deposit / advance</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11.5px]">- €{pricing.advancePaid.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80 min-h-[26px]">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-[11.5px]">Balance due on POD</span>
                <span className="font-extrabold text-[#ff4a1f] text-xs">€{pricing.due.toLocaleString()}</span>
            </div>
        </div>
    );
}



