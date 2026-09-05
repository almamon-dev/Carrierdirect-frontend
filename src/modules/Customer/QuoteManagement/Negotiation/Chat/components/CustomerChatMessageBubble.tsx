import React, { useState } from 'react';
import { Ban, Check, CheckCheck, Pin } from 'lucide-react';
import CounterOfferMessage from '../../CounterOffer';
import { CustomerChatItem, CustomerChatMessage } from '../types';
import { CustomerQuoteRequestCard } from './bubble/CustomerQuoteRequestCard';
import { CustomerChatBubbleActions } from './bubble/CustomerChatBubbleActions';
import { CustomerChatTextBubble } from './bubble/CustomerChatTextBubble';
import { CustomerChatAttachmentList } from './bubble/CustomerChatAttachmentList';
import { ChatImageLightbox } from '@/modules/Supplier/QuoteManagement/Negotiation/Chat/components/bubble/ChatImageLightbox';

interface CustomerChatMessageBubbleProps {
    msg: CustomerChatMessage;
    activeChat: CustomerChatItem | null;
    isFirstInGroup: boolean;
    isLastInGroup: boolean;
    spacingClass: string;
    editingMsgId?: number | string | null;
    onAcceptOffer: (msg: CustomerChatMessage) => void;
    onRejectOffer: (msg: CustomerChatMessage, reason?: string) => void;
    onSendCounterOffer: (amount: number, note: string) => void;
    onStartEdit?: (msg: CustomerChatMessage) => void;
    onDeleteMessage?: (msgId: number | string) => void;
    onTogglePinMessage?: (msgId: number | string) => void;
}

export const CustomerChatMessageBubble: React.FC<CustomerChatMessageBubbleProps> = ({
    msg,
    activeChat,
    isFirstInGroup,
    spacingClass,
    editingMsgId,
    onAcceptOffer,
    onRejectOffer,
    onStartEdit,
    onDeleteMessage,
    onTogglePinMessage
}) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    if (msg.type === 'quote_request') {
        return (
            <CustomerQuoteRequestCard
                msg={msg} activeChat={activeChat} spacingClass={spacingClass}
                onAcceptOffer={onAcceptOffer} onRejectOffer={onRejectOffer}
            />
        );
    }

    if (msg.type === 'offer') {
        return (
            <div className={spacingClass}>
                <CounterOfferMessage msg={msg as any} onAccept={() => onAcceptOffer(msg)} onReject={(reason) => onRejectOffer(msg, reason)} />
            </div>
        );
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
    const allAttachments = msg.attachments || [];
    const imageAttachments = allAttachments.filter(att => att.type === 'image' || (att.url && /\.(jpe?g|png|webp|gif|svg)($|\?)/i.test(att.url)));
    const hasText = Boolean(msg.text && msg.text.trim().length > 0);

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

    return (
        <div className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass} group relative`}>
            {!isSent && isFirstInGroup && (
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-2xs self-start mt-0.5">
                    {activeChat?.carrier?.charAt(0).toUpperCase() || 'S'}
                </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] min-w-0 flex flex-col ${isSent ? 'items-end' : 'items-start'} relative group`}>
                {!isEditing && (
                    <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 z-30 ${isSent ? 'right-full mr-2' : 'left-full ml-2'}`}>
                        <CustomerChatBubbleActions
                            msg={msg} isSent={isSent}
                            onTogglePin={onTogglePinMessage ? () => onTogglePinMessage(msg.id) : undefined}
                            onDelete={onDeleteMessage ? () => onDeleteMessage(msg.id) : undefined}
                            onStartEdit={isSent && onStartEdit ? () => onStartEdit(msg) : undefined}
                        />
                    </div>
                )}

                {msg.isPinned && (
                    <div className={`absolute -top-1.5 ${isSent ? '-left-1.5' : '-right-1.5'} w-4.5 h-4.5 bg-[#FF4A1F] text-white rounded-full flex items-center justify-center shadow-xs z-10`}>
                        <Pin size={9} className="fill-white rotate-45" />
                    </div>
                )}

                <CustomerChatAttachmentList attachments={allAttachments} isSent={isSent} onImageClick={(idx) => setLightboxIndex(idx)} />
                {hasText && <CustomerChatTextBubble text={msg.text || ''} isSent={isSent} />}

                <div className={`flex items-center gap-1.5 mt-1 px-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.time}</span>
                    {msg.isEdited && <span className="italic text-[9.5px]">(edited)</span>}
                    {isSent && (
                        (msg.seen === true || msg.deliveryStatus === 'seen' || msg.isRead === true) ? (
                            <span className="inline-flex items-center gap-0.5 text-sky-500 font-semibold ml-1"><span>• Seen</span><CheckCheck size={13} /></span>
                        ) : msg.deliveryStatus === 'delivered' ? (
                            <span className="inline-flex items-center gap-0.5 text-slate-400 font-medium ml-1"><span>• Delivered</span><CheckCheck size={13} /></span>
                        ) : (
                            <span className="inline-flex items-center gap-0.5 text-slate-400 font-medium ml-1"><span>• Sent</span><Check size={13} /></span>
                        )
                    )}
                </div>
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
