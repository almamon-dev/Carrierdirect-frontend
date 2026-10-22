import React from 'react';
import { Check, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Button from '@/components/ui/button';

interface QuoteBubbleActionButtonsProps {
    isAccepted: boolean;
    isDeclined: boolean;
    canAccept: boolean;
    totalQuotationAmount: number;
    isAccepting: boolean;
    onAccept: () => Promise<void>;
    onOpenDeclineModal: () => void;
}

export const QuoteBubbleActionButtons: React.FC<QuoteBubbleActionButtonsProps> = ({
    isAccepted,
    isDeclined,
    canAccept,
    totalQuotationAmount,
    isAccepting,
    onAccept,
    onOpenDeclineModal,
}) => {
    return (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {isAccepted ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs py-1.5 px-3 rounded-[4px] flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Offer Accepted (€ {totalQuotationAmount.toLocaleString()})</span>
                </div>
            ) : isDeclined ? (
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 font-semibold text-xs py-1.5 px-3 rounded-[4px] flex items-center justify-center gap-1.5">
                    <XCircle size={13} className="text-rose-600" />
                    <span>Offer Declined</span>
                </div>
            ) : canAccept ? (
                <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            disabled={isAccepting}
                            onClick={onAccept}
                            className="flex-1 h-8 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-75 disabled:cursor-not-allowed"
                            isLoading={isAccepting}
                        >
                            <Check size={13} />
                            <span>Accept Offer</span>
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                                const btn = document.querySelector(
                                    'button[title*="Revise"], button[title*="Counter"], button[title*="Propose"]'
                                ) as HTMLButtonElement;
                                if (btn) btn.click();
                            }}
                            className="flex-1 h-8 rounded-[4px] bg-[#FF6A00] hover:bg-[#e65f00] text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                            Revise Offer
                        </Button>
                    </div>
                    <button
                        type="button"
                        onClick={onOpenDeclineModal}
                        className="w-full text-center text-[10.5px] font-medium text-slate-400 hover:text-rose-600 py-0.5 transition-colors cursor-pointer"
                    >
                        Decline this request
                    </button>
                </div>
            ) : (
                <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 rounded-[4px] px-2.5 py-1.5 text-center flex items-center justify-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                    <Clock size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Waiting for Customer Response</span>
                </div>
            )}
        </div>
    );
};
