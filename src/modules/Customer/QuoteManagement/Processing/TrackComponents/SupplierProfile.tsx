import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';

export default function SupplierProfile({ supplier }: { supplier: any }) {
    return (
        <div
    className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs p-4 space-y-3 font-sans">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200 dark:border-orange-900/60 flex items-center justify-center text-base font-bold relative shrink-0">
                    {supplier.name?.charAt(0) || 'C'}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#1e2329] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{supplier.name}</h3>
                        {supplier.verified && <ShieldCheck size={16} className="text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{supplier.active || 'Active now'}</p>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <span className="text-[12.5px]">{supplier.rating}</span>
                        <span className="font-medium text-slate-400 text-xs">({supplier.reviews} reviews)</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2.5 text-sm pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center min-h-[24px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Completed shipments</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{supplier.completedOrders}+</span>
                </div>
                <div className="flex justify-between items-center min-h-[24px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Success rate</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[13px]">99.8%</span>
                </div>
                <div className="flex justify-between items-center min-h-[24px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Response time</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">&lt; 15 mins</span>
                </div>
                <div className="flex justify-between items-center min-h-[24px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Member since</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{supplier.memberSince}</span>
                </div>
            </div>
        </div>
    );
}
