import React from 'react';
import { Receipt, BadgeCheck } from 'lucide-react';
import { DetailRow } from './SubmittedSpecsSection';

interface SubmittedPricingSectionProps {
    basePrice?: string;
    extraCharges?: Array<{ type: string; customName?: string; amount: string }>;
    numericOffer: number;
}

export const SubmittedPricingSection: React.FC<SubmittedPricingSectionProps> = ({
    basePrice,
    extraCharges = [],
    numericOffer,
}) => {
    const hasExtraCharges = extraCharges.length > 0;

    return (
        <div className="space-y-3 min-w-0">
            <div className="space-y-0.5 min-w-0">
                <h4 className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 pb-0.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                    <Receipt size={12} className="text-[#ff4a1f]" />
                    <span>Commercial Offer Breakdown</span>
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {basePrice && hasExtraCharges && (
                        <DetailRow
                            label="Base Freight Rate"
                            value={
                                <span className="font-normal text-slate-700 dark:text-slate-300">
                                    € {parseFloat(basePrice || '0').toFixed(2)}
                                </span>
                            }
                        />
                    )}
                    {hasExtraCharges && extraCharges.map((ch, i) => (
                        <DetailRow
                            key={i}
                            label={ch.type === 'Custom' ? (ch.customName || 'Custom Surcharge') : ch.type}
                            value={
                                <span className="font-normal text-slate-600 dark:text-slate-300">
                                    +€ {parseFloat(ch.amount || '0').toFixed(2)}
                                </span>
                            }
                        />
                    ))}
                    <DetailRow
                        label="Submitted Offer"
                        value={
                            <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                                € {numericOffer.toFixed(2)} <span className="text-[10.5px] font-normal text-slate-500">(Gross)</span>
                            </span>
                        }
                    />
                    <DetailRow
                        label="Security Escrow"
                        value={
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                                <BadgeCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                                100% Guaranteed by Platform
                            </span>
                        }
                    />
                    <DetailRow
                        label="Settlement Mode"
                        value={
                            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                CarrierDirect Escrow Protected
                            </span>
                        }
                    />
                </div>
            </div>
        </div>
    );
};
