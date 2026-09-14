import React from 'react';
import { ShieldCheck, Star, Building2 } from 'lucide-react';

export default function SupplierCustomerProfile({ customer }: { customer: any }) {
    const nameStr = typeof customer === 'string'
        ? customer
        : (typeof customer?.name === 'string' ? customer.name : (customer?.name?.name || customer?.company_name || 'Apex Logistics Corp'));
    const initial = nameStr ? String(nameStr).charAt(0).toUpperCase() : 'C';

    return (
        <div
    className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs p-4 space-y-3 font-sans">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-base font-bold relative shrink-0">
                    {initial}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#1e2329] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{nameStr}</h3>
                        {(customer?.verified ?? true) && <ShieldCheck size={16} className="text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{customer?.active || 'Active 2m ago'}</p>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <span className="text-[12.5px]">{customer?.rating || 4.9}</span>
                        <span className="font-medium text-slate-400 text-xs">({customer?.reviews || 184} reviews)</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2.5 text-sm pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center min-h-[24px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Shipper category</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px] flex items-center gap-1.5">
                        <Building2 size={13} className="text-blue-600" /> Enterprise Shipper
                    </span>
                </div>
                <div className="flex justify-between items-center min-h-[24px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Total orders placed</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{customer.completedOrders}+</span>
                </div>
                <div className="flex justify-between items-center min-h-[24px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Payment on time</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[13px]">100% Guaranteed</span>
                </div>
                <div className="flex justify-between items-center min-h-[24px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Member since</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{customer.memberSince}</span>
                </div>
            </div>
        </div>
    );
}
