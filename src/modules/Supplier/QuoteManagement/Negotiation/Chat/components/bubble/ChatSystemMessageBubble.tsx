import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { QuoteActivityBubble } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/components/bubble/QuoteActivityBubble';
import { NegotiationItem } from '../../../types';
import { ChatMessage } from '../../types';

interface ChatSystemMessageBubbleProps {
    msg: ChatMessage;
    activeNegotiation: NegotiationItem;
    spacingClass: string;
}

export const ChatSystemMessageBubble: React.FC<ChatSystemMessageBubbleProps> = ({
    msg,
    activeNegotiation,
    spacingClass,
}) => {
    const textStr = String(msg.text || (msg as any).message || '');
    const lower = textStr.toLowerCase();

    const avatarUrl = (activeNegotiation as any)?.avatar;
    const customerName = activeNegotiation.customer || 'Customer 1';
    const customerInitial = (customerName.trim().charAt(0) || 'C').toUpperCase();

    const renderCustomerAvatar = () => (
        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs shadow-2xs self-start mt-0.5 shrink-0 overflow-hidden">
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            ) : (
                customerInitial
            )}
        </div>
    );

    // 1. Offer Accepted green confirmation bubble (Accepted by Customer -> Left aligned with customer avatar)
    const isOfferAccepted = 
        lower.includes('offer accepted') || 
        lower.includes('accepted your quote') || 
        lower.includes('accepted the quote') ||
        lower.includes('has accepted your quote') ||
        lower.includes('accepted your counter offer') || 
        (lower.includes('accepted') && (lower.includes('quote') || lower.includes('offer')) && !lower.includes('payment') && !lower.includes('escrow') && !lower.includes('paid')) ||
        ((msg as any).status === 'accepted' && !lower.includes('payment') && !lower.includes('escrow') && !lower.includes('paid'));

    if (isOfferAccepted) {
        const rawQuoteNum = (activeNegotiation as any).quoteNo || activeNegotiation.quoteId || activeNegotiation.id || '0001';
        const quoteNoStr = String(rawQuoteNum).startsWith('QT-') ? rawQuoteNum : `QT-${String(rawQuoteNum).padStart(4, '0')}`;
        const price = activeNegotiation.currentOffer || activeNegotiation.originalAmount || (activeNegotiation as any).amount || 548;

        let cleanSubtext = textStr;
        if (cleanSubtext.includes('\n')) {
            const parts = cleanSubtext.split('\n').filter((p) => p.trim());
            if (parts.length > 1 && parts[0].toLowerCase().includes('offer accepted')) {
                cleanSubtext = parts.slice(1).join(' ');
            }
        } else if (cleanSubtext.toLowerCase().startsWith('offer accepted:')) {
            cleanSubtext = cleanSubtext.replace(/^offer accepted:\s*/i, '');
        } else if (cleanSubtext.toLowerCase() === 'offer accepted' || cleanSubtext.startsWith('✅') || !cleanSubtext) {
            cleanSubtext = `${customerName} accepted quote #${quoteNoStr.replace(/^#+/, '')} • € ${price}`;
        }

        return (
            <div className={`flex gap-2.5 justify-start ${spacingClass} my-1 font-sans w-full`}>
                {renderCustomerAvatar()}
                <div className="w-auto max-w-[85%] sm:max-w-[75%] md:max-w-[62%] flex flex-col items-start">
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
                            </div>
                            <div className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 ml-3 self-end mb-0.5">
                                <span>{msg.time || '5:21 PM'}</span>
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
            </div>
        );
    }

    // 2. Revised Offer Orange Activity Bubble
    const isRevisedOffer = lower.includes('revised offer') || lower.includes('has submitted a revised offer');
    if (isRevisedOffer) {
        const rawQuoteNum = (activeNegotiation as any).quoteNo || activeNegotiation.quoteId || activeNegotiation.id || '0001';
        const quoteNoStr = String(rawQuoteNum).startsWith('QT-') ? rawQuoteNum : `QT-${String(rawQuoteNum).padStart(4, '0')}`;
        const price = activeNegotiation.currentOffer || activeNegotiation.originalAmount || (activeNegotiation as any).amount || 548;
        const isSent = Boolean((msg as any).is_me || msg.type === 'sent');

        return (
            <div className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass} my-1 font-sans w-full`}>
                {!isSent && renderCustomerAvatar()}
                <div className="w-full max-w-[480px]">
                    <QuoteActivityBubble
                        type="revised_offer"
                        actorName={customerName}
                        quoteNumber={quoteNoStr}
                        amount={price}
                        time={msg.time || '-'}
                        isSent={isSent}
                    />
                </div>
            </div>
        );
    }

    // 3. Payment Completed blue confirmation bubble (Completed by Customer -> Left aligned with customer avatar)
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
            <div className={`flex gap-2.5 justify-start ${spacingClass} my-1 font-sans w-full`}>
                {renderCustomerAvatar()}
                <div className="w-auto max-w-[85%] sm:max-w-[75%] md:max-w-[62%] flex flex-col items-start">
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
