import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, FileText } from "lucide-react";
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
    paymentMethod,
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#181f2a] rounded-2xl p-6 max-w-[320px] w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center font-sans animate-in fade-in zoom-in-95 duration-200 space-y-4">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                            <Check size={20} strokeWidth={3} />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
                        Booking Confirmed!
                    </h3>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Your booking with <span className="font-semibold text-slate-700 dark:text-slate-200">{quote.supplier}</span> is confirmed.{paymentMethod === "pay_later" ? " Net-30 invoice has been issued." : " Payment received successfully."}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 text-[12px] h-9 font-semibold rounded-lg border-slate-200 dark:border-slate-700"
                        onClick={() => navigate("/customer/finance/invoices")}
                    >
                        <FileText size={13} className="mr-1" />
                        Invoices
                    </Button>
                    <Button
                        type="button"
                        className="flex-1 text-[12px] h-9 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold rounded-lg flex items-center justify-center gap-1.5"
                        onClick={() => navigate("/customer/orders")}
                    >
                        Track Order
                        <ArrowRight size={13} />
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
