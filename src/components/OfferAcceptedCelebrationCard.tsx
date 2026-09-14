import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Trophy, ArrowRight, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfferAcceptedCelebrationCardProps {
    role?: 'supplier' | 'customer';
    messageText?: string;
    time?: string;
    amount?: number | string;
    pickup?: string;
    delivery?: string;
    counterpartyName?: string;
    orderNumber?: string;
}

export const OfferAcceptedCelebrationCard: React.FC<OfferAcceptedCelebrationCardProps> = ({
    role = 'supplier',
    messageText,
    time,
    amount,
    pickup,
    delivery,
    counterpartyName,
    orderNumber,
}) => {
    const navigate = useNavigate();

    // Extract amount if not explicitly provided
    let displayAmount = amount;
    if (!displayAmount && messageText) {
        const match = messageText.match(/€\s*([\d,.]+)/) || messageText.match(/EUR\s*([\d,.]+)/i);
        if (match) displayAmount = match[1];
    }
    const formattedAmount = displayAmount
        ? (String(displayAmount).includes('€') ? String(displayAmount) : `€ ${typeof displayAmount === 'number' ? displayAmount.toLocaleString() : displayAmount}`)
        : '';

    const isSupplier = role === 'supplier';
    const targetUrl = isSupplier ? '/supplier/orders/active-jobs' : '/customer/orders';

    return (
        <div className="w-full flex justify-center my-4 px-2 animate-in fade-in zoom-in-95 duration-300">
            <div className="max-w-[380px] w-full rounded-lg p-4 sm:p-5 bg-gradient-to-b from-emerald-50/95 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden text-center space-y-3">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

                {/* Celebration Trophy Icon */}
                <div className="relative inline-flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                        <Trophy size={20} className="text-amber-200 animate-pulse" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-xs">
                        <CheckCircle2 size={15} className="text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    </div>
                </div>

                {/* Celebration Heading */}
                <div className="space-y-0.5">
                    <h3 className="text-[14.5px] sm:text-[15.5px] font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-1.5">
                        <span>🎉 Congratulations! Offer Accepted</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {isSupplier ? (
                            <>
                                {counterpartyName ? <strong className="text-slate-800 dark:text-slate-100">{counterpartyName}</strong> : 'The customer'} has confirmed this offer. The shipment is now an active order ready for dispatch.
                            </>
                        ) : (
                            <>
                                The rate with {counterpartyName ? <strong className="text-slate-800 dark:text-slate-100">{counterpartyName}</strong> : 'the carrier'} has been confirmed. Your order has been placed successfully.
                            </>
                        )}
                    </p>
                </div>

                {/* Route & Agreed Price Summary Box */}
                <div
    className="bg-white/90 dark:bg-slate-800/80 rounded-lg p-3 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 text-left">
                    {(pickup || delivery) && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            <MapPin size={13} className="text-[#FF4A1F] shrink-0" />
                            <span className="truncate">{pickup || 'Origin'} → {delivery || 'Destination'}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Agreed Rate</span>
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                            {formattedAmount || 'Confirmed'}
                        </span>
                    </div>
                    {orderNumber && (
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                            <span>Order Reference</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">#{orderNumber}</span>
                        </div>
                    )}
                </div>

                {/* Call-to-action Button */}
                <div className="pt-1 flex items-center justify-center">
                    <Button
                        type="button"
                        onClick={() => navigate(targetUrl)}
                        className="w-full h-9 rounded-[4px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                        <Truck size={14} />
                        <span>{isSupplier ? 'View Order in Active Jobs' : 'Track Shipment in My Orders'}</span>
                        <ArrowRight size={13} className="ml-0.5" />
                    </Button>
                </div>

                {/* Time footer */}
                {time && (
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        Confirmed • {time}
                    </div>
                )}
            </div>
        </div>
    );
};
