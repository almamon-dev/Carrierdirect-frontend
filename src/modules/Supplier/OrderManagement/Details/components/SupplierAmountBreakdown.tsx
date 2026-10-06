import React from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, Clock, Check, Calendar } from 'lucide-react';

interface SupplierAmountBreakdownProps {
    pricing: {
        base: number;
        total: number;
        netPayout: number;
        paymentStatus: string;
        paymentStatusLabel: string;
        isPaid: boolean;
        isPayLater: boolean;
        isEscrow: boolean;
        escrowGuaranteed: boolean;
    };
}

export const SupplierAmountBreakdown: React.FC<SupplierAmountBreakdownProps> = ({ pricing }) => {
    const totalAmount = pricing?.total || 2500;
    const isPaid = pricing?.isPaid || false;
    const isPayLater = pricing?.isPayLater || false;
    const isEscrow = pricing?.isEscrow || (!isPaid && !isPayLater);

    return (
        <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between h-full font-sans">
            <div>
                {/* Header */}
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2.5 mb-3 flex items-center justify-between">
                    <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <CreditCard size={14} className="text-[#ff4a1f]" />
                        <span>Carrier Payout & Earnings</span>
                    </p>

                    {isPaid ? (
                        <span className="text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 size={11} /> Paid
                        </span>
                    ) : isPayLater ? (
                        <span className="text-[10.5px] font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Calendar size={11} /> Pay Later (Net-30)
                        </span>
                    ) : (
                        <span className="text-[10.5px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ShieldCheck size={11} /> In Escrow
                        </span>
                    )}
                </div>

                {/* Pricing Line Items */}
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Agreed Freight Charge</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            € {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                            <Check size={11} className="text-emerald-600" />
                            <span>Direct Haulage Transport</span>
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Included</span>
                    </div>

                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                            <Check size={11} className="text-emerald-600" />
                            <span>Standard Loading & Dock Handling</span>
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Included</span>
                    </div>

                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                            <Check size={11} className="text-emerald-600" />
                            <span>CMR Standard Cargo Protection</span>
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Included</span>
                    </div>
                </div>
            </div>

            {/* Total / Net Carrier Payout Footer */}
            <div className="pt-2.5 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="bg-emerald-50/80 dark:bg-emerald-950/30 p-2.5 rounded-[4px] border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-between gap-2">
                    <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block">
                            Net Carrier Payout
                        </span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-tight block mt-0.5">
                            {isPaid
                                ? 'Payment cleared • Funds transferred to your connected account'
                                : isPayLater
                                    ? 'Customer on Pay Later (Net-30) • Payout 100% platform-guaranteed on POD approval'
                                    : 'Deposit held in Escrow • Disbursed automatically on POD approval'}
                        </span>
                    </div>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base sm:text-lg shrink-0">
                        € {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SupplierAmountBreakdown;
