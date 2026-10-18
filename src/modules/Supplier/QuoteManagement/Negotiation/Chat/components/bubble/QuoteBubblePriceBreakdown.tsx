import React from 'react';
import { Package, Landmark, Receipt } from 'lucide-react';
import { getServiceIcon } from '@/modules/Customer/QuoteManagement/Negotiation/Actions/components/CounterOfferModal';

interface QuoteBubblePriceBreakdownProps {
    basePrice: number;
    extraList: any[];
    totalQuotationAmount: number;
    canAccept: boolean;
}

export const QuoteBubblePriceBreakdown: React.FC<QuoteBubblePriceBreakdownProps> = ({
    basePrice,
    extraList,
    totalQuotationAmount,
    canAccept,
}) => {
    return (
        <>
            {/* Itemized Breakdown with Outline Icons */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 space-y-1.5 text-[11.5px]">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                        <Package size={13} className="text-slate-400 shrink-0" />
                        <span>Base Freight Rate</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                        € {basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>

                {extraList.length > 0 &&
                    extraList.map((ext: any, idx: number) => {
                        const label = ext.customName || ext.custom_name || ext.label || ext.type || 'Extra Fee';
                        const isToll = label.toLowerCase().includes('toll');
                        const isCustoms = label.toLowerCase().includes('custom');
                        const IconComponent = isToll ? Landmark : isCustoms ? Receipt : getServiceIcon(label);

                        return (
                            <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                    <IconComponent size={13} className="text-slate-400 shrink-0" />
                                    <span>{label}</span>
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    € {Number(ext.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        );
                    })}
            </div>

            {/* Total Revised Rate Row */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between">
                <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">
                    {canAccept ? 'Counter Offer Rate' : 'Total Revised Rate'}
                </span>
                <span className="text-[15px] font-bold text-slate-900 dark:text-white">
                    € {totalQuotationAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
        </>
    );
};
