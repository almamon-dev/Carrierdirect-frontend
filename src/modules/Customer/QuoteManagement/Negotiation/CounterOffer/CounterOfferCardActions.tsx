import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2, Clock, Tag, Truck, XCircle, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';

interface CounterOfferCardActionsProps {
    isAccepted: boolean;
    isOrderPaid: boolean;
    isDeclined: boolean;
    isSuperseded: boolean;
    canAccept: boolean;
    isSupplierSide: boolean;
    isAccepting: boolean;
    currency: string;
    proposedPrice: number;
    localReason: string;
    otherPartyName: string;
    orderId: any;
    onConfirmAccept: () => void;
    onOpenCounterOffer?: () => void;
    onShowDeclineModal: () => void;
    onShowInstructionModal: () => void;
}

export const CounterOfferCardActions: React.FC<CounterOfferCardActionsProps> = ({
    isAccepted,
    isOrderPaid,
    isDeclined,
    isSuperseded,
    canAccept,
    isSupplierSide,
    isAccepting,
    currency,
    proposedPrice,
    localReason,
    otherPartyName,
    orderId,
    onConfirmAccept,
    onOpenCounterOffer,
    onShowDeclineModal,
    onShowInstructionModal,
}) => {
    const navigate = useNavigate();

    if (isAccepted) {
        return (
            <div className="space-y-1.5">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs py-1.5 px-3 rounded-[4px] flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>{isOrderPaid ? `Offer Accepted & Booked (${currency} ${proposedPrice.toLocaleString()})` : `Offer Accepted (${currency} ${proposedPrice.toLocaleString()})`}</span>
                </div>
                {!isSupplierSide && (
                    isOrderPaid ? (
                        <Button
                            type="button"
                            size="sm"
                            className="w-full h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[4px] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                            onClick={() => {
                                if (orderId) {
                                    navigate(`/customer/orders/${encryptId(orderId)}`);
                                } else {
                                    navigate("/customer/orders");
                                }
                            }}
                        >
                            <Truck size={13} className="shrink-0" />
                            <span>Track Order</span>
                            <ArrowRight size={13} />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            size="sm"
                            className="w-full h-8 bg-[#FF6A00] hover:bg-[#e65f00] text-white text-xs font-bold rounded-[4px] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                            onClick={onShowInstructionModal}
                        >
                            <span>Proceed to Checkout</span>
                            <ArrowRight size={13} />
                        </Button>
                    )
                )}
            </div>
        );
    }

    if (isDeclined) {
        return (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 font-semibold text-xs py-1.5 px-3 rounded-[4px] flex items-center justify-center gap-1.5">
                <XCircle size={13} className="text-rose-600" />
                <span>Offer Declined {localReason ? `• ${localReason}` : ""}</span>
            </div>
        );
    }

    if (isSuperseded) {
        return (
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-[11px] font-medium py-1 px-2.5 rounded-[4px] flex items-center justify-center gap-1.5">
                <Tag size={12} className="text-slate-400" />
                <span>Superseded by newer offer</span>
            </div>
        );
    }

    if (canAccept) {
        return (
            <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        isLoading={isAccepting}
                        disabled={isAccepting}
                        onClick={onConfirmAccept}
                        className="flex-1 h-7.5 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 text-white text-[11.5px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-1 shadow-2xs disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        <Check size={12} />
                        <span>Accept Offer</span>
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            if (onOpenCounterOffer) {
                                onOpenCounterOffer();
                            } else {
                                const btn = document.querySelector('button[title*="Revise"], button[title*="Counter"], button[title*="Propose"]') as HTMLButtonElement;
                                if (btn) btn.click();
                            }
                        }}
                        className="flex-1 h-7.5 rounded-[4px] bg-[#FF6A00] hover:bg-[#e65f00] text-white text-[11.5px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-1 shadow-2xs"
                    >
                        {isSupplierSide ? "Revise Offer" : "Counter Offer"}
                    </Button>
                </div>
                <button
                    type="button"
                    onClick={onShowDeclineModal}
                    className="w-full text-center text-[10.5px] font-medium text-slate-400 hover:text-rose-600 py-0.5 transition-colors cursor-pointer"
                >
                    Decline this offer
                </button>
            </div>
        );
    }

    return (
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 rounded-[4px] px-2.5 py-1.5 text-center flex flex-col items-center justify-center gap-0.5 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
            <div className="flex items-center gap-1.5 font-bold">
                <Clock size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Waiting for {otherPartyName} Response</span>
            </div>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">
                {otherPartyName} has been notified. You will be updated once a response is received.
            </span>
        </div>
    );
};
