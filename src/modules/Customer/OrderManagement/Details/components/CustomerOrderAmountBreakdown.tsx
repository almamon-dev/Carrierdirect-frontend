import { CheckCircle2, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import React from 'react';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';

interface CustomerOrderAmountBreakdownProps {
    order: NormalizedCustomerOrder;
}

export const CustomerOrderAmountBreakdown: React.FC<CustomerOrderAmountBreakdownProps> = ({ order }) => {
    const { pricing } = order;

    return (
        <div className="bg-white dark:bg-[#1e2329] p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between h-full font-sans">
            <div>
                {/* Header */}
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2 mb-2.5 flex items-center justify-between">
                    <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <CreditCard size={14} className="text-[#ff4a1f]" />
                        <span>Freight Payment Breakdown</span>
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.25 rounded flex items-center gap-1">
                        <Lock size={9} /> Escrow Protected
                    </span>
                </div>

                {/* Pricing Line Items */}
                <div className="space-y-1.5 text-xs">
                    {/* Base Rate */}
                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Base Freight Transport</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            € {pricing.base.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    {/* Loading & Handling */}
                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Loading & Handling</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            € {pricing.loading.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    {/* CMR Insurance */}
                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                            <span>CMR Cargo Insurance</span>
                            <ShieldCheck size={12} className="text-emerald-600" />
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            € {pricing.insurance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    {/* Platform Fee 5% */}
                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Platform Fee (5%)</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {pricing.platformFeeFormatted}
                        </span>
                    </div>

                    {/* Advance Paid / Escrow Deposit */}
                    <div className="flex justify-between items-center min-h-[20px] bg-slate-50 dark:bg-slate-800/40 p-1 px-1.5 rounded">
                        <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1 text-[11px]">
                            <CheckCircle2 size={11} className="text-emerald-500" />
                            <span>Escrow Advance Deposit</span>
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11.5px]">
                            - {pricing.advanceFormatted}
                        </span>
                    </div>
                </div>
            </div>

            {/* Total / Balance Due Footer */}
            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Total Freight Gross</span>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                        {pricing.totalFormatted}
                    </span>
                </div>

                <div className="flex justify-between items-center bg-orange-50/60 dark:bg-orange-950/30 p-2 rounded-[4px] border border-orange-200/60 dark:border-orange-900/40">
                    <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-[11.5px] block">
                            Balance Due on POD
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {order.isPaid ? 'Fully settled & paid' : 'Released upon POD approval'}
                        </span>
                    </div>
                    <span className="font-extrabold text-[#ff4a1f] text-sm sm:text-[15px]">
                        {order.isPaid ? '€ 0.00' : pricing.dueFormatted}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderAmountBreakdown;
