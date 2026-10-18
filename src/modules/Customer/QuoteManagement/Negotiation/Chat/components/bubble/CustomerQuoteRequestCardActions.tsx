import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Check, Tag, Eye } from "lucide-react";
import Button from "@/components/ui/button";
import { encryptId } from "@/lib/encryption";
import { CustomerChatMessage, CustomerChatItem } from "../../types";
import { resolveQuotePaymentStatus } from "./quoteRequestPaymentHelpers";
import { CustomerQuoteAcceptedActions } from "./CustomerQuoteAcceptedActions";

interface CustomerQuoteRequestCardActionsProps {
    isAccepted: boolean;
    isDeclined: boolean;
    msg: CustomerChatMessage;
    activeChat?: CustomerChatItem | null;
    onAcceptOffer: (msg: CustomerChatMessage) => void;
    onShowDeclineModal: () => void;
    onOpenCounterOffer?: () => void;
}

export const CustomerQuoteRequestCardActions: React.FC<CustomerQuoteRequestCardActionsProps> = ({
    isAccepted,
    isDeclined,
    msg,
    activeChat,
    onAcceptOffer,
    onShowDeclineModal,
    onOpenCounterOffer,
}) => {
    const navigate = useNavigate();
    const [isAccepting, setIsAccepting] = useState(false);
    const [showInstructionModal, setShowInstructionModal] = useState(false);

    const isSuperseded = msg.status === "superseded" || (msg as any)?.is_superseded === true;

    const { targetQuoteId, isPayLater, isOrderPaid, orderId } = resolveQuotePaymentStatus(msg, activeChat);

    const handleAccept = () => {
        setIsAccepting(true);
        setShowInstructionModal(true);
        onAcceptOffer(msg);
        setTimeout(() => setIsAccepting(false), 200);
    };

    if (isSuperseded) {
        return (
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded px-2 py-1 text-center flex items-center justify-center gap-1.5 text-[10.5px] text-slate-400">
                <Tag size={11} />
                <span>Superseded by counter</span>
            </div>
        );
    }

    if (isAccepted || isOrderPaid) {
        return (
            <CustomerQuoteAcceptedActions
                targetQuoteId={targetQuoteId}
                orderId={orderId}
                isOrderPaid={isOrderPaid}
                isPayLater={isPayLater}
                showInstructionModal={showInstructionModal}
                setShowInstructionModal={setShowInstructionModal}
                msg={msg}
                activeChat={activeChat}
            />
        );
    }

    if (isDeclined) {
        return (
            <div className="space-y-1.5 pt-1 font-sans">
                <div className="flex items-center justify-between px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 rounded-[5px]">
                    <div className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-400 text-xs">
                        <XCircle size={13.5} className="text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>Offer Declined</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            navigate("/customer/quotes/received/view/" + encryptId(targetQuoteId));
                        }}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                        <Eye size={11.5} />
                        <span>View Details</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2 pt-1 font-sans">
            {/* Row 1: Action buttons */}
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    isLoading={isAccepting}
                    disabled={isAccepting}
                    onClick={handleAccept}
                    className="flex-1 h-8 rounded-[5px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-75 disabled:cursor-not-allowed"
                >
                    <Check size={13} />
                    <span>Accept Offer</span>
                </Button>
                <Button
                    type="button"
                    disabled={isAccepting}
                    onClick={() => {
                        if (onOpenCounterOffer) {
                            onOpenCounterOffer();
                        } else {
                            const counterBtn = document.querySelector('button[title*="Counter"], button[title*="Propose"]') as HTMLButtonElement;
                            if (counterBtn) counterBtn.click();
                        }
                    }}
                    className="flex-1 h-8 rounded-[5px] bg-[#FF4A1F] hover:bg-[#e03e15] text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-60"
                >
                    <Tag size={12} />
                    <span>Counter</span>
                </Button>
            </div>

            {/* Sub links */}
            <div className="flex items-center justify-between px-1 text-[11px]">
                <button
                    type="button"
                    onClick={() => {
                        navigate("/customer/quotes/received/view/" + encryptId(targetQuoteId));
                    }}
                    className="hover:text-slate-800 dark:hover:text-slate-200 hover:underline cursor-pointer inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium"
                >
                    <Eye size={11.5} />
                    <span>View Details</span>
                </button>
                <button
                    type="button"
                    onClick={onShowDeclineModal}
                    className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium hover:underline transition-colors cursor-pointer"
                >
                    Decline Offer
                </button>
            </div>
        </div>
    );
};
