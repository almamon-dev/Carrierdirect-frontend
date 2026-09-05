import React from 'react';
import { MapPin, Truck } from 'lucide-react';
import { CustomerChatItem } from '../../types';

export const CustomerChatOverviewSection: React.FC<{ activeChat: CustomerChatItem }> = ({ activeChat }) => (
    <div className="px-4 pb-3">
        <table className="w-full text-[11.5px] border-collapse">
            <tbody>
                <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                    <td className="py-1.5 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[90px] align-top">
                        <div className="flex items-center gap-1.5"><MapPin size={12} className="text-[#ff4a1f] shrink-0" /><span>Pickup</span></div>
                    </td>
                    <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none align-top">:</td>
                    <td className="py-1.5 pl-1 font-semibold text-slate-800 dark:text-slate-200 text-left leading-snug break-words">
                        {activeChat.origin || activeChat.raw?.pickup || '—'}
                    </td>
                </tr>
                <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                    <td className="py-1.5 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[90px] align-top">
                        <div className="flex items-center gap-1.5"><MapPin size={12} className="text-emerald-500 shrink-0" /><span>Delivery</span></div>
                    </td>
                    <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none align-top">:</td>
                    <td className="py-1.5 pl-1 font-semibold text-slate-800 dark:text-slate-200 text-left leading-snug break-words">
                        {activeChat.destination || activeChat.raw?.delivery || '—'}
                    </td>
                </tr>
                <tr>
                    <td className="py-1.5 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[90px]">
                        <div className="flex items-center gap-1.5"><Truck size={12} className="text-slate-400 shrink-0" /><span>Distance</span></div>
                    </td>
                    <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                    <td className="py-1.5 pl-1 font-semibold text-slate-800 dark:text-slate-200 text-left">{activeChat.distance}</td>
                </tr>
            </tbody>
        </table>
    </div>
);
