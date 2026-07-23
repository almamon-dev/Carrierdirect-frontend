import React from 'react';
import { ShieldCheck, Star, Award, Clock, CheckCircle } from 'lucide-react';
import Badge from '@/components/ui/badge';

export default function SupplierProfile({ supplier }: { supplier: any }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs p-4 space-y-3 font-sans">
            <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#ff4a1f] border border-orange-200 flex items-center justify-center text-lg font-bold relative shrink-0">
                    {supplier.name.charAt(0)}
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900 truncate">{supplier.name}</h3>
                        {supplier.verified && <ShieldCheck size={16} className="text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{supplier.active}</p>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mt-1">
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <span>{supplier.rating}</span>
                        <span className="font-medium text-slate-400 text-[11px]">({supplier.reviews} reviews)</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10.5px] font-medium text-slate-500">Completed shipments</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{supplier.completedOrders}+</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10.5px] font-medium text-slate-500">Success rate</p>
                    <p className="text-xs font-bold text-emerald-600 mt-0.5">99.8%</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10.5px] font-medium text-slate-500">Response time</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">&lt; 15 mins</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10.5px] font-medium text-slate-500">Member since</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{supplier.memberSince}</p>
                </div>
            </div>
        </div>
    );
}
