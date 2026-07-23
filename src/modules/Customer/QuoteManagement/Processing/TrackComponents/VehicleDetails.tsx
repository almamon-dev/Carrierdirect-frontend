import React from 'react';
import { Truck, ShieldCheck, Container, Shield } from 'lucide-react';
import Badge from '@/components/ui/badge';

export default function VehicleDetails({ vehicle, supplier }: { vehicle: any, supplier: any }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Truck size={15} className="text-[#ff4a1f]" /> Vehicle & Carrier Details
                </p>
                <Badge className="bg-slate-100 text-slate-700 border border-slate-200 text-[10.5px] font-semibold px-2 py-0.5">
                    Assigned Transport
                </Badge>
            </div>
            
            <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Vehicle type</span>
                    <span className="font-bold text-slate-900">{vehicle.type}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">License plate</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11.5px]">{vehicle.number}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Cargo capacity</span>
                    <span className="font-bold text-slate-900">{vehicle.capacity}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Goods type</span>
                    <span className="font-bold text-slate-900">{vehicle.goodsType}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Assigned carrier</span>
                    <span className="font-bold text-[#ff4a1f] flex items-center gap-1.5">
                        {supplier.name} 
                        {supplier.verified && <ShieldCheck size={14} className="text-emerald-600" />}
                    </span>
                </div>
            </div>
        </div>
    );
}
