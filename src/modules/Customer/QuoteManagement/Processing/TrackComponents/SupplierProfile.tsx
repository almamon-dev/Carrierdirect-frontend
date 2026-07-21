import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';

export default function SupplierProfile({ supplier }: { supplier: any }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-light text-indigo-700 flex items-center justify-center text-xl font-black relative shrink-0">
                    {supplier.name.charAt(0)}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[13px] font-bold text-slate-800 truncate">{supplier.name}</h3>
                        {supplier.verified && <ShieldCheck size={16} className="text-brand shrink-0" />}
                    </div>
                    <p className="text-[12px] text-slate-500 mb-1">{supplier.active}</p>
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        {supplier.rating} <span className="font-normal text-slate-400">({supplier.reviews} reviews)</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-3 pt-3 border-t border-slate-100">
                <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide">Completed</p>
                    <p className="text-[14px] font-bold text-slate-800">{supplier.completedOrders}+</p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide">Success Rate</p>
                    <p className="text-[14px] font-bold text-emerald-600">99.8%</p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide">Response Time</p>
                    <p className="text-[14px] font-bold text-slate-800">&lt; 15 Mins</p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide">Member Since</p>
                    <p className="text-[14px] font-bold text-slate-800">{supplier.memberSince}</p>
                </div>
            </div>
        </div>
    );
}
