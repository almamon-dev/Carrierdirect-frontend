import React from 'react';
import { MapPin } from 'lucide-react';

interface QuoteBubbleRouteProps {
    pickupLoc: string;
    deliveryLoc: string;
    distanceStr: string;
}

export const QuoteBubbleRoute: React.FC<QuoteBubbleRouteProps> = ({
    pickupLoc,
    deliveryLoc,
    distanceStr,
}) => {
    return (
        <div className="py-1 text-[11.5px]">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#FF6A00] bg-white dark:bg-slate-900 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{pickupLoc}</span>
                </div>
                <span className="text-[10.5px] font-medium text-slate-400 shrink-0 ml-2">{distanceStr}</span>
            </div>
            <div className="ml-[4px] pl-3.5 border-l-2 border-dotted border-slate-300 dark:border-slate-700 h-3.5 my-0.5" />
            <div className="flex items-center gap-2 min-w-0">
                <MapPin size={13} className="text-[#2563EB] shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{deliveryLoc}</span>
            </div>
        </div>
    );
};
