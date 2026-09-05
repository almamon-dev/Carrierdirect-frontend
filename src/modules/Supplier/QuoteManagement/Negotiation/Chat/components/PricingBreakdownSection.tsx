import React from 'react';
import { CreditCard, PackageCheck, ShieldCheck } from 'lucide-react';
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
        <div className="px-4 pb-3">
            <table className="w-full text-[11.5px] border-collapse">
                <tbody>
                    <tr className="border-b border-slate-100/80">
                        <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5">
                                <CreditCard size={12} className="text-slate-400 shrink-0" />
                                <span>Base Freight</span>
                            </div>
                        </td>
                        <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                        <td className="py-1.5 pl-1 font-bold text-slate-800 text-right">
                            {displayCurrency} {baseFreight.toLocaleString()}
                        </td>
                    </tr>

                    {extraCharges.map((charge, idx) => (
                        <tr key={idx} className="border-b border-slate-100/80">
                            <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[130px]">
                                <div className="flex items-center gap-1.5">
                                    {idx % 2 === 0 ? (
                                        <PackageCheck size={12} className="text-amber-500 shrink-0" />
                                    ) : (
                                        <ShieldCheck size={12} className="text-teal-500 shrink-0" />
                                    )}
                                    <span className="truncate max-w-[100px]" title={charge.label}>{charge.label}</span>
                                </div>
                            </td>
                            <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                            <td className="py-1.5 pl-1 font-semibold text-slate-700 text-right">
                                {displayCurrency} {Number(charge.amount || 0).toLocaleString()}
                            </td>
                        </tr>
                    ))}

                    <tr>
                        <td className="py-2 text-slate-800 font-bold whitespace-nowrap w-[130px]">
                            <div className="flex items-center gap-1.5">
                                <CreditCard size={12} className="text-[#FF4A1F] shrink-0" />
                                <span>Current Total</span>
                            </div>
                        </td>
                        <td className="py-2 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                        <td className="py-2 pl-1 text-[14px] font-black text-[#FF4A1F] text-right">
                            {displayCurrency} {currentPrice.toLocaleString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
