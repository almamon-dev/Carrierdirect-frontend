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
            <div className="bg-white dark:bg-[#1e2329] rounded-[3px] max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center space-y-4 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Checkmark Icon */}
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-4 border-emerald-50 dark:border-emerald-900/40 shadow-inner">
                    <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
                </div>

                {/* Title & Description */}
                <div>
                    <span className="inline-block bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold mb-1.5 px-2.5 py-0.5 rounded-[3px]">
                        {paymentMethod === "pay_later" ? "Net-30 Invoice Issued" : "Payment Held in Escrow"}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        Booking Confirmed!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                        Your shipment with <span className="font-bold text-slate-900 dark:text-slate-100">{quote.supplier}</span> has been confirmed and locked.
                    </p>
                </div>

                {/* Order Summary Receipt Box */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-[3px] border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Order Reference:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            {orderData?.order_number || "ORD-2026-1049"}
                        </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Invoice Number:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            {orderData?.invoice_number || "INV-2026-9871"}
                        </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Total Escrow Amount:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            €{quote.totalAmount.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Payment Terms:</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {paymentMethod === "pay_later" ? "Corporate Net-30 Invoice" : "Credit Card Escrow Hold"}
                        </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <span>Escrow Status:</span>
                        <span className="font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                            <ShieldCheck size={12} /> 100% Protected
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-9 text-xs font-semibold border-slate-300 dark:border-slate-700 rounded-[3px] hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-200 cursor-pointer"
                        onClick={() => navigate("/customer/finance/invoices")}
                    >
                        <FileText size={14} />
                        <span>View Invoices &amp; Receipts</span>
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        className="w-full h-9 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-xs flex items-center justify-center gap-1.5 rounded-[3px]"
                        onClick={() => navigate("/customer/orders")}
                    >
                        <span>Track Shipment in Orders</span>
                        <ArrowRight size={14} />
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
