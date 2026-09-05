import React from 'react';
import { CreditCard } from 'lucide-react';
import { ExtraChargeItem } from './ExtraChargesSection';

interface PriceBreakdownCardProps {
    basePrice: number;
    extraCharges: ExtraChargeItem[];
    totalAmount: number;
    escrowFee?: number;
    netPayout?: number;
    isExpired: boolean;
    isStripeConnected: boolean | null;
    onOpenConnect: () => void;
}

export const PriceBreakdownCard: React.FC<PriceBreakdownCardProps> = ({
    basePrice,
    extraCharges,
    totalAmount,
    isExpired,
    isStripeConnected,
    onOpenConnect,
}) => {
    const validExtras = extraCharges.filter(c => parseFloat(c.amount) > 0);

    return (
        <div className="space-y-2 pt-1">
            <div className="p-3 bg-slate-50/90 dark:bg-[#181d24]/90 rounded-[3px] border border-slate-200/90 dark:border-slate-800 space-y-1.5 font-sans">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Payment Breakdown
                </div>

                <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                    <span>Base Freight:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        € {basePrice.toFixed(2)}
                    </span>
                </div>

                {validExtras.map((c, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                        <span>+ {c.customName || c.type || 'Extra Charge'}:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                            € {parseFloat(c.amount).toFixed(2)}
                        </span>
                    </div>
                ))}

                <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-baseline">
                    <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                            Total Quotation Amount:
                        </span>
                        <span className="text-[10px] text-slate-400">Total customer payable</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        € {totalAmount.toFixed(2)}
                    </span>
                </div>
            </div>

            {isStripeConnected === false && !isExpired && (
                <div className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-[3px] text-xs text-amber-800 dark:text-amber-300">
                    <CreditCard size={14} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <div className="space-y-1">
                        <p className="font-medium leading-tight">Payout account not connected</p>
                        <button
                            type="button"
                            onClick={onOpenConnect}
                            className="font-bold underline hover:text-amber-900 dark:hover:text-amber-100 cursor-pointer"
                        >
                            Connect Stripe / Bank Account
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
