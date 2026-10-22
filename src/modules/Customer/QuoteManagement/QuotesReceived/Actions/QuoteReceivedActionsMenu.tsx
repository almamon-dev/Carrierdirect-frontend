import React from 'react';
import { createPortal } from 'react-dom';
import { Eye, Layers, FileText, MessageSquare, CheckCircle, Loader2, XCircle, TrendingDown, PackageCheck, FileDown, CreditCard } from 'lucide-react';

interface QuoteReceivedActionsMenuProps {
    isOpen: boolean;
    dropdownPos: { top: number; left: number };
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    isPending: boolean;
    isNegotiating: boolean;
    isAwaitingPayment?: boolean;
    canNegotiate?: boolean;
    canCounter?: boolean;
    canAccept?: boolean;
    canDecline?: boolean;
    isAccepting?: boolean;
    hasOrder?: boolean;
    hasRequest?: boolean;
    hasPdf?: boolean;
    pdfUrl?: string;
    onViewQuote?: () => void;
    onCompareQuotes?: () => void;
    onViewDetails?: () => void;
    onViewRequest?: () => void;
    onOpenChat: () => void;
    onCounterOffer?: () => void;
    onAccept: () => void;
    onReject: () => void;
    onViewOrder?: () => void;
    onDownloadPdf?: () => void;
    onClose: () => void;
}

export const QuoteReceivedActionsMenu: React.FC<QuoteReceivedActionsMenuProps> = ({
    isOpen,
    dropdownPos,
    dropdownRef,
    isPending,
    isNegotiating,
    isAwaitingPayment,
    canNegotiate = true,
    canCounter = true,
    canAccept = true,
    canDecline = true,
    isAccepting,
    hasOrder,
    hasRequest,
    hasPdf,
    pdfUrl,
    onViewQuote,
    onCompareQuotes,
    onViewDetails,
    onViewRequest,
    onOpenChat,
    onCounterOffer,
    onAccept,
    onReject,
    onViewOrder,
    onDownloadPdf,
    onClose,
}) => {
    if (!isOpen) return null;

    const handleViewQuoteAction = onViewQuote || onViewDetails || (() => {});

    return createPortal(
        <div
            ref={dropdownRef}
            className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-[5px] shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* 1. View Quote */}
            <button
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                onClick={() => {
                    onClose();
                    handleViewQuoteAction();
                }}
            >
                <Eye size={14} className="text-slate-400 shrink-0" />
                <span>View Quote</span>
            </button>

            {/* 1.1 Compare All Carrier Quotes — only when handler is provided */}
            {onCompareQuotes && (
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                    onClick={() => {
                        onClose();
                        onCompareQuotes();
                    }}
                >
                    <Layers size={14} className="text-[#ff4a1f] shrink-0" />
                    <span>Compare All Quotes</span>
                </button>
            )}

            {/* 2. View Request */}
            {hasRequest && onViewRequest && (
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={() => {
                        onClose();
                        onViewRequest();
                    }}
                >
                    <FileText size={14} className="text-slate-400 shrink-0" />
                    <span>View Request</span>
                </button>
            )}

            {/* 3. Chat / Negotiate — when negotiation is allowed */}
            {canNegotiate && (
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={() => {
                        onClose();
                        onOpenChat();
                    }}
                >
                    <MessageSquare size={14} className="text-indigo-500 shrink-0" />
                    <span>Chat / Negotiate</span>
                </button>
            )}

            {/* 4. Send Counter Offer — when permitted */}
            {canCounter && onCounterOffer && (
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                    onClick={() => {
                        onClose();
                        onCounterOffer();
                    }}
                >
                    <TrendingDown size={14} className="text-[#ff4a1f] shrink-0" />
                    <span>Send Counter Offer</span>
                </button>
            )}

            {/* 4.1 Complete Payment — when quote is accepted but awaiting payment */}
            {isAwaitingPayment && (
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2.5 transition-colors font-bold cursor-pointer"
                    onClick={() => {
                        onClose();
                        onAccept();
                    }}
                >
                    <CreditCard size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Complete Payment</span>
                </button>
            )}

            {/* 5. Accept & Book — only when the quote is pending/negotiating and not yet accepted */}
            {canAccept && !isAwaitingPayment && (
                <button
                    type="button"
                    disabled={isAccepting}
                    className="w-full text-left px-3.5 py-2 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2.5 transition-colors font-bold cursor-pointer disabled:opacity-50"
                    onClick={() => {
                        onClose();
                        onAccept();
                    }}
                >
                    {isAccepting ? (
                        <Loader2 size={14} className="animate-spin text-emerald-600 shrink-0" />
                    ) : (
                        <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    <span>Accept & Book</span>
                </button>
            )}

            {/* 6. Decline Offer — only when declining is permitted and not already accepted */}
            {canDecline && !isAwaitingPayment && (
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={() => {
                        onClose();
                        onReject();
                    }}
                >
                    <XCircle size={14} className="text-rose-500 shrink-0" />
                    <span>Decline Offer</span>
                </button>
            )}

            {/* 7. View Order — only when a valid booking or order exists */}
            {hasOrder && onViewOrder && (
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                    onClick={() => {
                        onClose();
                        onViewOrder();
                    }}
                >
                    <PackageCheck size={14} className="text-blue-500 shrink-0" />
                    <span>View Order</span>
                </button>
            )}

            {/* 8. Download PDF — when available */}
            {hasPdf && (
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={() => {
                        onClose();
                        if (onDownloadPdf) onDownloadPdf();
                        else if (pdfUrl) window.open(pdfUrl, '_blank');
                    }}
                >
                    <FileDown size={14} className="text-slate-400 shrink-0" />
                    <span>Download PDF</span>
                </button>
            )}
        </div>,
        document.body
    );
};
