import React from 'react';
import { ShipmentStatus } from '../../types';

interface Props {
    status: ShipmentStatus;
}

export const ShipmentStatusBadge: React.FC<Props> = ({ status }) => {
    switch (status) {
        case 'in_transit':
            return (
                <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 text-[11px] font-bold rounded-[4px] bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span>In Transit</span>
                </span>
            );
        case 'at_pickup':
            return (
                <span className="inline-flex items-center h-6.5 px-2.5 text-[11px] font-bold rounded-[4px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 whitespace-nowrap">
                    At Pickup
                </span>
            );
        case 'at_delivery':
            return (
                <span className="inline-flex items-center h-6.5 px-2.5 text-[11px] font-bold rounded-[4px] bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 whitespace-nowrap">
                    At Delivery
                </span>
            );
        case 'assigned':
        case 'accepted':
            return (
                <span className="inline-flex items-center h-6.5 px-2.5 text-[11px] font-bold rounded-[4px] bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 whitespace-nowrap">
                    Assigned
                </span>
            );
        case 'delivered':
            return (
                <span className="inline-flex items-center gap-1 h-6.5 px-2.5 text-[11px] font-bold rounded-[4px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 whitespace-nowrap">
                    <span>✓</span>
                    <span>Delivered</span>
                </span>
            );
        case 'cancelled':
            return (
                <span className="inline-flex items-center h-6.5 px-2.5 text-[11px] font-bold rounded-[4px] bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/60 whitespace-nowrap">
                    Cancelled
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center h-6.5 px-2.5 text-[11px] font-bold rounded-[4px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap capitalize">
                    {String(status).replace('_', ' ')}
                </span>
            );
    }
};
