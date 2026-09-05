import React from 'react';
import { CheckCircle2, XCircle, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import { CustomerChatMessage } from '../../types';

interface CustomerQuoteRequestCardActionsProps {
    isAccepted: boolean;
    isDeclined: boolean;
    msg: CustomerChatMessage;
    onAcceptOffer: (msg: CustomerChatMessage) => void;
    onShowDeclineModal: () => void;
}

export const CustomerQuoteRequestCardActions: React.FC<CustomerQuoteRequestCardActionsProps> = ({
    isAccepted,
    isDeclined,
    msg,
    onAcceptOffer,
    onShowDeclineModal,
}) => {
    if (isAccepted) {
        return (
            <div className="flex items-center justify-center gap-1.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 rounded-[5px] text-xs font-semibold">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>Quote Accepted</span>
            </div>
        );
    }

    if (isDeclined) {
        return (
            <div className="flex items-center justify-center gap-1.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/80 rounded-[5px] text-xs font-semibold">
                <XCircle size={15} className="text-rose-600" />
                <span>Quote Declined</span>
            </div>
        );
    }

    return (
        <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    onClick={() => onAcceptOffer(msg)}
                    className="flex-1 h-8 rounded-[5px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                    <Check size={13} /> Accept Quote
                </Button>
                <Button
                    type="button"
                    onClick={() => {
                        const counterBtn = document.querySelector('button[title*="Counter"]') as HTMLButtonElement;
                        if (counterBtn) counterBtn.click();
                    }}
                    className="flex-1 h-8 rounded-[5px] bg-[#FF4A1F] hover:bg-[#e03e15] text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                    Counter Offer
                </Button>
            </div>
            <button
                type="button"
                onClick={onShowDeclineModal}
                className="w-full text-center text-[11px] font-medium text-slate-400 hover:text-rose-600 py-1 transition-colors cursor-pointer"
            >
                Decline Quote
            </button>
        </div>
    );
};
