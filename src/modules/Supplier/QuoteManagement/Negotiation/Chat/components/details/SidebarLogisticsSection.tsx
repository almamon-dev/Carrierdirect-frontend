import React from 'react';
import { Calendar, Truck } from 'lucide-react';
import { NegotiationItem } from '../../../types';

export const SidebarLogisticsSection: React.FC<{ activeNegotiation: NegotiationItem }> = ({ activeNegotiation }) => (
    <div className="px-4 pb-3 space-y-2">
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200/70 space-y-1.5">
            <div className="flex items-start gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <span className="font-semibold text-slate-800 leading-tight break-words">{activeNegotiation.pickup}</span>
            </div>
            <div className="border-l border-dashed border-slate-300 ml-1 pl-3 text-[10px] text-slate-400">{activeNegotiation.distance}</div>
            <div className="flex items-start gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FF4A1F] mt-1 shrink-0" />
                <span className="font-semibold text-slate-800 leading-tight break-words">{activeNegotiation.delivery}</span>
            </div>
        </div>
        <table className="w-full text-[11.5px] border-collapse">
            <tbody>
                <tr className="border-b border-slate-100/80">
                    <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[95px]">
                        <div className="flex items-center gap-1.5">
                            <Truck size={12} className="text-slate-400 shrink-0" />
                            <span>Vehicle</span>
                        </div>
                    </td>
                    <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                    <td className="py-1.5 pl-1 font-medium text-slate-800 text-right">
                        {activeNegotiation.vehicleType || 'Curtain Sider'}
                    </td>
                </tr>
                <tr>
                    <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[95px]">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-slate-400 shrink-0" />
                            <span>Pickup Date</span>
                        </div>
                    </td>
                    <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                    <td className="py-1.5 pl-1 font-medium text-slate-800 text-right">
                        {activeNegotiation.pickupDate || activeNegotiation.requestDate || '26 Aug 2026'}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);
