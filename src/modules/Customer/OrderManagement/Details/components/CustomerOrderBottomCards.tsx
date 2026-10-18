import { CheckCircle2, CreditCard, FileText } from 'lucide-react';
import React from 'react';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';

interface Props {
    order: NormalizedCustomerOrder;
}

export const CustomerOrderBottomCards: React.FC<Props> = ({ order }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 font-sans items-stretch">
            {/* Card 4: Payment Breakdown */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5">
                            <CreditCard size={15} className="text-[#FF4A1F]" />
                            <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-slate-100">
                                Payment Breakdown
                            </h4>
                        </div>
                        {order.isPaid ? (
                            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                                <CheckCircle2 size={11} /> Fully Settled
                            </span>
                        ) : order.isPayLater ? (
                            <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded">
                                Pay Later
                            </span>
                        ) : (
                            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                                Escrow Protected
                            </span>
                        )}
                    </div>

                    <div className="space-y-1.5 text-xs pt-2">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span>Base Freight Price</span>
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                {order.pricing?.baseFormatted || '-'}
                            </span>
                        </div>

                        {order.pricing?.extraCharges && order.pricing.extraCharges.length > 0 && (
                            order.pricing.extraCharges.map((ch, idx) => (
                                <div key={ch.id || idx} className="flex items-center justify-between pl-3">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A1F] shrink-0" />
                                        <span>{ch.name}</span>
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                        {ch.amountFormatted}
                                    </span>
                                </div>
                            ))
                        )}

                        {order.pricing?.platformFee && order.pricing.platformFee > 0 ? (
                            <div className="flex items-center justify-between pl-3">
                                <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A1F] shrink-0" />
                                    <span>Platform Charge{order.pricing.platformFeePercent ? ` (${order.pricing.platformFeePercent}%)` : ''}</span>
                                </span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {order.pricing.platformFeeFormatted || `+€ ${order.pricing.platformFee.toLocaleString()}`}
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Total Quotation Amount</span>
                        <span className="text-sm font-black text-[#FF4A1F]">
                            {order.pricing?.totalFormatted || '-'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Balance Due on POD</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {order.pricing?.dueFormatted || '€ 0.00'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card 5: Additional Information */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <FileText size={15} className="text-[#FF4A1F]" />
                        <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-slate-100">
                            Additional Information
                        </h4>
                    </div>

                    <div className="grid grid-cols-[115px_10px_1fr] gap-y-1.5 text-xs pt-2">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Order Type</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{order.orderType || 'One Way'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Service Type</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{order.serviceType || (order.distance !== '-' ? `${order.distance} Direct Transit` : 'Express Direct')}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Pickup Date</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{order.pickup.date || '-'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Estimated Arrival</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{order.estArrival || '-'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Reference</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{order.reference || order.orderNumber || '-'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Special Instructions</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="text-slate-600 dark:text-slate-400 leading-snug">
                            {order.instructions || order.pickup.instructions || 'Report to Gate 3 loading dock upon arrival with gate pass.'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderBottomCards;
