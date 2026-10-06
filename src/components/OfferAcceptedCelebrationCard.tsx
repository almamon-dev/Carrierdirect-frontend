import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, Truck, ShieldCheck, Building2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { encryptId } from "@/lib/encryption";

interface OfferAcceptedCelebrationCardProps {
    role?: "supplier" | "customer";
    messageText?: string;
    time?: string;
    amount?: number | string;
    pickup?: string;
    delivery?: string;
    counterpartyName?: string;
    orderNumber?: string;
    orderId?: string | number;
    paymentMethod?: "pay_now" | "pay_later" | string;
    invoiceType?: string;
    isPaid?: boolean;
}

export const OfferAcceptedCelebrationCard: React.FC<OfferAcceptedCelebrationCardProps> = ({
    role = "supplier",
    messageText,
    time,
    amount,
    pickup,
    delivery,
    counterpartyName,
    orderNumber,
    orderId,
    paymentMethod,
    invoiceType,
    isPaid,
}) => {
    const navigate = useNavigate();
    const isSupplier = role === "supplier";

    let displayAmount = amount;
    if (!displayAmount && messageText) {
        const match = messageText.match(/€\s*([\d,.]+)/) || messageText.match(/EUR\s*([\d,.]+)/i);
        if (match) displayAmount = match[1];
    }
    const formattedAmount = displayAmount
        ? (String(displayAmount).includes("€") ? String(displayAmount) : ("€ " + (typeof displayAmount === "number" ? displayAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : displayAmount)))
        : "";

    const isPayLater = Boolean(
        invoiceType === "pay_later" ||
        paymentMethod === "pay_later" ||
        (messageText && messageText.toLowerCase().includes("pay later"))
    );

    const targetUrl = isSupplier
        ? "/supplier/orders/active-jobs"
        : (orderId ? `/customer/orders/${encryptId(orderId)}` : "/customer/orders");

    return (
        <div className="flex justify-center my-3 font-sans group relative items-center w-full px-1">
            <div className="relative w-full max-w-[390px] bg-white dark:bg-[#151c24] border border-emerald-200/90 dark:border-emerald-800/80 rounded-xl p-4 shadow-sm space-y-3 transition-all duration-300">
                {/* Header Row with Clean Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100/80 dark:border-emerald-900/40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 leading-tight">
                                {isPayLater ? "Booking Confirmed (Pay Later) 🏢" : "Payment Completed! 🎉"}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                {isSupplier ? "Ready for Pickup Dispatch" : "Booking Confirmed with Carrier"}
                            </p>
                        </div>
                    </div>
                    {time && (
                        <span className="text-[10px] text-slate-400 font-medium">
                            {time}
                        </span>
                    )}
                </div>

                {/* Body Message */}
                <div className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
                    {isSupplier ? (
                        isPayLater ? (
                            <p>
                                Customer <strong className="text-slate-900 dark:text-white">{counterpartyName || "Customer"}</strong> authorized booking under <strong>Net-30 Pay Later</strong>. Platform payout is 100% guaranteed upon POD upload.
                            </p>
                        ) : (
                            <p>
                                Customer <strong className="text-slate-900 dark:text-white">{counterpartyName || "Customer"}</strong> completed payment{formattedAmount ? <> (<strong className="text-emerald-600 dark:text-emerald-400">{formattedAmount}</strong>)</> : null}. Funds are held securely in Escrow.
                            </p>
                        )
                    ) : (
                        isPayLater ? (
                            <p>
                                Your booking is confirmed under your corporate Net-30 credit line. We will prepare for the pickup and keep you updated.
                            </p>
                        ) : (
                            <p>
                                We have received your payment{formattedAmount ? <> of <strong className="text-emerald-600 dark:text-emerald-400">{formattedAmount}</strong></> : null} and your booking is confirmed. We will prepare for the pickup and keep you updated.
                            </p>
                        )
                    )}
                </div>

                {/* Minimal Route & Order Reference */}
                {(pickup || delivery || orderNumber) && (
                    <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-lg px-2.5 py-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2 border border-slate-100 dark:border-slate-800">
                        {pickup && delivery ? (
                            <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                                {pickup} → {delivery}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                                <ShieldCheck size={12} />
                                <span>100% Escrow Protected</span>
                            </span>
                        )}
                        {orderNumber && (
                            <span className="font-mono text-[10.5px] font-bold text-slate-700 dark:text-slate-200 shrink-0">
                                #{orderNumber}
                            </span>
                        )}
                    </div>
                )}

                {/* Minimal Action Button */}
                <div className="pt-0.5">
                    <Button
                        type="button"
                        onClick={() => navigate(targetUrl)}
                        className="w-full h-8.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                        <Truck size={13} />
                        <span>{isSupplier ? "View Order in Active Jobs" : "Track Order"}</span>
                        <ArrowRight size={12} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
