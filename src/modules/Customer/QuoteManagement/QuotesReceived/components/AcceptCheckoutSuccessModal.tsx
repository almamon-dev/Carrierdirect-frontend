import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, FileText, Truck, ShieldCheck, Building2 } from "lucide-react";
import Button from "@/components/ui/button";

interface AcceptCheckoutSuccessModalProps {
    isOpen: boolean;
    quote: {
        id: string;
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

    const orderNumber = orderData?.order_number || "ORD-" + quote.id.replace(/[^0-9]/g, "");
    const invoiceNumber = orderData?.invoice_number || "INV-" + (quote.id.replace(/[^0-9]/g, "") || "202545");

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1e2329] rounded-xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-5 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={36} className="stroke-[2.2]" />
                </div>

                <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Booking Successfully Confirmed!
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Carrier booking with <span className="font-bold text-slate-800 dark:text-slate-200">{quote.supplier}</span> has been confirmed and driver assignment is initiated.
                    </p>
                </div>

                {/* Key References Card */}
                <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                            Order Reference:
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                            <Truck size={14} className="text-[#ff4a1f]" />
                            <span className="font-mono">{orderNumber}</span>
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                            Tax Invoice:
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                            <FileText size={14} className="text-emerald-600" />
                            <span className="font-mono">{invoiceNumber}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Badge & Summary */}
                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/80 dark:border-emerald-900/40 text-left text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Payment Mode:</span>
                        {paymentMethod === "pay_later" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                                <Building2 size={12} /> Net-30 Corporate Credit
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                                <ShieldCheck size={12} /> Escrow Secured
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-emerald-200/50 dark:border-emerald-900/40">
                        <span className="font-bold text-slate-900 dark:text-slate-100">Total Authorized:</span>
                        <span className="text-sm font-extrabold text-[#ff4a1f]">€{quote.totalAmount.toLocaleString()}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-1/2 text-xs h-10 font-bold rounded-[5px] border-slate-200 dark:border-slate-700"
                        onClick={() => navigate("/customer/invoices")}
                    >
                        <FileText size={14} className="mr-1 text-slate-500" />
                        <span>View Invoices</span>
                    </Button>
                    <Button
                        type="button"
                        className="w-full sm:w-1/2 text-xs h-10 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold rounded-[5px] shadow-sm flex items-center justify-center gap-1.5"
                        onClick={() => navigate("/customer/orders")}
                    >
                        <span>Track Live Orders</span>
                        <ArrowRight size={14} />
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
