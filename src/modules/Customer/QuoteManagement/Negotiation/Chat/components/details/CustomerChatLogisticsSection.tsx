import React from 'react';
import { Calendar, Truck } from 'lucide-react';
import { CustomerChatItem } from '../../types';

export const CustomerChatLogisticsSection: React.FC<{ activeChat: CustomerChatItem }> = ({ activeChat }) => (
    <div className="px-4 pb-3">
        <table className="w-full text-[11.5px] border-collapse">
            <tbody>
                <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                    <td className="py-1.5 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[95px]">
                        <div className="flex items-center gap-1.5"><Truck size={12} className="text-slate-400 shrink-0" /><span>Vehicle</span></div>
                    </td>
                    <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                    <td className="py-1.5 pl-1 font-semibold text-slate-800 dark:text-slate-200 text-left">{activeChat.vehicleType}</td>
                </tr>
                <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                    <td className="py-1.5 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[95px]">
                        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-400 shrink-0" /><span>Pickup Date</span></div>
                    </td>
                    <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                    <td className="py-1.5 pl-1 font-medium text-slate-800 dark:text-slate-200 text-left">
                        {activeChat.raw?.pickup_date || activeChat.raw?.pickupDate || '—'}
                    </td>
                </tr>
                <tr>
                    <td className="py-1.5 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[95px]">
                        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-400 shrink-0" /><span>Delivery Date</span></div>
                    </td>
                    <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                    <td className="py-1.5 pl-1 font-medium text-slate-800 dark:text-slate-200 text-left">
                        {activeChat.raw?.delivery_date || activeChat.raw?.deliveryDate || '—'}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);
