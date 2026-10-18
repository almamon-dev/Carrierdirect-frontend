import React from 'react';
import { Lock, Building2 } from 'lucide-react';

export interface AcceptCheckoutPaymentMethodSelectorProps {
    paymentOption: "pay_now" | "pay_later";
    setPaymentOption: (opt: "pay_now" | "pay_later") => void;
    canUsePayLater: boolean;
    payLaterStatus: string;
    payLaterLimit: number;
    onLockedPayLaterClick?: () => void;
    onOpenLearnMore?: () => void;
}

export const AcceptCheckoutPaymentMethodSelector: React.FC<AcceptCheckoutPaymentMethodSelectorProps> = ({
    paymentOption,
    setPaymentOption,
    canUsePayLater,
    payLaterStatus,
    payLaterLimit,
    onLockedPayLaterClick,
    onOpenLearnMore,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Pay Now (Card) */}
            <div
                onClick={() => setPaymentOption("pay_now")}
                className={`border rounded-[4px] p-3.5 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentOption === "pay_now"
                        ? "border-[#ff4a1f]/60 bg-orange-50/20 dark:bg-orange-950/15 dark:border-[#ff4a1f]/40 shadow-2xs"
                        : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/30"
                }`}
            >
                <div className="mt-0.5 shrink-0">
                    <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            paymentOption === "pay_now"
                                ? "border-[#ff4a1f] bg-[#ff4a1f]"
                                : "border-slate-300 dark:border-slate-600"
                        }`}
                    >
                        {paymentOption === "pay_now" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            Credit / Debit Card
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                            Instant Hold
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Secure escrow payment via Visa, Mastercard, AMEX or Discover.
                    </p>
                </div>
            </div>

            {/* 2. Corporate Pay Later (Net-30) */}
            <div
                onClick={canUsePayLater ? () => setPaymentOption("pay_later") : onLockedPayLaterClick}
                className={`border rounded-[4px] p-3.5 cursor-pointer transition-all flex items-start gap-3 relative ${
                    !canUsePayLater
                        ? "border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/20 hover:border-purple-300 dark:hover:border-purple-700/60"
                        : paymentOption === "pay_later"
                            ? "border-[#ff4a1f]/60 bg-orange-50/20 dark:bg-orange-950/15 dark:border-[#ff4a1f]/40 shadow-2xs"
                            : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/30"
                }`}
            >
                <div className="mt-0.5 shrink-0">
                    {!canUsePayLater ? (
                        <div className="w-4 h-4 rounded-full border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Lock size={10} />
                        </div>
                    ) : (
                        <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                paymentOption === "pay_later"
                                    ? "border-[#ff4a1f] bg-[#ff4a1f]"
                                    : "border-slate-300 dark:border-slate-600"
                            }`}
                        >
                            {paymentOption === "pay_later" && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                            <Building2 size={13} className="text-slate-400" />
                            Corporate Net-30
                        </span>
                        {!canUsePayLater ? (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/50 flex items-center gap-1">
                                <Lock size={10} />
                                Growth Plan Required
                            </span>
                        ) : payLaterStatus === "approved" ? (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                                Approved
                            </span>
                        ) : (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
                                Review
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between gap-1.5 mt-1">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed truncate">
                            {!canUsePayLater
                                ? "Available on Growth Logistics & Enterprise plans."
                                : `€${payLaterLimit.toLocaleString()} available. Due in 30 days.`}
                        </p>
                        {onOpenLearnMore && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenLearnMore();
                                }}
                                className="text-[11px] font-bold text-[#ff4a1f] hover:underline shrink-0 cursor-pointer"
                            >
                                Learn more
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
