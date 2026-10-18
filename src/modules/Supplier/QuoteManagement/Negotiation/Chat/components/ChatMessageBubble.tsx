import React, { useState } from 'react';
import { Ban } from 'lucide-react';
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
import { ChatSystemMessageBubble } from './bubble/ChatSystemMessageBubble';

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
    handleRejectOffer,
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
            <div className={`w-full ${spacingClass} my-1`}>
                <CounterOfferMessage
                    msg={msg}
                    activeNegotiation={activeNegotiation}
                    isSupplier={true}
                    onAccept={handleAcceptOffer}
                    onReject={handleRejectOffer}
                    onTogglePin={() => handleTogglePinMessage(msg.id)}
                    onDelete={() => handleDeleteMessage(msg.id)}
                />
            </div>
        );
    }

    if (msg.type === 'system') {
        return (
            <ChatSystemMessageBubble
                msg={msg}
                activeNegotiation={activeNegotiation}
                spacingClass={spacingClass}
            />
        );
    }

    const isSent = msg.type === 'sent' || Boolean(msg.is_me);
    const isEditing = editingMsgId === msg.id;
    const isHighlighted = highlightedMsgId === msg.id;
    const allAttachments = msg.attachments || [];
    const imageAttachments = allAttachments.filter(
        (att) => att.type === 'image' || (att.url && /\.(jpe?g|png|webp|gif|svg)($|\?)/i.test(att.url))
    );
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

            <div className={`w-fit max-w-[85%] sm:max-w-[75%] md:max-w-[62%] min-w-0 flex flex-col ${isSent ? 'items-end' : 'items-start'} relative group`}>
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
                {hasText && (
                    <ChatTextBubble
                        text={msg.text || ''}
                        isSent={isSent}
                        linkPreview={linkPreview}
                        time={msg.time}
                        isPinned={Boolean(msg.isPinned)}
                        isEdited={Boolean(msg.isEdited)}
                        isSeen={msg.seen === true || msg.deliveryStatus === 'seen' || msg.isRead === true}
                        isDelivered={msg.deliveryStatus === 'delivered'}
                    />
                )}
                {!hasText && <ChatBubbleStatusFooter msg={msg} isSent={isSent} />}
            </div>

            <ChatImageLightbox
                lightboxIndex={lightboxIndex}
                imageAttachments={imageAttachments}
                onClose={() => setLightboxIndex(null)}
                onPrev={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : imageAttachments.length - 1))}
                onNext={() => setLightboxIndex((prev) => (prev !== null && prev < imageAttachments.length - 1 ? prev + 1 : 0))}
            />
        </div>
    );
};
