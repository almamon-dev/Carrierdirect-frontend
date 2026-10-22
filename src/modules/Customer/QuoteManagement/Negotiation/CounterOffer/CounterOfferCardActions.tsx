import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2, Clock, Tag, Truck, XCircle, ArrowRight, Bell, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import apiClient from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import { ConfirmModal } from '@/components/modals';

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
    quoteId?: any;
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
    quoteId,
    onConfirmAccept,
    onOpenCounterOffer,
    onShowDeclineModal,
    onShowInstructionModal,
}) => {
    const navigate = useNavigate();
    const [isSendingReminder, setIsSendingReminder] = useState(false);
    const [isReleasing, setIsReleasing] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [showReleaseModal, setShowReleaseModal] = useState(false);

    const numericQuoteId = String(quoteId || orderId || '').replace(/[^0-9]/g, '');

    const executeSendReminder = async () => {
        if (!numericQuoteId) return;
        setIsSendingReminder(true);
        try {
            const res = await apiClient.post(`/supplier/quotes/${numericQuoteId}/send-reminder`);
            const msg = res.data?.message || 'Payment reminder sent to customer. You can send another reminder in 5 minutes.';
            toast({
                title: 'Reminder Sent',
                description: msg,
            });
            setShowReminderModal(false);
            window.dispatchEvent(new CustomEvent('carrierdirect_quote_updated'));
        } catch (err: any) {
            const errMsg = err?.response?.data?.message || 'Please wait 5 minutes between sending payment reminders.';
            toast({
                title: err?.response?.status === 429 ? 'Reminder Cooldown Active' : 'Unable to Send Reminder',
                description: errMsg,
                variant: 'destructive',
            });
        } finally {
            setIsSendingReminder(false);
        }
    };

    const executeReleaseAcceptance = async () => {
        if (!numericQuoteId) return;
        setIsReleasing(true);
        try {
            await apiClient.post(`/supplier/quotes/${numericQuoteId}/cancel-acceptance`);
            toast({
                title: 'Acceptance Released',
                description: 'Quote acceptance released. The quote is now back to open status.',
            });
            setShowReleaseModal(false);
            window.dispatchEvent(new CustomEvent('carrierdirect_quote_updated'));
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err?.response?.data?.message || 'Failed to release acceptance.',
                variant: 'destructive',
            });
        } finally {
            setIsReleasing(false);
        }
    };

    if (isAccepted) {
        if (!isOrderPaid) {
            return (
                <div className="space-y-2">
                    {/* Awaiting Payment Badge */}
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-bold text-xs py-2 px-3 rounded-[4px] flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>Offer Accepted • Awaiting Payment</span>
                        </div>
                        <span className="font-extrabold text-amber-900 dark:text-amber-200 text-xs">
                            {currency} {proposedPrice.toLocaleString()}
                        </span>
                    </div>

                    {!isSupplierSide ? (
                        <div className="space-y-1.5">
                            <Button
                                type="button"
                                size="sm"
                                className="w-full h-8 bg-[#FF6A00] hover:bg-[#e65f00] text-white text-xs font-bold rounded-[4px] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                                onClick={onShowInstructionModal}
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight size={13} />
                            </Button>
                            <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
                                Please complete payment to confirm your booking and dispatch carrier.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={isSendingReminder}
                                    onClick={() => setShowReminderModal(true)}
                                    className="flex-1 h-8 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-[4px] flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 shadow-2xs"
                                >
                                    <Bell size={13} className={isSendingReminder ? 'animate-spin' : ''} />
                                    <span>{isSendingReminder ? 'Sending...': 'Send Reminder'}</span>
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={isReleasing}
                                    onClick={() => setShowReleaseModal(true)}
                                    variant="outline"
                                    className="h-8 px-3 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 text-xs font-semibold rounded-[4px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                    <RotateCcw size={13} />
                                    <span>Release</span>
                                </Button>
                            </div>
                            <p className="text-[10.5px] text-center text-slate-500 dark:text-slate-400">
                                Awaiting customer payment. Slot auto-reverts to open if unpaid within 2 hours.
                            </p>
                        </div>
                    )}

                    {/* Confirmation Modals */}
                    <ConfirmModal
                        isOpen={showReminderModal}
                        onClose={() => setShowReminderModal(false)}
                        onConfirm={executeSendReminder}
                        isLoading={isSendingReminder}
                        title="Send Payment Reminder?"
                        description="Send a reminder notification and negotiation alert to the customer to complete payment for this quote?"
                        confirmText="Send Reminder"
                        cancelText="Cancel"
                        icon={<Bell size={20} className="text-amber-600 dark:text-amber-400" />}
                    />

                    <ConfirmModal
                        isOpen={showReleaseModal}
                        onClose={() => setShowReleaseModal(false)}
                        onConfirm={executeReleaseAcceptance}
                        isLoading={isReleasing}
                        isDestructive={true}
                        title="Release Quote Acceptance?"
                        description="Are you sure you want to release this quote acceptance? The pending booking will be cancelled and the quote will return to open status."
                        confirmText="Release Acceptance"
                        cancelText="Keep Reserved"
                        icon={<RotateCcw size={20} className="text-rose-600 dark:text-rose-400" />}
                    />
                </div>
            );
        }

        // When isOrderPaid is true (Booked & Paid)
        return (
            <div className="space-y-1.5">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs py-1.5 px-3 rounded-[4px] flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Offer Accepted & Booked ({currency} {proposedPrice.toLocaleString()})</span>
                </div>
                {!isSupplierSide && (
                    <Button
                        type="button"
                        size="sm"
                        className="w-full h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[4px] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                        onClick={() => {
                            if (orderId) {
                                navigate(`/customer/orders/${encryptId(orderId)}`);
                            } else {
                                navigate('/customer/orders');
                            }
                        }}
                    >
                        <Truck size={13} className="shrink-0" />
                        <span>Track Order</span>
                        <ArrowRight size={13} />
                    </Button>
                )}
            </div>
        );
    }

    if (isDeclined) {
        return (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 font-semibold text-xs py-1.5 px-3 rounded-[4px] flex items-center justify-center gap-1.5">
                <XCircle size={13} className="text-rose-600" />
                <span>Offer Declined {localReason ? `• ${localReason}` : ''}</span>
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
                        size="sm"
                        isLoading={isAccepting}
                        disabled={isAccepting}
                        onClick={onConfirmAccept}
                        className="flex-1 h-8 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        <Check size={13} />
                        <span>Accept Offer</span>
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                            if (onOpenCounterOffer) {
                                onOpenCounterOffer();
                            } else {
                                const btn = document.querySelector('button[title*="Revise"], button[title*="Counter"], button[title*="Propose"]') as HTMLButtonElement;
                                if (btn) btn.click();
                            }
                        }}
                        className="flex-1 h-8 rounded-[4px] bg-[#FF6A00] hover:bg-[#e65f00] text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                        {isSupplierSide ? 'Revise Offer' : 'Counter Offer'}
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
