import React, { useState } from 'react';
import { Ban, Check, CheckCheck, Pin, ArrowRight } from 'lucide-react';
import CounterOfferMessage from '../../CounterOffer';
import { CustomerChatItem, CustomerChatMessage } from '../types';
import { CustomerQuoteRequestCard } from './bubble/CustomerQuoteRequestCard';
import { CustomerChatBubbleActions } from './bubble/CustomerChatBubbleActions';
import { CustomerChatTextBubble } from './bubble/CustomerChatTextBubble';
import { CustomerChatAttachmentList } from './bubble/CustomerChatAttachmentList';
import { ChatImageLightbox } from '@/modules/Supplier/QuoteManagement/Negotiation/Chat/components/bubble/ChatImageLightbox';
import { QuotePaymentInstructionModal } from './QuotePaymentInstructionModal';

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
    onOpenCounterOffer?: () => void;
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
    onOpenCounterOffer,
    onStartEdit,
    onDeleteMessage,
    onTogglePinMessage
}) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [showPaymentInstructionModal, setShowPaymentInstructionModal] = useState(false);

    if (msg.type === 'quote_request') {
        return (
            <CustomerQuoteRequestCard
                msg={msg}
                activeChat={activeChat}
                spacingClass={spacingClass}
                onAcceptOffer={onAcceptOffer}
                onRejectOffer={onRejectOffer}
                onOpenCounterOffer={onOpenCounterOffer}
                onTogglePinMessage={onTogglePinMessage}
                onDeleteMessage={onDeleteMessage}
            />
        );
    }

    if (msg.type === 'offer') {
        return (
            <div className={`flex justify-center ${spacingClass} group relative items-center w-full px-1`}>
                <CounterOfferMessage
                    msg={msg as any}
                    activeChat={activeChat}
                    onAccept={() => onAcceptOffer(msg)}
                    onReject={(reason) => onRejectOffer(msg, reason)}
                    onTogglePin={onTogglePinMessage ? () => onTogglePinMessage(msg.id) : undefined}
                    onDelete={onDeleteMessage ? () => onDeleteMessage(msg.id) : undefined}
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
            } else if (cleanSubtext.toLowerCase() === 'offer accepted' || cleanSubtext.startsWith('✅')) {
                cleanSubtext = `${customerName} has accepted your quote (${quoteNoStr}).`;
            }

            const isAlreadyPaid = Boolean(
                activeChat?.raw?.is_paid ||
                activeChat?.raw?.has_order ||
                activeChat?.raw?.order_id ||
                activeChat?.raw?.invoice?.status === "paid" ||
                activeChat?.raw?.invoice?.invoice_type === "pay_later" ||
                (activeChat as any)?.isPaid ||
                (activeChat as any)?.hasOrder
            );

            return (
                <div className={`flex justify-end ${spacingClass} my-1 font-sans w-full`}>
                    <div className="w-full max-w-[360px] flex flex-col items-end">
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
                                    {!isAlreadyPaid && (
                                        <div className="mt-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setShowPaymentInstructionModal(true)}
                                                className="bg-[#10b981] hover:bg-[#059669] text-white px-2.5 py-1 rounded-[4px] text-[11px] font-bold cursor-pointer inline-flex items-center gap-1 shadow-2xs transition-colors"
                                            >
                                                <span>Proceed to Payment</span>
                                                <ArrowRight size={11} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 px-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 justify-end">
                            <span>{msg.time}</span>
                            {(msg.seen === true || msg.deliveryStatus === 'seen' || msg.isRead === true) ? (
                                <span className="inline-flex items-center gap-0.5 text-sky-500 font-semibold ml-1">
                                    <span>• Seen</span>
                                    <CheckCheck size={13} className="text-sky-500 inline-block ml-0.5" />
                                </span>
                            ) : msg.deliveryStatus === 'delivered' ? (
                                <span className="inline-flex items-center gap-0.5 text-slate-400 font-medium ml-1">
                                    <span>• Delivered</span>
                                    <CheckCheck size={13} className="text-slate-400 inline-block ml-0.5" />
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-0.5 text-slate-400 font-medium ml-1">
                                    <span>• Sent</span>
                                    <Check size={13} className="text-slate-400 inline-block ml-0.5" />
                                </span>
                            )}
                        </div>
                    </div>
                    {!isAlreadyPaid && (
                        <QuotePaymentInstructionModal
                            isOpen={showPaymentInstructionModal}
                            onClose={() => setShowPaymentInstructionModal(false)}
                            quoteId={activeChat?.raw?.quote_id || activeChat?.raw?.id || 1}
                            quoteAmount={(msg as any).proposed_amount || (msg as any).newTotal || activeChat?.currentPrice || 45000}
                            supplierName={activeChat?.carrier || activeChat?.name || "Carrier Partner"}
                            quoteData={activeChat?.raw || activeChat}
                        />
                    )}
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
                <div className={`flex justify-end ${spacingClass} my-1 font-sans w-full`}>
                    <div className="w-full max-w-[360px] flex flex-col items-end">
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
    const allAttachments = msg.attachments || [];
    const imageAttachments = allAttachments.filter(att => att.type === 'image' || (att.url && /\.(jpe?g|png|webp|gif|svg)($|\?)/i.test(att.url)));
    const hasText = Boolean(msg.text && msg.text.trim().length > 0);

    if (msg.isDeleted) {
        return (
            <div className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass}`}>
                {!isSent && (
                    isFirstInGroup ? (
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-2xs self-start mt-0.5 shrink-0 overflow-hidden">
                            {activeChat?.avatar && (activeChat.avatar.startsWith('http') || activeChat.avatar.startsWith('/storage') || activeChat.avatar.startsWith('data:') || activeChat.avatar.includes('.')) ? (
                                <img src={activeChat.avatar} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            ) : (
                                activeChat?.carrier?.charAt(0).toUpperCase() || activeChat?.name?.charAt(0).toUpperCase() || 'S'
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
        <div className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass} group relative`}>
            {!isSent && (
                isFirstInGroup ? (
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-2xs self-start mt-0.5 shrink-0 overflow-hidden">
                        {activeChat?.avatar && (activeChat.avatar.startsWith('http') || activeChat.avatar.startsWith('/storage') || activeChat.avatar.startsWith('data:') || activeChat.avatar.includes('.')) ? (
                            <img src={activeChat.avatar} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                            activeChat?.carrier?.charAt(0).toUpperCase() || activeChat?.name?.charAt(0).toUpperCase() || 'S'
                        )}
                    </div>
                ) : (
                    <div className="w-7 shrink-0" aria-hidden="true" />
                )
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

                <CustomerChatAttachmentList attachments={allAttachments} isSent={isSent} onImageClick={(idx) => setLightboxIndex(idx)} />
                {hasText && <CustomerChatTextBubble text={msg.text || ''} isSent={isSent} />}

                <div className={`flex items-center gap-1.5 mt-1 px-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 ${isSent ? 'justify-end' : 'justify-start'}`}>
                    {msg.isPinned && (
                        <Pin size={10} className="text-amber-500 fill-amber-500 mr-0.5 shrink-0 rotate-45" />
                    )}
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
