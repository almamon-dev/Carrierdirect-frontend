import React from 'react';
import { CreditCard } from 'lucide-react';

export default function AmountBreakdown({ pricing }: { pricing: any }) {
    return (
        <div
    className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between h-full font-sans">
            <div>
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2.5 mb-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <CreditCard size={16} className="text-[#ff4a1f]" /> Freight Payment Breakdown
                    </p>
                </div>

                <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Base freight rate</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">€{pricing.base.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Loading & handling</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">€{pricing.loading.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">CMR cargo insurance</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">€{pricing.insurance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Escrow deposit / advance</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[13px]">- €{pricing.advancePaid.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 min-h-[28px]">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-[13.5px]">Balance due on POD</span>
                <span className="font-extrabold text-[#ff4a1f] text-sm sm:text-base">€{pricing.due.toLocaleString()}</span>
            </div>
        </div>
    );
}



