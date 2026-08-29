import React from 'react';
import { NegotiationItem } from '../../types';

interface PricingBreakdownSectionProps {
    activeNegotiation: NegotiationItem;
    currency: string;
    currentPrice: number;
}

export const PricingBreakdownSection: React.FC<PricingBreakdownSectionProps> = ({
    activeNegotiation,
    currency,
    currentPrice
}) => {
    // Determine extra charges and base freight
    const rawExtraCharges = activeNegotiation.extraCharges;
    const hasCustomCharges = Array.isArray(rawExtraCharges) && rawExtraCharges.length > 0;

    const extraCharges = hasCustomCharges
        ? rawExtraCharges
        : [
            { label: 'Loading & Unloading', amount: Math.round(currentPrice * 0.08) || 30 },
            { label: 'Transit Insurance', amount: Math.round(currentPrice * 0.04) || 20 }
        ];

    const totalExtras = extraCharges.reduce((acc, c) => acc + Number(c.amount || 0), 0);
    const baseFreight = activeNegotiation.baseFreight || Math.max(0, currentPrice - totalExtras);
    const displayCurrency = '€';

    return (
        <div className="px-4 pb-3 text-[12px] space-y-2.5">
            <div className="space-y-2 pb-2.5 border-b border-slate-100">
                {/* Base Freight */}
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Base Freight</span>
                    <span className="font-bold text-slate-800">{displayCurrency} {baseFreight.toLocaleString()}</span>
                </div>

                {/* Extra Charges */}
                {extraCharges.map((charge, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                        <span className="text-slate-500 flex items-center gap-1">
                            <span>{charge.label}</span>
                            {charge.description && (
                                <span className="text-[10px] text-slate-400">({charge.description})</span>
                            )}
                        </span>
                        <span className="font-semibold text-slate-700">{displayCurrency} {Number(charge.amount || 0).toLocaleString()}</span>
                    </div>
                ))}
            </div>

            {/* Total / Current Rate */}
            <div className="pt-0.5 flex justify-between items-center">
                <span className="font-bold text-slate-800">Current Total</span>
                <span className="text-[15px] font-black text-[#FF4A1F]">{displayCurrency} {currentPrice.toLocaleString()}</span>
            </div>
        </div>
    );
};
