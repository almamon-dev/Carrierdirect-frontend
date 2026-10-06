import React from 'react';
import { CheckCircle2, CreditCard, Lock, Clock } from 'lucide-react';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';
import { usePayLaterCountdown } from '../utils/usePayLaterCountdown';

interface CustomerOrderAmountBreakdownProps {
    order: NormalizedCustomerOrder;
}

export const CustomerOrderAmountBreakdown: React.FC<CustomerOrderAmountBreakdownProps> = ({ order }) => {
    const { pricing } = order;
    const countdown = usePayLaterCountdown(order.payLaterDueDate);

    return (
        <div className="bg-white dark:bg-[#1e2329] p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between h-full font-sans">
            <div>
                {/* Header */}
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2 mb-2.5 flex items-center justify-between">
                    <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <CreditCard size={14} className="text-[#ff4a1f]" />
                        <span>Payment Breakdown</span>
                    </p>
                    {order.isPayLater ? (
                        <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            <span>Pay Later (Net-30)</span>
                        </span>
                    ) : order.isPaid ? (
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.25 rounded flex items-center gap-1">
                            <CheckCircle2 size={10} /> Fully Settled
                        </span>
                    ) : (
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.25 rounded flex items-center gap-1">
                            <Lock size={9} /> Escrow Protected
                        </span>
                    )}
                </div>

                {/* Pricing Line Items */}
                <div className="space-y-1.5 text-xs">
                    {/* Base Freight Price */}
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Base Freight Price</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {pricing.baseFormatted}
                        </span>
                    </div>

                    {/* Extra Charges with Orange Bullet Dot */}
                    {pricing.extraCharges && pricing.extraCharges.length > 0 ? (
                        pricing.extraCharges.map((charge, idx) => (
                            <div key={charge.id || idx} className="flex items-center justify-between pl-2">
                                <span className="text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] shrink-0" />
                                    <span className="truncate">{charge.name}</span>
                                </span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    +€ {Number(charge.amount || 0).toLocaleString()}
                                </span>
                            </div>
                        ))
                    ) : null}

                    {/* Pay Later Terms Row if applicable */}
                    {order.isPayLater && (
                        <div className="flex items-center justify-between pl-2 pt-0.5 text-[11px] text-purple-700 dark:text-purple-400">
                            <span className="flex items-center gap-1.5">
                                <Clock size={11} className="shrink-0" />
                                <span>Due by {order.payLaterDueDate}</span>
                            </span>
                            <span className="font-mono font-bold">
                                {countdown.formatted}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Total / Balance Due Footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 mt-2 space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Total Quotation Amount</span>
                    <span className="text-[14px] font-black text-[#FF4A1F]">
                        {pricing.totalFormatted}
                    </span>
                </div>

                {/* Status / Balance sub-row */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-dashed border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                        {order.isPayLater ? 'Pay Later Balance' : 'Balance Due on POD'}
                    </span>
                    <span className={`font-bold ${order.isPaid ? 'text-emerald-600 dark:text-emerald-400' : order.isPayLater ? 'text-purple-700 dark:text-purple-400' : 'text-[#ff4a1f]'}`}>
                        {order.isPaid ? '€ 0.00' : pricing.dueFormatted}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderAmountBreakdown;
