import React from 'react';
import { createPortal } from 'react-dom';
import { Eye, History, CheckCircle2, DollarSign, XCircle, Copy, Check, CreditCard } from 'lucide-react';

interface NegotiationActionsMenuProps {
    isOpen: boolean;
    dropdownPos: { top: number; left: number };
    copied: boolean;
    isAwaitingPayment?: boolean;
    canAccept: boolean;
    canCounter: boolean;
    canClose: boolean;
    onClose: () => void;
    onPayNow?: () => void;
    onViewNegotiation: () => void;
    onViewOfferHistory: () => void;
    onAcceptOffer?: () => void;
    onSendCounterOffer?: () => void;
    onCloseNegotiation?: () => void;
    onCopyId: () => void;
}

export const NegotiationActionsMenu: React.FC<NegotiationActionsMenuProps> = ({
    isOpen,
    dropdownPos,
    copied,
    isAwaitingPayment,
    canAccept,
    canCounter,
    canClose,
    onClose,
    onPayNow,
    onViewNegotiation,
    onViewOfferHistory,
    onAcceptOffer,
    onSendCounterOffer,
    onCloseNegotiation,
    onCopyId,
}) => {
    if (!isOpen) return null;

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />
            <div
                className="fixed w-52 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 1. Complete Payment — when awaiting payment */}
                {isAwaitingPayment && onPayNow && (
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2.5 transition-colors font-bold cursor-pointer"
                        onClick={onPayNow}
                    >
                        <CreditCard size={14} className="text-emerald-500 shrink-0" />
                        <span>Complete Payment</span>
                    </button>
                )}

                {/* 2. View Conversation */}
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={onViewNegotiation}
                >
                    <Eye size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                    <span>View Conversation</span>
                </button>

                {/* 3. View Offer History */}
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={onViewOfferHistory}
                >
                    <History size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                    <span>View Offer History</span>
                </button>

                {/* 4. Send Counter Offer — when it is the customer's turn */}
                {canCounter && onSendCounterOffer && (
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                        onClick={onSendCounterOffer}
                    >
                        <DollarSign size={14} className="text-[#ff4a1f] shrink-0" />
                        <span>Send Counter Offer</span>
                    </button>
                )}

                {/* 5. Accept Offer — when a valid offer is available */}
                {canAccept && onAcceptOffer && (
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/20 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                        onClick={onAcceptOffer}
                    >
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>Accept Offer</span>
                    </button>
                )}

                {/* 6. Decline Offer — when declining is permitted */}
                {canClose && onCloseNegotiation && (
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/20 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={onCloseNegotiation}
                    >
                        <XCircle size={14} className="text-rose-500 shrink-0" />
                        <span>Decline Offer</span>
                    </button>
                )}

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={onCopyId}
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-emerald-500 shrink-0" />
                            <span className="text-emerald-600 font-semibold">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} className="text-slate-400 shrink-0" />
                            <span>Copy ID</span>
                        </>
                    )}
                </button>
            </div>
        </>,
        document.body
    );
};
