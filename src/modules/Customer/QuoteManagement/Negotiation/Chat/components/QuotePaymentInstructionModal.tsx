import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { X, CreditCard, ArrowRight, Eye, Loader2 } from "lucide-react";
import { encryptId } from "@/lib/encryption";

interface QuotePaymentInstructionModalProps {
    isOpen: boolean;
    onClose: () => void;
    quoteId?: string | number;
    quoteAmount?: number | string;
    supplierName?: string;
    quoteData?: any;
}

export const QuotePaymentInstructionModal: React.FC<QuotePaymentInstructionModalProps> = ({
    isOpen,
    onClose,
    quoteId,
    quoteAmount,
    supplierName,
    quoteData,
}) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isProcessing) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isProcessing, onClose]);

    if (!isOpen) return null;

    const rawId = quoteId || quoteData?.id || quoteData?.quote_id || quoteData?.quoteId || 1;
    const cleanQuoteId = String(rawId).replace(/[^0-9]/g, "") || rawId;

    const formattedQuoteNo =
        quoteData?.quoteNo ||
        (quoteId && String(quoteId).startsWith("QT-")
            ? quoteId
            : `QT-${String(cleanQuoteId).padStart(4, "0")}`);

    const displaySupplier =
        supplierName ||
        quoteData?.supplier ||
        quoteData?.carrier ||
        quoteData?.name ||
        quoteData?.company ||
        "Carrier Partner";

    const rawAmt = quoteAmount ?? quoteData?.total ?? quoteData?.amount ?? quoteData?.price;
    const formattedAmount = rawAmt
        ? (String(rawAmt).includes("€") ? String(rawAmt) : `€ ${Number(rawAmt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
        : "";

    const handleGoToPayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onClose();
            navigate(`/customer/quotes/received/checkout/${encryptId(cleanQuoteId)}`, {
                state: { quote: quoteData }
            });
        }, 500);
    };

    const handleViewDetails = () => {
        onClose();
        navigate(`/customer/quotes/received/view/${encryptId(cleanQuoteId)}`, {
            state: { quote: quoteData }
        });
    };

    return createPortal(
        <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-[410px] z-[999999] font-sans antialiased animate-in slide-in-from-top-5 fade-in duration-200">
            {/* Sleek & Compact Light Mode Banner Card */}
            <div className="relative w-full bg-white rounded-lg border border-slate-200/90 shadow-xl p-3 sm:p-3.5 text-left space-y-2.5">
                {/* Top Section: Icon + Description + Close */}
                <div className="flex items-start gap-2.5">
                    {/* Outline Circular Payment Icon */}
                    <div className="w-8 h-8 min-w-[32px] min-h-[32px] aspect-square rounded-full border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 bg-slate-50">
                        <CreditCard size={15} strokeWidth={2.2} className="text-[#ff4a1f] shrink-0" />
                    </div>

                    {/* Main Description Text */}
                    <div className="flex-1 min-w-0 pr-1">
                        <p className="text-[11.5px] sm:text-[12px] text-slate-700 leading-snug font-normal">
                            You have accepted the offer from <strong className="font-bold text-slate-900">{displaySupplier}</strong> for quote <strong className="font-semibold text-slate-900">{formattedQuoteNo}</strong>{formattedAmount ? <> ({formattedAmount})</> : null}. Please proceed to payment under <span className="text-[#ff4a1f] font-semibold hover:underline cursor-pointer" onClick={handleGoToPayment}>Escrow Terms</span>.
                        </p>
                    </div>

                    {/* Top Right Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="text-slate-400 hover:text-slate-600 rounded p-0.5 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer disabled:opacity-40"
                        aria-label="Close"
                    >
                        <X size={14} strokeWidth={2} />
                    </button>
                </div>

                {/* Bottom Action Buttons: Compact Equal Height Grid */}
                <div className="grid grid-cols-2 gap-2 pt-0.5 w-full">
                    <button
                        type="button"
                        onClick={handleViewDetails}
                        disabled={isProcessing}
                        className="w-full h-[26px] px-2 rounded-[4px] border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0 disabled:opacity-50"
                    >
                        <Eye size={11} className="text-slate-500 shrink-0" />
                        <span>View Details</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleGoToPayment}
                        disabled={isProcessing}
                        className="w-full h-[26px] px-2 rounded-[4px] border border-[#ff4a1f] bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0 disabled:opacity-80"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={11} className="animate-spin shrink-0" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <CreditCard size={11} className="shrink-0" />
                                <span>Proceed to Payment</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default QuotePaymentInstructionModal;
