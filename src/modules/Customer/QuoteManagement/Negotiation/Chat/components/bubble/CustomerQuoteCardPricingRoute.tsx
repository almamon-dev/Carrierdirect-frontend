import React from 'react';
import { MapPin, Package, Landmark, Receipt } from 'lucide-react';

interface CustomerQuoteCardPricingRouteProps {
    pickupLoc: string;
    deliveryLoc: string;
    dist: string;
    baseFreightRate: number;
    extraCharges: any[];
    totalQuotationAmount: number;
}

export const CustomerQuoteCardPricingRoute: React.FC<CustomerQuoteCardPricingRouteProps> = ({
    pickupLoc,
    deliveryLoc,
    dist,
    baseFreightRate,
    extraCharges,
    totalQuotationAmount,
}) => {
    return (
        <>
            {/* Route */}
            <div className="py-1 text-[11.5px]">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#FF6A00] bg-white dark:bg-slate-900 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{pickupLoc}</span>
                    </div>
                    <span className="text-[10.5px] font-medium text-slate-400 shrink-0 ml-2">{dist}</span>
                </div>

                <div className="ml-[4px] pl-3.5 border-l-2 border-dotted border-slate-300 dark:border-slate-700 h-3.5 my-0.5" />

                <div className="flex items-center gap-2 min-w-0">
                    <MapPin size={13} className="text-[#2563EB] shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{deliveryLoc}</span>
                </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 space-y-1.5 text-[11.5px]">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                        <Package size={13} className="text-slate-400 shrink-0" />
                        <span>Base Freight Rate</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                        € {baseFreightRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>

                {extraCharges.length > 0 && extraCharges.map((charge: any, idx: number) => {
                    const label = charge.custom_name || charge.customName || charge.label || charge.type || `Extra Charge #${idx + 1}`;
                    const isToll = label.toLowerCase().includes('toll');
                    const isCustoms = label.toLowerCase().includes('custom');
                    const IconComponent = isToll ? Landmark : isCustoms ? Receipt : Package;

                    return (
                        <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                                <IconComponent size={13} className="text-slate-400 shrink-0" />
                                <span>{label}</span>
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                                € {Number(charge.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Total Quotation Amount */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between">
                <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">Total Quotation Amount</span>
                <span className="text-[15px] font-bold text-slate-900 dark:text-white">
                    € {totalQuotationAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
        </>
    );
};
