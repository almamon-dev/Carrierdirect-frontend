import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

export default function VehicleDetails({ vehicle, supplier }: { vehicle: any, supplier: any }) {
    return (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Vehicle Details</p>
                <div className="w-8 h-8 bg-brand-light text-brand rounded-lg flex items-center justify-center shrink-0">
                    <Truck size={16} />
                </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center space-y-3">
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-500">Vehicle Type</span>
                    <span className="font-semibold text-slate-800">{vehicle.type}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-500">License Plate</span>
                    <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">{vehicle.number}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-500">Capacity</span>
                    <span className="font-semibold text-slate-800">{vehicle.capacity}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-500">Goods Type</span>
                    <span className="font-semibold text-slate-800">{vehicle.goodsType}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-500">Supplier</span>
                    <span className="font-semibold text-brand flex items-center gap-1">
                        {supplier.name} 
                        {supplier.verified && <ShieldCheck size={14} className="text-brand" />}
                    </span>
                </div>
            </div>
        </div>
    );
}
