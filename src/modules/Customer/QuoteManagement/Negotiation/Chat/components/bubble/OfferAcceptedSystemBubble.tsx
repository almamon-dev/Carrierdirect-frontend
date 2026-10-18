import React from 'react';
import { Check, CheckCheck, ArrowRight } from 'lucide-react';
import { CustomerChatItem, CustomerChatMessage } from '../../types';
import { QuotePaymentInstructionModal } from '../QuotePaymentInstructionModal';

interface OfferAcceptedSystemBubbleProps {
    msg: CustomerChatMessage;
    activeChat: CustomerChatItem | null;
    spacingClass: string;
    showPaymentInstructionModal: boolean;
    setShowPaymentInstructionModal: (val: boolean) => void;
}

export const OfferAcceptedSystemBubble: React.FC<OfferAcceptedSystemBubbleProps> = ({
    msg,
    activeChat,
    spacingClass,
    showPaymentInstructionModal,
    setShowPaymentInstructionModal,
}) => {
    const textStr = String(msg.text || (msg as any).message || '');
    const rawQuoteNum = activeChat?.quoteNo || activeChat?.raw?.quote_id || activeChat?.raw?.id || '0003';
    const quoteNoStr = String(rawQuoteNum).startsWith('QT-') ? rawQuoteNum : `QT-${String(rawQuoteNum).padStart(4, '0')}`;
    const customerName = activeChat?.raw?.quote_request?.user?.name || 'Customer 1';

    let cleanSubtext = textStr;
    if (cleanSubtext.includes('\n')) {
        const parts = cleanSubtext.split('\n').filter(p => p.trim());
        if (parts.length > 1 && parts[0].toLowerCase().includes('offer accepted')) {
            cleanSubtext = parts.slice(1).join(' ');
        }
    } else if (cleanSubtext.toLowerCase().startsWith('offer accepted:')) {
        cleanSubtext = cleanSubtext.replace(/^offer accepted:\s*/i, '');
    }
    const price = activeChat?.currentPrice || activeChat?.raw?.amount || activeChat?.raw?.total_price || 548;
    if (cleanSubtext.toLowerCase() === 'offer accepted' || cleanSubtext.startsWith('✅') || !cleanSubtext) {
        cleanSubtext = `${customerName} accepted quote #${quoteNoStr.replace(/^#+/, '')} • € ${price}`;
    }

    const targetQuoteId = activeChat?.raw?.quote_id || activeChat?.raw?.id || activeChat?.id;
    const cleanQuoteId = String(targetQuoteId || "").replace(/[^0-9]/g, "");

    const isAlreadyPaid = Boolean(
        (cleanQuoteId && localStorage.getItem(`cd_quote_paid_${cleanQuoteId}`) === "true") ||
        (targetQuoteId && localStorage.getItem(`cd_quote_paid_${targetQuoteId}`) === "true") ||
        activeChat?.raw?.is_paid ||
        activeChat?.raw?.has_order ||
        activeChat?.raw?.order_id ||
        activeChat?.raw?.order ||
        activeChat?.raw?.status_raw === "booked" ||
        activeChat?.raw?.status === "Booked" ||
        (activeChat as any)?.status === "Booked" ||
        (activeChat as any)?.statusRaw === "booked" ||
        (activeChat as any)?.isPaid ||
        (activeChat as any)?.hasOrder ||
        (msg as any)?.is_paid ||
        (msg as any)?.has_order ||
        activeChat?.raw?.payment_status === "succeeded" ||
        activeChat?.raw?.payment_status === "paid" ||
        activeChat?.raw?.payment_status === "completed" ||
        activeChat?.raw?.payment_option === "pay_later" ||
        activeChat?.raw?.payment_option === "pay_now" ||
        activeChat?.raw?.order?.status === "in_progress" ||
        activeChat?.raw?.order?.status === "completed" ||
        activeChat?.raw?.order?.status === "confirmed" ||
        activeChat?.raw?.order?.status === "delivered" ||
        activeChat?.raw?.invoice?.status === "paid" ||
        activeChat?.raw?.invoice?.invoice_type === "pay_later"
    );

    return (
        <div className={`flex justify-end ${spacingClass} my-1 font-sans w-full`}>
            <div className="w-auto max-w-[85%] sm:max-w-[75%] md:max-w-[62%] flex flex-col items-end">
                <div className="w-auto bg-[#DCFCE7] dark:bg-emerald-950/40 border border-[#bbf7d0] dark:border-emerald-800/60 rounded-[4px] p-2.5 sm:p-3 text-left shadow-2xs">
                    <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 min-w-[24px] min-h-[24px] rounded-full bg-[#16A344] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            <Check size={13} strokeWidth={3} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[12.5px] font-bold text-[#16A344] dark:text-emerald-300 leading-tight">
                                Quote accepted
                            </h4>
                            <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-snug mt-0.5">
                                {cleanSubtext}
                            </p>
                            {!isAlreadyPaid && (
                                <div className="mt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentInstructionModal(true)}
                                        className="bg-[#16A344] hover:bg-[#15803d] text-white px-2.5 py-1 rounded-[4px] text-[11px] font-bold cursor-pointer inline-flex items-center gap-1 shadow-2xs transition-colors"
                                    >
                                        <span>Proceed to Payment</span>
                                        <ArrowRight size={11} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 ml-3 self-end mb-0.5">
                            <span>{msg.time || "5:21 PM"}</span>
                            <CheckCheck size={13} className="text-[#16A344]" />
                        </div>
                    </div>
                </div>
                {msg.time && (
                    <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 px-1">
                        {msg.time}
                    </div>
                )}
            </div>

            <QuotePaymentInstructionModal
                isOpen={showPaymentInstructionModal}
                onClose={() => setShowPaymentInstructionModal(false)}
                quoteId={activeChat?.raw?.quote_id || activeChat?.raw?.id || activeChat?.id}
                quoteAmount={activeChat?.currentPrice || activeChat?.raw?.amount || activeChat?.raw?.total_price}
                supplierName={customerName}
            />
        </div>
    );
};
