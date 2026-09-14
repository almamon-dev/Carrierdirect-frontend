import React from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface OfferFormHeaderProps {
    requestId: string;
    isWon?: boolean;
    isExpired: boolean;
    errorMessage: string | null;
    isStripeConnected: boolean;
    isCheckingConnect: boolean;
    onOpenConnect: () => void;
}

export const OfferFormHeader: React.FC<OfferFormHeaderProps> = ({
    requestId,
    isWon = false,
    isExpired,
    errorMessage,
    isStripeConnected,
    isCheckingConnect,
    onOpenConnect,
}) => {
    return (
        <div className="space-y-2.5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {isWon ? 'Confirmed Quotation' : 'Your Quotation Offer'}
                </h3>
                <span className="text-[11px] text-slate-400 font-normal">{requestId}</span>
            </div>

            {isWon && (
                <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-lg space-y-1 text-xs text-emerald-800 dark:text-emerald-200">
                    <div className="flex items-center gap-2 font-bold text-[12.5px] text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>🎉 Offer Accepted & Won</span>
                    </div>
                    <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/90 pl-5.5 font-normal leading-relaxed">
                        The customer has accepted your quotation offer. This shipment is confirmed and ready in your Active Jobs.
                    </p>
                </div>
            )}

            {!isWon && isExpired && (
                <div className="p-2.5 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 rounded-lg space-y-1 text-xs text-rose-700 dark:text-rose-300">
                    <div className="flex items-center gap-2 font-medium">
                        <Clock size={14} className="text-rose-600 shrink-0" />
                        <span>Quote Request Expired</span>
                    </div>
                    <p className="text-[11px] text-rose-600/90 dark:text-rose-400 pl-5 font-normal">
                        This transportation request has reached its deadline or has expired. New quotation submissions are closed.
                    </p>
                </div>
            )}

            {errorMessage && (
                <div className="p-2.5 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 rounded-lg flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                    <AlertTriangle size={14} className="text-rose-600 shrink-0" />
                    <span className="font-normal">{errorMessage}</span>
                </div>
            )}

            {!isWon && !isExpired && !isStripeConnected && !isCheckingConnect && (
                <div className="p-2 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-500/30 rounded-lg flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <AlertCircle size={13} className="text-amber-600 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 text-[11px] truncate">Payout account required to receive funds.</span>
                    </div>
                    <button
                        type="button"
                        onClick={onOpenConnect}
                        className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-[10.5px] font-medium rounded-[3px] transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                        Connect Stripe
                    </button>
                </div>
            )}
        </div>
    );
};
