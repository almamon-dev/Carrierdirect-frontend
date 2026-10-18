import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    TrendingUp,
    HelpCircle,
    ArrowRight,
    AlertCircle,
    CreditCard,
} from 'lucide-react';
import { CorporateNet30DrawerModal } from './CorporateNet30DrawerModal';

export interface AcceptCheckoutPayLaterTermsProps {
    payLaterLimit: number;
    totalAmount: number;
    payLaterStatus?: string;
    canUsePayLater?: boolean;
    onRequestCredit?: () => void;
    onLockedPayLaterClick?: () => void;
}

export const AcceptCheckoutPayLaterTerms: React.FC<AcceptCheckoutPayLaterTermsProps> = ({
    payLaterLimit,
    totalAmount,
    payLaterStatus = 'inactive',
    canUsePayLater = true,
    onRequestCredit,
    onLockedPayLaterClick,
}) => {
    const navigate = useNavigate();
    const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

    const isZeroCredit = payLaterLimit <= 0;
    const isUnderReview = payLaterStatus === 'pending' || payLaterStatus === 'under_review';
    const isSuspended = payLaterStatus === 'suspended';

    const handleApplyOrIncreaseClick = () => {
        if (!canUsePayLater && onLockedPayLaterClick) {
            onLockedPayLaterClick();
            return;
        }
        if (onRequestCredit) {
            onRequestCredit();
        } else {
            navigate('/customer/finance/pay-later');
        }
    };

    if (payLaterLimit < totalAmount) {
        return (
            <>
                <div className="p-4 bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 rounded-[3px] text-xs space-y-3 font-sans">
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-xs text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                            Insufficient Available Credit
                        </span>
                        <div className="flex items-center gap-1.5">
                            {isUnderReview && (
                                <span className="text-[10.5px] font-semibold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 rounded-[3px] border border-amber-200/60 dark:border-amber-800/50 flex items-center gap-1">
                                    <Clock size={11} /> Application Under Review
                                </span>
                            )}
                            {isSuspended && (
                                <span className="text-[10.5px] font-semibold px-2 py-0.5 bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 rounded-[3px] border border-rose-300 flex items-center gap-1">
                                    <AlertCircle size={11} /> Facility Suspended
                                </span>
                            )}
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 rounded-[3px]">
                                Available: €{payLaterLimit.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Explanatory text */}
                    <p className="text-[11.5px] text-rose-700 dark:text-rose-400 leading-relaxed">
                        Your remaining credit limit of <strong className="font-bold">€{payLaterLimit.toLocaleString()}</strong> is less than the booking amount (<strong className="font-bold">€{totalAmount.toLocaleString()}</strong>). {isZeroCredit ? "You can apply for a corporate credit line to activate Net-30 payment terms, or switch to Card payment." : "Please request a credit limit increase, settle outstanding invoices, or switch to Card payment."}
                    </p>

                    {/* Action buttons row: Learn More & Request Credit */}
                    <div className="pt-2 flex items-center gap-2 flex-wrap border-t border-rose-200/60 dark:border-rose-900/40">
                        <button
                            type="button"
                            onClick={handleApplyOrIncreaseClick}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff4a1f] hover:bg-[#e03d15] text-white font-bold text-[11px] rounded-[3px] shadow-2xs transition-all cursor-pointer"
                        >
                            <TrendingUp size={12} />
                            <span>
                                {!canUsePayLater
                                    ? "Unlock Credit (Upgrade Plan)"
                                    : isZeroCredit
                                        ? "Apply for Credit Line"
                                        : "Request Credit Increase"}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsLearnMoreOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[11px] rounded-[3px] border border-slate-300/80 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
                        >
                            <HelpCircle size={12} className="text-[#ff4a1f]" />
                            <span>Learn More</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/customer/finance/pay-later')}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-300 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors cursor-pointer ml-auto"
                        >
                            <span>Credit Facility Hub</span>
                            <ArrowRight size={11} />
                        </button>
                    </div>
                </div>

                {/* Corporate Net-30 Slide-over Drawer Modal */}
                <CorporateNet30DrawerModal
                    isOpen={isLearnMoreOpen}
                    onClose={() => setIsLearnMoreOpen(false)}
                    onApplyCreditLine={handleApplyOrIncreaseClick}
                    actionButtonText={
                        !canUsePayLater
                            ? "Upgrade Plan"
                            : isZeroCredit
                                ? "Apply for Credit Line"
                                : "Request Credit Increase"
                    }
                />
            </>
        );
    }

    return (
        <>
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-[3px] text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Corporate Net-30 Terms Active
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 rounded-[3px]">
                        Available: €{payLaterLimit.toLocaleString()}
                    </span>
                </div>
                <p className="text-[11.5px] text-emerald-800 dark:text-emerald-400 leading-relaxed">
                    Booking will be confirmed immediately without upfront card charge. A corporate tax invoice for <strong className="font-bold">€{totalAmount.toLocaleString()}</strong> will be issued to your accounts payable department, due in 30 days.
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-emerald-200/60 dark:border-emerald-900/40">
                    <button
                        type="button"
                        onClick={() => setIsLearnMoreOpen(true)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors cursor-pointer"
                    >
                        <HelpCircle size={12} className="text-[#ff4a1f]" />
                        <span>Learn more about Net-30</span>
                    </button>



                    <button
                        type="button"
                        onClick={() => navigate('/customer/finance/pay-later')}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors cursor-pointer"
                    >
                        <span>Credit Hub</span>
                        <ArrowRight size={11} />
                    </button>
                </div>
            </div>

            <CorporateNet30DrawerModal
                isOpen={isLearnMoreOpen}
                onClose={() => setIsLearnMoreOpen(false)}
                onApplyCreditLine={handleApplyOrIncreaseClick}
                actionButtonText="Credit Facility Hub"
            />
        </>
    );
};
