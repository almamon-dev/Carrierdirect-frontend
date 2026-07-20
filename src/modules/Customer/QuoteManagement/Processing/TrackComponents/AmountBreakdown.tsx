import React from 'react';
import Badge from '@/components/ui/badge';

export default function AmountBreakdown({ pricing }: { pricing: any }) {
    return (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Amount Breakdown</p>
                <Badge variant="success" className="px-2 py-0.5 text-[11px] font-mono font-bold bg-emerald-100 text-emerald-700">Paid 30%</Badge>
            </div>
            
            <div className="flex-1 flex flex-col justify-center space-y-2.5">
                <div className="flex justify-between items-center text-[13px] text-slate-600">
                    <span>Base Freight</span>
                    <span className="font-semibold text-slate-800">৳ {pricing.base.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-slate-600">
                    <span>Load/Unload</span>
                    <span className="font-semibold text-slate-800">৳ {pricing.loading.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-slate-600">
                    <span>Insurance</span>
                    <span className="font-semibold text-slate-800">৳ {pricing.insurance.toLocaleString()}</span>
                </div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between items-center text-[14px]">
                    <span className="font-bold text-slate-800">Total Amount</span>
                    <span className="font-bold text-slate-900">৳ {pricing.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                    <span className="text-slate-500">Advance Paid</span>
                    <span className="font-medium text-emerald-600">- ৳ {pricing.advancePaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[14px] mt-1 pt-1 border-t border-slate-50">
                    <span className="font-bold text-red-500">Due Amount</span>
                    <span className="font-black text-red-600">৳ {pricing.due.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
