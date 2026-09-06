import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

export default function VehicleDetails({ vehicle, supplier }: { vehicle: any, supplier: any }) {
    return (
        <div className="bg-white dark:bg-[#1e2329] p-3.5 rounded-[5px] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between h-full font-sans">
            <div>
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2.5 mb-2.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Truck size={14} className="text-[#ff4a1f]" /> Vehicle & Carrier Details
                    </p>
                </div>

                <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center min-h-[24px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">Vehicle type</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11.5px]">{vehicle.type}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[24px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">License plate</span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 text-[11.5px]">{vehicle.number}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[24px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">Cargo capacity</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11.5px]">{vehicle.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[24px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">Goods type</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11.5px]">{vehicle.goodsType}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80 min-h-[26px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium text-[11.5px]">Assigned carrier</span>
                <span className="font-bold text-[#ff4a1f] flex items-center gap-1 text-[11.5px]">
                    {supplier.name}
                    {supplier.verified && <ShieldCheck size={13} className="text-emerald-600" />}
                </span>
            </div>
        </div>
    );
}



