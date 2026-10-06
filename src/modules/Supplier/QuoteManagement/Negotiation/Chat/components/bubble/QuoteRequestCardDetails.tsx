import React from 'react';

interface QuoteRequestCardDetailsProps {
    isOpen: boolean;
    pickupDate: string;
    deliveryDate: string;
    palletType: string;
    vehicleType: string;
    notes?: string;
}

export const QuoteRequestCardDetails: React.FC<QuoteRequestCardDetailsProps> = ({
    isOpen,
    pickupDate,
    deliveryDate,
    palletType,
    vehicleType,
    notes,
}) => {
    if (isOpen !== undefined && !isOpen) return null;

    return (
        <div
            className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-[4px] border border-slate-200/70 dark:border-slate-800 space-y-2 animate-in fade-in duration-150 text-[11.5px] w-full min-w-0">
            <div className="grid grid-cols-2 gap-2">
                <div className="min-w-0">
                    <span className="text-[10.5px] text-slate-400 font-normal block">Pickup Date</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5 truncate">{pickupDate}</span>
                </div>
                <div className="min-w-0">
                    <span className="text-[10.5px] text-slate-400 font-normal block">Delivery Date</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5 truncate">{deliveryDate}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="min-w-0">
                    <span className="text-[10.5px] text-slate-400 font-normal block">Vehicle / Pallet</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5 truncate">{palletType}</span>
                </div>
                <div className="min-w-0">
                    <span className="text-[10.5px] text-slate-400 font-normal block">Trailer Type</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5 truncate">{vehicleType}</span>
                </div>
            </div>
            {notes && (
                <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 min-w-0">
                    <span className="text-[10.5px] text-slate-400 font-normal block">Notes & Requirements</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed break-words">{notes}</p>
                </div>
            )}
        </div>
    );
};
