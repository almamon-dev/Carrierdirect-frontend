import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

export default function VehicleDetails({ vehicle, supplier }: { vehicle: any, supplier: any }) {
    return (
        <div
    className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between h-full font-sans">
            <div>
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2.5 mb-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Truck size={16} className="text-[#ff4a1f]" /> Vehicle & Carrier Details
                    </p>
                </div>

                <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Vehicle type</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{vehicle.type}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">License plate</span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{vehicle.number}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Cargo capacity</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{vehicle.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Goods type</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{vehicle.goodsType}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 min-h-[28px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Assigned carrier</span>
                <span className="font-bold text-[#ff4a1f] flex items-center gap-1.5 text-[13px]">
                    {supplier.name}
                    {supplier.verified && <ShieldCheck size={15} className="text-emerald-600" />}
                </span>
            </div>
        </div>
    );
}



