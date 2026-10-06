import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, FileText, Download, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/button";

interface AcceptCheckoutSuccessModalProps {
    isOpen: boolean;
    quote: {
        id: string;
        requestId?: string;
        supplier: string;
        pickupCity?: string;
        deliveryCity?: string;
        pickupDate?: string;
        totalAmount: number;
    };
    orderData?: {
        order_number?: string;
        invoice_number?: string;
        order_id?: number | string;
        invoice_id?: number | string;
    } | null;
    paymentMethod: "pay_now" | "pay_later";
}

export const AcceptCheckoutSuccessModal: React.FC<AcceptCheckoutSuccessModalProps> = ({
    isOpen,
    quote,
    orderData,
    paymentMethod,
}) => {
    const navigate = useNavigate();

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

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-fade-in">
            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] max-w-[390px] w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-5 text-center space-y-3.5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Checkmark Icon */}
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-4 border-emerald-50 dark:border-emerald-900/40 shadow-inner">
                    <CheckCircle2 size={26} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
                </div>

                {/* Title & Description */}
                <div>
                    <span className="inline-block bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10.5px] font-bold mb-1 px-2.5 py-0.5 rounded-[3px]">
                        {paymentMethod === "pay_later" ? "Net-30 Invoice Issued" : "Payment Held in Escrow"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        Booking Confirmed!
                    </h3>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                        Your shipment with <span className="font-bold text-slate-900 dark:text-slate-100">{quote.supplier}</span> has been confirmed and locked.
                    </p>
                </div>

                {/* Order Summary Receipt Box with Key-Value Alignment */}
                <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-[4px] border border-slate-200/80 dark:border-slate-700/60 text-left text-xs space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Order Reference:</span>
                        <span className="font-mono font-bold text-[11px] text-slate-900 dark:text-slate-100 truncate text-right">
                            {orderData?.order_number || "ORD-2026-1049"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Invoice Number:</span>
                        <span className="font-mono font-bold text-[11px] text-slate-900 dark:text-slate-100 truncate text-right">
                            {orderData?.invoice_number || "INV-2026-9871"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Total Escrow Amount:</span>
                        <span className="font-mono font-bold text-[11.5px] text-emerald-600 dark:text-emerald-400 text-right">
                            €{quote.totalAmount.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Payment Terms:</span>
                        <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 text-right">
                            {paymentMethod === "pay_later" ? "Corporate Net-30 Invoice" : "Credit Card Escrow Hold"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Escrow Status:</span>
                        <span className="font-semibold text-[11px] text-sky-600 dark:text-sky-400 flex items-center gap-1 text-right">
                            <ShieldCheck size={12} /> 100% Protected
                        </span>
                    </div>
                </div>

                {/* Actions in 2-Column Row */}
                <div className="pt-2 grid grid-cols-2 gap-2.5">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-9 px-2 text-xs font-semibold border-slate-300 dark:border-slate-700 rounded-[3px] hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors truncate"
                        onClick={() => navigate("/customer/finance/invoices")}
                    >
                        <FileText size={13} className="shrink-0" />
                        <span className="truncate">View Invoice</span>
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        className="h-9 px-2 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-xs flex items-center justify-center gap-1.5 rounded-[3px] truncate"
                        onClick={() => navigate("/customer/orders")}
                    >
                        <span className="truncate">Track Orders</span>
                        <ArrowRight size={13} className="shrink-0" />
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
