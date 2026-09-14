import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
    ShieldCheck,
    CreditCard,
    Truck,
    ArrowRight,
    X,
    Clock,
    BookOpen,
} from "lucide-react";
import { encryptId } from "@/lib/encryption";

interface QuotePaymentInstructionModalProps {
    isOpen: boolean;
    onClose: () => void;
    quoteId: string | number;
    quoteAmount?: number | string;
    supplierName?: string;
    routeText?: string;
    quoteData?: any;
}

export const QuotePaymentInstructionModal: React.FC<QuotePaymentInstructionModalProps> = ({
    isOpen,
    onClose,
    quoteId,
    quoteAmount = 45000,
    supplierName = "Carrier Partner",
    quoteData,
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const formattedAmount =
        typeof quoteAmount === "number"
            ? `€ ${quoteAmount.toLocaleString()}`
            : String(quoteAmount).startsWith("€")
                ? quoteAmount
                : `€ ${quoteAmount}`;

    // Clean formatting for quote code without duplicating QT- prefix
    let quoteCode = "QT-0001";
    const rawVal = quoteData?.quote_id || quoteData?.id || quoteId;
    if (rawVal) {
        const strVal = String(rawVal).trim();
        if (strVal.startsWith("QT-")) {
            quoteCode = strVal;
        } else {
            quoteCode = `QT-${strVal.padStart(4, "0")}`;
        }
    }

    const handleProceedToCheckout = () => {
        onClose();
        navigate(`/customer/checkout/${encryptId(quoteId)}`, {
            state: { quote: quoteData }
        });
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 p-4 font-sans backdrop-blur-xs transition-opacity duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-sm shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col relative font-sans animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header (Document Import Header Style) */}
                <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-white dark:bg-slate-900 font-sans">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 tracking-tight">
                            Booking & Payment Authorization
                        </h3>
                        <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {quoteCode} · {supplierName}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 w-7 h-7 rounded-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-5 max-h-[72vh] overflow-y-auto space-y-4 font-sans w-full">
                    {/* Header Title Section */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                            <BookOpen size={15} className="text-[#ff4a1f]" />
                            <span>Payment & Dispatch Guidelines</span>
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            Follow the 3 preparation steps below to complete payment authorization and initiate shipment dispatch.
                        </p>
                    </div>

                    {/* Rate & Status Summary Card */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-sm border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                        <div>
                            <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mb-0.5">
                                Agreed Carrier: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{supplierName}</strong>
                            </span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Rate:</span>
                                <span className="text-base font-medium text-[#ff4a1f]">{formattedAmount}</span>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shrink-0">
                            <Clock size={12} className="shrink-0" />
                            <span>Authorization Required</span>
                        </span>
                    </div>

                    {/* 3-Point Connected Step List */}
                    <div className="space-y-4 relative pl-0.5 py-1">
                        {/* Point 1 */}
                        <div className="flex items-start gap-3 relative">
                            <div className="absolute left-[11.5px] top-6 bottom-[-20px] w-[1px] bg-slate-200 dark:bg-slate-700" />
                            <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-900 dark:text-slate-100 shrink-0 z-10 shadow-2xs">
                                1
                            </div>
                            <div className="space-y-0.5 flex-1 text-left">
                                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    <CreditCard size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span>Select Payment Term (Pay Now Escrow vs Net-30 Pay Later)</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Pay instantly with Credit/Debit card via Escrow protection, or use your approved <strong className="text-slate-700 dark:text-slate-300">Net-30 Corporate Credit line</strong> with €0 charge today.
                                </p>
                            </div>
                        </div>

                        {/* Point 2 */}
                        <div className="flex items-start gap-3 relative">
                            <div className="absolute left-[11.5px] top-6 bottom-[-20px] w-[1px] bg-slate-200 dark:bg-slate-700" />
                            <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-900 dark:text-slate-100 shrink-0 z-10 shadow-2xs">
                                2
                            </div>
                            <div className="space-y-0.5 flex-1 text-left">
                                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    <Truck size={14} className="text-[#ff4a1f] shrink-0" />
                                    <span>Automatic Driver Dispatch & Live Order Tracking</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Once payment or Net-30 credit is authorized, the order status changes to <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">In Progress</code> and the carrier assigns driver and vehicle.
                                </p>
                            </div>
                        </div>

                        {/* Point 3 */}
                        <div className="flex items-start gap-3 relative">
                            <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-900 dark:text-slate-100 shrink-0 z-10 shadow-2xs">
                                3
                            </div>
                            <div className="space-y-0.5 flex-1 text-left">
                                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                                    <span>Escrow Protection Until POD Confirmation</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Your funds are locked safely in Escrow and are only released to the carrier after you inspect delivery and approve the Proof of Delivery (POD).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer (Document Import Footer Style) */}
                <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-sans">
                    <div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:underline cursor-pointer"
                        >
                            Skip for now
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="h-8 min-w-[75px] px-3.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 rounded-[4px] inline-flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="h-8 min-w-[145px] px-4 text-xs font-medium text-white bg-[#FF4A1F] hover:bg-[#e03e15] rounded-[4px] inline-flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                            onClick={handleProceedToCheckout}
                        >
                            <span>Proceed to Checkout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
