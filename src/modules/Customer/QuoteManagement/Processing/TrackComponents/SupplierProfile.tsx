import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';

export default function SupplierProfile({ supplier }: { supplier: any }) {
    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[5px] shadow-2xs p-3.5 space-y-2.5 font-sans">
            <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200 dark:border-orange-900/60 flex items-center justify-center text-sm font-bold relative shrink-0">
                    {supplier.name.charAt(0)}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#1e2329] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{supplier.name}</h3>
                        {supplier.verified && <ShieldCheck size={14} className="text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{supplier.active}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[11.5px]">{supplier.rating}</span>
                        <span className="font-medium text-slate-400 text-[10.5px]">({supplier.reviews} reviews)</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2 text-xs pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center min-h-[22px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">Completed shipments</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11.5px]">{supplier.completedOrders}+</span>
                </div>
                <div className="flex justify-between items-center min-h-[22px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">Success rate</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11.5px]">99.8%</span>
                </div>
                <div className="flex justify-between items-center min-h-[22px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">Response time</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11.5px]">&lt; 15 mins</span>
                </div>
                <div className="flex justify-between items-center min-h-[22px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">Member since</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11.5px]">{supplier.memberSince}</span>
                </div>
            </div>
        </div>
    );
}
