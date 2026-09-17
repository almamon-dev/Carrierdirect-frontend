import Modal from "@/components/modals/modal";
import Button from "@/components/ui/button";
import { encryptId } from "@/lib/encryption";
import { ArrowRight, Check, CheckCircle2, Eye, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface QuotePaymentInstructionModalProps {
    isOpen: boolean;
    onClose: () => void;
    quoteId?: string | number;
    quoteAmount?: number;
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
        "Supplier Co 1";

    const handleGoToPayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onClose();
            navigate(`/customer/quotes/received/checkout/${encryptId(cleanQuoteId)}`, {
                state: { quote: quoteData }
            });
        }, 1200);
    };

    const handleViewDetails = () => {
        onClose();
        navigate(`/customer/quotes/received/view/${encryptId(cleanQuoteId)}`, {
            state: { quote: quoteData }
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[13.5px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            Offer Accepted
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5">
                            Your quote has been confirmed
                        </p>
                    </div>
                </div>
            }
            size="sm"
            showCloseButton={true}
            closeOnOutsideClick={true}
        >
            <div className="flex flex-col items-center text-center py-1">
                {/* Success Icon */}
                <div className="relative flex justify-center mb-5">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Check size={26} strokeWidth={3} />
                        </div>
                    </div>
                </div>

                {/* Body Text */}
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-1 px-2">
                    You have accepted the quote from{" "}
                    <strong className="text-slate-900 dark:text-white font-semibold">
                        {displaySupplier}
                    </strong>.
                </p>

                {/* Subtext */}
                <p className="text-[12px] text-slate-400 dark:text-slate-500 leading-relaxed mb-5">
                    Please proceed to payment to confirm your booking.
                </p>

                {/* Action Buttons — side by side */}
                <div className="flex items-center gap-2.5 w-full">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleViewDetails}
                        disabled={isProcessing}
                        className="flex-1 h-[38px] rounded-[4px] bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 text-[12.5px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                        <Eye size={14} />
                        View Details
                    </Button>

                    <Button
                        type="button"
                        onClick={handleGoToPayment}
                        disabled={isProcessing}
                        className="flex-1 h-[38px] rounded-[4px] bg-[#FF4A1F] hover:bg-[#e03e15] text-white text-[12.5px] font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-80"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Go to Payment
                                <ArrowRight size={14} />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
