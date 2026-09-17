import React, { useState } from 'react';
import { Ban, Check } from 'lucide-react';
import CounterOfferMessage from '@/modules/Customer/QuoteManagement/Negotiation/CounterOffer';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { extractFirstUrl, getLinkPreview } from './bubble/chatLinkUtils';
import { ChatImageLightbox } from './bubble/ChatImageLightbox';
import { ChatAttachmentList } from './bubble/ChatAttachmentList';
import { ChatBubbleActions } from './bubble/ChatBubbleActions';
import { QuoteRequestBubbleCard } from './bubble/QuoteRequestBubbleCard';
import { ChatTextBubble } from './bubble/ChatTextBubble';
import { ChatBubbleStatusFooter } from './bubble/ChatBubbleStatusFooter';

interface ChatMessageBubbleProps {
    msg: ChatMessage;
    index: number;
    prevMsg: ChatMessage | null;
    nextMsg: ChatMessage | null;
    activeNegotiation: NegotiationItem;
    editingMsgId: number | string | null;
    highlightedMsgId: number | string | null;
    handleTogglePinMessage: (id: number | string) => void;
    handleDeleteMessage: (id: number | string) => void;
    handleStartEdit: (msg: ChatMessage) => void;
    handleAcceptOffer: (msg: any) => void;
    handleRejectOffer: (msg: any, reason?: string) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
    msg,
    prevMsg,
    activeNegotiation,
    editingMsgId,
    highlightedMsgId,
    handleTogglePinMessage,
    handleDeleteMessage,
    handleStartEdit,
    handleAcceptOffer,
    handleRejectOffer
}) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const isFirstInGroup = !prevMsg || prevMsg.type !== msg.type || prevMsg.sender !== msg.sender;
    const spacingClass = isFirstInGroup ? 'mt-5' : 'mt-1';
    const avatarUrl = (activeNegotiation as any)?.avatar;

    if (msg.type === 'quote_request') {
        return (
            <QuoteRequestBubbleCard
                msg={msg}
                activeNegotiation={activeNegotiation}
                handleAcceptOffer={handleAcceptOffer}
                handleRejectOffer={handleRejectOffer}
                handleTogglePinMessage={handleTogglePinMessage}
                handleDeleteMessage={handleDeleteMessage}
                highlightedMsgId={highlightedMsgId}
            />
        );
    }
    if (msg.type === 'offer') {
        return (
            <div className={`flex justify-center ${spacingClass} group relative items-center w-full px-1`}>
                <CounterOfferMessage
                    msg={msg}
                    activeNegotiation={activeNegotiation}
                    onAccept={handleAcceptOffer}
                    onReject={handleRejectOffer}
                    onTogglePin={() => handleTogglePinMessage(msg.id)}
                    onDelete={() => handleDeleteMessage(msg.id)}
                />
            </div>
        );
    }
    if (msg.type === 'system') {
        const textStr = String(msg.text || (msg as any).message || '');
        const lower = textStr.toLowerCase();

        // 1. Offer Accepted green confirmation bubble (matching user mockup)
        const isOfferAccepted = 
            lower.includes('offer accepted') || 
            lower.includes('accepted your quote') || 
            lower.includes('accepted the quote') ||
            lower.includes('has accepted your quote') ||
            lower.includes('accepted your counter offer') || 
            (lower.includes('accepted') && (lower.includes('quote') || lower.includes('offer')) && !lower.includes('payment') && !lower.includes('escrow') && !lower.includes('paid')) ||
            ((msg as any).status === 'accepted' && !lower.includes('payment') && !lower.includes('escrow') && !lower.includes('paid'));

        if (isOfferAccepted) {
            const rawQuoteNum = (activeNegotiation as any).quoteNo || activeNegotiation.quoteId || activeNegotiation.id || '0003';
            const quoteNoStr = String(rawQuoteNum).startsWith('QT-') ? rawQuoteNum : `QT-${String(rawQuoteNum).padStart(4, '0')}`;
            const customerName = activeNegotiation.customer || 'Customer 1';

            let cleanSubtext = textStr;
            if (cleanSubtext.includes('\n')) {
                const parts = cleanSubtext.split('\n').filter(p => p.trim());
                if (parts.length > 1 && parts[0].toLowerCase().includes('offer accepted')) {
                    cleanSubtext = parts.slice(1).join(' ');
                }
            } else if (cleanSubtext.toLowerCase().startsWith('offer accepted:')) {
                cleanSubtext = cleanSubtext.replace(/^offer accepted:\s*/i, '');
            } else if (cleanSubtext.toLowerCase() === 'offer accepted' || cleanSubtext.startsWith('✅')) {
                cleanSubtext = `${customerName} has accepted your quote (${quoteNoStr}).`;
            }

            return (
                <div className={`flex gap-2.5 justify-start ${spacingClass} my-1 font-sans w-full`}>
                    <div className="w-7 shrink-0" aria-hidden="true" />
                    <div className="w-full max-w-[360px] flex flex-col items-start">
                        <div className="w-full bg-[#e8f7ee] dark:bg-emerald-950/40 border border-[#b8eccb] dark:border-emerald-800/60 rounded-[4px] p-2.5 text-left shadow-2xs">
                            <div className="flex items-start gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                    <Check size={13} strokeWidth={3} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-[#065f46] dark:text-emerald-300 leading-tight">
                                        Offer Accepted
                                    </h4>
                                    <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-snug mt-0.5">
                                        {cleanSubtext || `${customerName} has accepted your quote (${quoteNoStr}).`}
                                    </p>
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

        // 2. Payment Completed blue confirmation bubble (matching user mockup)
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
                    <div className="w-7 shrink-0" aria-hidden="true" />
                    <div className="w-full max-w-[360px] flex flex-col items-start">
                        <div className="w-full bg-[#eff6ff] dark:bg-slate-800/90 border border-[#dbeafe] dark:border-slate-700 rounded-[4px] p-2.5 text-left shadow-2xs">
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
    }

    const isSent = msg.type === 'sent' || Boolean(msg.is_me);
    const isEditing = editingMsgId === msg.id;
    const isHighlighted = highlightedMsgId === msg.id;
    const allAttachments = msg.attachments || [];
    const imageAttachments = allAttachments.filter(att => att.type === 'image' || (att.url && /\.(jpe?g|png|webp|gif|svg)($|\?)/i.test(att.url)));
    const hasText = Boolean(msg.text && msg.text.trim().length > 0);
    const firstUrl = hasText ? extractFirstUrl(msg.text || '') : null;
    const linkPreview = firstUrl ? getLinkPreview(firstUrl, activeNegotiation) : null;

    if (msg.isDeleted) {
        return (
            <div className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass}`}>
                {!isSent && (
                    isFirstInGroup ? (
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-2xs self-start mt-0.5 shrink-0 overflow-hidden">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            ) : (
                                activeNegotiation.customer.charAt(0).toUpperCase()
                            )}
                        </div>
                    ) : (
                        <div className="w-7 shrink-0" aria-hidden="true" />
                    )
                )}
                <div className="px-3.5 py-1.5 rounded-lg text-[12.5px] italic text-slate-400 border border-slate-200/80 bg-slate-50 flex items-center gap-1.5 font-medium shadow-2xs">
                    <Ban size={13} className="text-slate-400 shrink-0" />
                    <span>{isSent ? 'You deleted this message' : 'This message was deleted'}</span>
                </div>
            </div>
        );
    }

    return (
        <div
            id={`msg-${msg.id}`}
            className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass} group relative ${isHighlighted ? 'ring-2 ring-emerald-400/50 rounded-lg p-1 bg-emerald-50/20' : ''}`}
        >
            {!isSent && (
                isFirstInGroup ? (
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-2xs self-start mt-0.5 shrink-0 overflow-hidden">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                            activeNegotiation.customer.charAt(0).toUpperCase()
                        )}
                    </div>
                ) : (
                    <div className="w-7 shrink-0" aria-hidden="true" />
                )
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] min-w-0 flex flex-col ${isSent ? 'items-end' : 'items-start'} relative group`}>
                {!isEditing && (
                    <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 z-30 ${isSent ? 'right-full mr-2' : 'left-full ml-2'}`}>
                        <ChatBubbleActions
                            msg={msg}
                            isSent={isSent}
                            onTogglePin={() => handleTogglePinMessage(msg.id)}
                            onDelete={() => handleDeleteMessage(msg.id)}
                            onStartEdit={isSent ? () => handleStartEdit(msg) : undefined}
                        />
                    </div>
                )}

                <ChatAttachmentList attachments={allAttachments} isSent={isSent} onImageClick={(idx) => setLightboxIndex(idx)} />
                {hasText && <ChatTextBubble text={msg.text || ''} isSent={isSent} linkPreview={linkPreview} />}
                <ChatBubbleStatusFooter msg={msg} isSent={isSent} />
            </div>

            <ChatImageLightbox
                lightboxIndex={lightboxIndex}
                imageAttachments={imageAttachments}
                onClose={() => setLightboxIndex(null)}
                onPrev={() => setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : imageAttachments.length - 1))}
                onNext={() => setLightboxIndex(prev => (prev !== null && prev < imageAttachments.length - 1 ? prev + 1 : 0))}
            />
        </div>
    );
};
