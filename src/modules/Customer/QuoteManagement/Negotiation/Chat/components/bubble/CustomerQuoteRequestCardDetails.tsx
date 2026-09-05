import React from 'react';

interface CustomerQuoteRequestCardDetailsProps {
    pickupDate: string;
    deliveryDate: string;
    palletType: string;
    vehicle: string;
    notes?: string;
}

export const CustomerQuoteRequestCardDetails: React.FC<CustomerQuoteRequestCardDetailsProps> = ({
    pickupDate,
    deliveryDate,
    palletType,
    vehicle,
    notes,
}) => {
    return (
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-[5px] border border-slate-100 dark:border-slate-800 space-y-2 text-[11.5px] animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <span className="text-[10px] text-slate-400 block">Pickup Date</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{pickupDate}</span>
                </div>
                <div>
                    <span className="text-[10px] text-slate-400 block">Delivery Date</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{deliveryDate}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <div>
                    <span className="text-[10px] text-slate-400 block">Pallet Type</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{palletType}</span>
                </div>
                <div>
                    <span className="text-[10px] text-slate-400 block">Vehicle Spec</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{vehicle}</span>
                </div>
            </div>
            {notes && (
                <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Notes & Requirements</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{notes}</p>
                </div>
            )}
        </div>
    );
};
