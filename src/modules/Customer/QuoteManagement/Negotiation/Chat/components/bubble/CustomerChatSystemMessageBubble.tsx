import React from 'react';
import { CustomerChatItem, CustomerChatMessage } from '../../types';
import { QuoteActivityBubble } from './QuoteActivityBubble';
import { OfferAcceptedSystemBubble } from './OfferAcceptedSystemBubble';

interface CustomerChatSystemMessageBubbleProps {
    msg: CustomerChatMessage;
    activeChat: CustomerChatItem | null;
    spacingClass: string;
    showPaymentInstructionModal: boolean;
    setShowPaymentInstructionModal: (val: boolean) => void;
}

export const CustomerChatSystemMessageBubble: React.FC<CustomerChatSystemMessageBubbleProps> = ({
    msg,
    activeChat,
    spacingClass,
    showPaymentInstructionModal,
    setShowPaymentInstructionModal,
}) => {
    const textStr = String(msg.text || (msg as any).message || '');
    const lower = textStr.toLowerCase();

    // 1. Offer Accepted green confirmation bubble
    const isOfferAccepted =
        lower.includes('offer accepted') ||
        lower.includes('accepted your quote') ||
        lower.includes('accepted the quote') ||
        lower.includes('has accepted your quote') ||
        lower.includes('accepted your counter offer') ||
        (lower.includes('accepted') && (lower.includes('quote') || lower.includes('offer')) && !lower.includes('payment') && !lower.includes('escrow') && !lower.includes('paid')) ||
        ((msg as any).status === 'accepted' && !lower.includes('payment') && !lower.includes('escrow') && !lower.includes('paid'));

    if (isOfferAccepted) {
        return (
            <OfferAcceptedSystemBubble
                msg={msg}
                activeChat={activeChat}
                spacingClass={spacingClass}
                showPaymentInstructionModal={showPaymentInstructionModal}
                setShowPaymentInstructionModal={setShowPaymentInstructionModal}
            />
        );
    }

    // 2. Revised Offer Orange Bubble
    const isRevisedOffer = lower.includes('revised offer') || lower.includes('has submitted a revised offer');
    if (isRevisedOffer) {
        const rawQuoteNum = activeChat?.quoteNo || activeChat?.raw?.quote_id || activeChat?.raw?.id || '0001';
        const quoteNoStr = String(rawQuoteNum).startsWith('QT-') ? rawQuoteNum : `QT-${String(rawQuoteNum).padStart(4, '0')}`;
        const otherParty = activeChat?.carrier || activeChat?.company || activeChat?.name || 'Supplier Co 1';

        const avatarInitials = (otherParty)
            .split(' ')
            .map((w: string) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'S1';

        return (
            <div className={`flex gap-2.5 items-start justify-start ${spacingClass} my-1 font-sans w-full`}>
                <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xs shrink-0 mt-0.5 shadow-2xs select-none overflow-hidden">
                    {activeChat?.avatar && (activeChat.avatar.startsWith('http') || activeChat.avatar.startsWith('/storage') || activeChat.avatar.startsWith('data:') || activeChat.avatar.includes('.')) ? (
                        <img src={activeChat.avatar} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                        avatarInitials
                    )}
                </div>
                <div className="w-auto max-w-[85%] sm:max-w-[75%] md:max-w-[62%]">
                    <QuoteActivityBubble
                        type="revised_offer"
                        actorName={otherParty}
                        quoteNumber={quoteNoStr}
                        time={msg.time || '10:05 PM'}
                    />
                </div>
            </div>
        );
    }

    // 3. Payment Completed blue confirmation bubble
    const isPaymentCompleted = lower.includes('payment completed') || lower.includes('booking is confirmed') || lower.includes('booking confirmed') || lower.includes('funds held securely');
    if (isPaymentCompleted) {
        const lines = textStr.split('\n');
        const title = lines[0] && (lines[0].includes('Payment completed') || lines[0].includes('Booking confirmed') || lines[0].includes('Payment'))
            ? lines[0]
            : 'Payment completed! 🎉';
        const subtext = lines.length > 1
            ? lines.slice(1).join('\n')
            : (lower.includes('pay later') || lower.includes('net-30')
                ? 'Your booking is confirmed under corporate Net-30 terms.'
                : 'We have received the payment and your booking is confirmed.');

        return (
            <div className={`flex justify-end ${spacingClass} my-1 font-sans w-full`}>
                <div className="w-auto max-w-[85%] sm:max-w-[75%] md:max-w-[62%] flex flex-col items-end">
                    <div className="w-auto bg-[#eff6ff] dark:bg-slate-800/90 border border-[#dbeafe] dark:border-slate-700 rounded-[4px] p-3 sm:p-3.5 text-left shadow-2xs">
                        <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 leading-tight">
                            {title}
                        </h4>
                        <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-snug mt-0.5">
                            {subtext}
                        </p>
                    </div>
                    {msg.time && (
                        <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 px-1">
                            {msg.time}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex justify-center ${spacingClass}`}>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-full shadow-2xs">
                {msg.text || (msg as any).message} • {msg.time}
            </span>
        </div>
    );
};
