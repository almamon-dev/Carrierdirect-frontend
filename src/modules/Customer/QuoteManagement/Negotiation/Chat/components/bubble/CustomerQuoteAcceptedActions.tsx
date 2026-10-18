import React from "react";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    ArrowRight,
    CreditCard,
    Eye,
    Truck,
    HelpCircle,
    Building2,
    ShieldCheck,
    FileText,
} from "lucide-react";
import Button from "@/components/ui/button";
import { encryptId } from "@/lib/encryption";
import { CustomerChatMessage, CustomerChatItem } from "../../types";
import { QuotePaymentInstructionModal } from "../QuotePaymentInstructionModal";

interface CustomerQuoteAcceptedActionsProps {
    targetQuoteId: any;
    orderId: any;
    isOrderPaid: boolean;
    isPayLater: boolean;
    showInstructionModal: boolean;
    setShowInstructionModal: (val: boolean) => void;
    msg: CustomerChatMessage;
    activeChat?: CustomerChatItem | null;
}

export const CustomerQuoteAcceptedActions: React.FC<CustomerQuoteAcceptedActionsProps> = ({
    targetQuoteId,
    orderId,
    isOrderPaid,
    isPayLater,
    showInstructionModal,
    setShowInstructionModal,
    msg,
    activeChat,
}) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-1.5 pt-1 font-sans">
            {/* Top Row */}
            <div className="flex items-center gap-2">
                {isOrderPaid ? (
                    isPayLater ? (
                        <div className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 rounded-[5px] text-xs font-semibold">
                            <Building2 size={13.5} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span>Pay Later (Net-30)</span>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 rounded-[5px] text-xs font-semibold">
                            <ShieldCheck size={13.5} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Paid (In Escrow)</span>
                        </div>
                    )
                ) : (
                    <div className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 rounded-[5px] text-xs font-semibold">
                        <CheckCircle2 size={13.5} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Accepted</span>
                    </div>
                )}

                {isOrderPaid ? (
                    <Button
                        type="button"
                        onClick={() => {
                            if (orderId) {
                                navigate("/customer/orders/" + encryptId(orderId));
                            } else {
                                navigate("/customer/orders");
                            }
                        }}
                        className="flex-1 h-8 rounded-[5px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
                    >
                        <Truck size={13} className="shrink-0" />
                        <span>Track Order</span>
                        <ArrowRight size={12} className="shrink-0" />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={() => setShowInstructionModal(true)}
                        className="flex-1 h-8 rounded-[5px] bg-[#FF4A1F] hover:bg-[#e03e15] text-white text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
                    >
                        <CreditCard size={13} className="shrink-0" />
                        <span>Checkout & Pay</span>
                        <ArrowRight size={12} className="shrink-0" />
                    </Button>
                )}
            </div>

            {/* Bottom Row Links */}
            <div className="flex items-center justify-center gap-3 pt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <button
                    type="button"
                    onClick={() => navigate("/customer/quotes/received/view/" + encryptId(targetQuoteId))}
                    className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] transition-colors cursor-pointer"
                >
                    <Eye size={12} />
                    <span className="underline-offset-2 hover:underline">Details</span>
                </button>

                <span className="text-slate-300 dark:text-slate-700">•</span>

                <button
                    type="button"
                    onClick={() => {
                        if (orderId) {
                            navigate("/customer/orders/" + encryptId(orderId));
                        } else {
                            navigate("/customer/orders");
                        }
                    }}
                    className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] transition-colors cursor-pointer"
                >
                    <Truck size={12} />
                    <span className="underline-offset-2 hover:underline">Track Order</span>
                </button>

                {isOrderPaid ? (
                    <>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <button
                            type="button"
                            onClick={() => navigate("/customer/invoices")}
                            className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] transition-colors cursor-pointer"
                        >
                            <FileText size={12} />
                            <span className="underline-offset-2 hover:underline">Invoice</span>
                        </button>
                    </>
                ) : (
                    <>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <button
                            type="button"
                            onClick={() => setShowInstructionModal(true)}
                            className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] transition-colors cursor-pointer"
                        >
                            <HelpCircle size={12} />
                            <span className="underline-offset-2 hover:underline">Payment Info</span>
                        </button>
                    </>
                )}
            </div>

            {/* Instruction Modal */}
            {!isOrderPaid && (
                <QuotePaymentInstructionModal
                    isOpen={showInstructionModal}
                    onClose={() => setShowInstructionModal(false)}
                    quoteId={targetQuoteId}
                    quoteAmount={msg.newTotal || (msg as any).amount || 45000}
                    supplierName={activeChat?.carrier || activeChat?.name || '-'}
                    quoteData={{
                        ...(activeChat?.raw || {}),
                        ...(activeChat || {}),
                        id: targetQuoteId,
                        quote_id: targetQuoteId,
                        amount: activeChat?.currentPrice || activeChat?.raw?.amount,
                        amount_raw: activeChat?.currentPrice || activeChat?.raw?.amount_raw || activeChat?.raw?.amount,
                        total_amount: activeChat?.currentPrice || activeChat?.raw?.total_amount || activeChat?.raw?.amount,
                        total_price: activeChat?.currentPrice || activeChat?.raw?.total_price || activeChat?.raw?.amount,
                        totalAmount: activeChat?.currentPrice || activeChat?.raw?.totalAmount || activeChat?.raw?.amount,
                        base_amount: activeChat?.baseFreightAmount || activeChat?.raw?.base_amount_raw || activeChat?.raw?.base_amount,
                        base_amount_raw: activeChat?.baseFreightAmount || activeChat?.raw?.base_amount_raw,
                        baseFreightAmount: activeChat?.baseFreightAmount || activeChat?.raw?.base_amount_raw,
                        baseFreight: activeChat?.baseFreightAmount || activeChat?.raw?.base_amount_raw,
                        extra_charges: activeChat?.extraCharges || activeChat?.raw?.extra_charges,
                        extraCharges: activeChat?.extraCharges || activeChat?.raw?.extra_charges,
                    }}
                />
            )}
        </div>
    );
};
