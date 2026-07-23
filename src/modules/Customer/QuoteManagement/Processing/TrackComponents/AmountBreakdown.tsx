import React from 'react';
import Badge from '@/components/ui/badge';
import { CreditCard, ShieldCheck } from 'lucide-react';

export default function AmountBreakdown({ pricing }: { pricing: any }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <CreditCard size={15} className="text-[#ff4a1f]" /> Freight Payment Breakdown
                </p>
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10.5px] font-bold">
                    Escrow Protected
                </Badge>
            </div>
            
            <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500">Base freight rate</span>
                    <span className="font-semibold text-slate-900">€{pricing.base.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500">Loading & handling</span>
                    <span className="font-semibold text-slate-900">€{pricing.loading.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500">CMR cargo insurance</span>
                    <span className="font-semibold text-slate-900">€{pricing.insurance.toLocaleString()}</span>
                </div>
            </div>
            
            <div className="pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total freight amount</span>
                    <span className="font-bold text-slate-900 text-sm">€{pricing.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Escrow deposit / advance</span>
                    <span className="font-semibold text-emerald-600">- €{pricing.advancePaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="font-bold text-slate-900">Balance due on POD</span>
                    <span className="font-extrabold text-[#ff4a1f] text-sm">€{pricing.due.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
