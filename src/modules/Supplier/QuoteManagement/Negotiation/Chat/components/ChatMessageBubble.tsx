import React, { useState } from 'react';
import { Ban, Pin } from 'lucide-react';
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
    nextMsg,
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

    if (msg.type === 'quote_request') {
        return <QuoteRequestBubbleCard msg={msg} activeNegotiation={activeNegotiation} handleAcceptOffer={handleAcceptOffer} handleRejectOffer={handleRejectOffer} />;
    }
    if (msg.type === 'offer') {
        return <div className={spacingClass}><CounterOfferMessage msg={msg} onAccept={handleAcceptOffer} onReject={handleRejectOffer} /></div>;
    }
    if (msg.type === 'system') {
        return (
            <div className={`flex justify-center ${spacingClass}`}>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-full shadow-2xs">
                    {msg.text || (msg as any).message} • {msg.time}
                </span>
            </div>
        );
    }

    const isSent = msg.type === 'sent';
    const isEditing = editingMsgId === msg.id;
    const isHighlighted = highlightedMsgId === msg.id;

    if (msg.isDeleted) {
        return (
            <div className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass}`}>
                <div className="px-3.5 py-1.5 rounded-2xl text-[12.5px] italic text-slate-400 border border-slate-200/80 bg-slate-50 flex items-center gap-1.5 font-medium shadow-2xs">
                    <Ban size={13} className="text-slate-400 shrink-0" />
                    <span>{isSent ? 'You deleted this message' : 'This message was deleted'}</span>
                </div>
            </div>
        );
    }

    const allAttachments = msg.attachments || [];
    const imageAttachments = allAttachments.filter(att => att.type === 'image' || (att.url && /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(att.url)) || (att.name && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(att.name)));
    const hasText = Boolean(msg.text && msg.text.trim().length > 0);
    const detectedUrl = hasText ? extractFirstUrl(msg.text) : null;
    const linkPreview = detectedUrl ? getLinkPreview(detectedUrl, activeNegotiation) : null;

    return (
        <div className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass} group relative`}>
            {!isSent && isFirstInGroup && (
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-2xs self-start mt-0.5">
                    {msg.avatar || activeNegotiation.customer.charAt(0).toUpperCase()}
                </div>
            )}

            <div
                id={`msg-bubble-${msg.id}`}
                className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] min-w-0 flex flex-col ${isSent ? 'items-end' : 'items-start'} relative group transition-all duration-500 ${isHighlighted ? 'ring-2 ring-[#FF4A1F] ring-offset-2 rounded-sm scale-[1.02]' : ''}`}
            >
                {!isEditing && (
                    <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 z-30 ${isSent ? 'right-full mr-2' : 'left-full ml-2'}`}>
                        <ChatBubbleActions
                            msg={msg} isSent={isSent}
                            onTogglePin={() => handleTogglePinMessage(msg.id)}
                            onDelete={() => handleDeleteMessage(msg.id)}
                            onStartEdit={isSent ? () => handleStartEdit(msg) : undefined}
                        />
                    </div>
                )}

                {msg.isPinned && (
                    <div className={`absolute -top-1.5 ${isSent ? '-left-1.5' : '-right-1.5'} w-4.5 h-4.5 bg-[#FF4A1F] text-white rounded-full flex items-center justify-center shadow-xs z-10`}>
                        <Pin size={9} className="fill-white rotate-45" />
                    </div>
                )}

                <ChatAttachmentList attachments={allAttachments} isSent={isSent} onImageClick={(idx) => setLightboxIndex(idx)} />
                {hasText && <ChatTextBubble text={msg.text || ''} isSent={isSent} linkPreview={linkPreview} />}
                <ChatBubbleStatusFooter msg={msg} isSent={isSent} />
            </div>

            <ChatImageLightbox
                lightboxIndex={lightboxIndex} imageAttachments={imageAttachments}
                onClose={() => setLightboxIndex(null)}
                onPrev={() => setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : imageAttachments.length - 1))}
                onNext={() => setLightboxIndex(prev => (prev !== null && prev < imageAttachments.length - 1 ? prev + 1 : 0))}
            />
        </div>
    );
};
