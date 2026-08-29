import React, { useState } from 'react';
import { FileText, CheckCircle2, XCircle, Check, CheckCheck, Ban, Download, ExternalLink, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/button';
import CounterOfferMessage from '../../CounterOffer';
import { DeclineOfferModal } from './DeclineOfferModal';
import { CustomerChatItem, CustomerChatMessage } from '../types';
import { shortenUrl, getAttachmentUrl } from '../utils/customerChatUtils';
import ChatImage from './ChatImage';

interface CustomerChatMessageBubbleProps {
    msg: CustomerChatMessage;
    activeChat: CustomerChatItem | null;
    isFirstInGroup: boolean;
    isLastInGroup: boolean;
    spacingClass: string;
    onAcceptOffer: (msg: CustomerChatMessage) => void;
    onRejectOffer: (msg: CustomerChatMessage, reason?: string) => void;
    onSendCounterOffer: (amount: number, note: string) => void;
}

export const CustomerChatMessageBubble: React.FC<CustomerChatMessageBubbleProps> = ({
    msg,
    activeChat,
    isFirstInGroup,
    isLastInGroup,
    spacingClass,
    onAcceptOffer,
    onRejectOffer,
    onSendCounterOffer
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // 1. Quote Request Card
    if (msg.type === 'quote_request') {
        const customerName = msg.sender || activeChat?.raw?.customer || 'Customer';
        const quoteNum = msg.quoteNo || activeChat?.quoteNo || 'QT-0001';
        const pickupLoc = activeChat?.origin || 'Pickup Location';
        const deliveryLoc = activeChat?.destination || 'Delivery Destination';
        const dist = activeChat?.distance || '450 km';
        const vehicle = activeChat?.vehicleType || 'Curtainsider 13.6m';
        const initialOffer = Number(msg.newTotal || activeChat?.currentPrice || 0);
        const isAccepted = msg.status === 'accepted';
        const isDeclined = msg.status === 'rejected';

        const pickupDate = (activeChat as any)?.pickupDate || activeChat?.raw?.pickup_date || 'Flexible / Today';
        const deliveryDate = (activeChat as any)?.deliveryDate || activeChat?.raw?.delivery_date || 'Standard Delivery';
        const palletType = (activeChat as any)?.palletType || activeChat?.raw?.pallet_type || 'Standard Euro Pallet';
        const transitTime = activeChat?.raw?.transitTime || activeChat?.raw?.estimated_time || '1 - 2 Business Days';
        const notes = (activeChat as any)?.notes || activeChat?.raw?.notes || activeChat?.raw?.message_snippet || '';

        return (
            <div className={`max-w-md mx-auto my-3 bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-slate-800 dark:text-slate-200 font-sans ${spacingClass}`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center">
                            <FileText size={16} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Quote Details</h4>
                            <p className="text-[10px] text-slate-400 font-medium">{quoteNum} • {customerName}</p>
                        </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#FF4A1F] bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full border border-orange-100 dark:border-orange-900/40">
                        {vehicle}
                    </span>
                </div>

                <div className="py-3 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Pickup</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{pickupLoc}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Delivery</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{deliveryLoc}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-orange-50/50 dark:bg-orange-950/20 rounded-[3px] border border-orange-100 dark:border-orange-900/30">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Initial Quote</span>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{dist}</span>
                        </div>
                        <span className="text-base font-black text-[#FF4A1F]">
                            € {initialOffer.toLocaleString()}
                        </span>
                    </div>

                    {/* Expandable Details / Read More */}
                    {isDetailsOpen && (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-150 text-[11.5px]">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Pickup Date</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{pickupDate}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Delivery Date</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{deliveryDate}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Pallet Type</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{palletType}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Transit Time</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{transitTime}</span>
                                </div>
                            </div>
                            {notes && (
                                <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Notes & Specifications</span>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{notes}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                        className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#FF4A1F] dark:text-slate-400 dark:hover:text-[#FF4A1F] transition-colors py-0.5 cursor-pointer select-none"
                    >
                        <span>{isDetailsOpen ? 'Show less' : 'Read more / View details'}</span>
                        <ChevronDown size={13} className={`transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isAccepted ? (
                        <div className="flex items-center justify-center gap-1.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/50 rounded-[3px] text-xs font-semibold">
                            <CheckCircle2 size={15} className="text-emerald-600" />
                            <span>Offer Accepted</span>
                        </div>
                    ) : isDeclined ? (
                        <div className="flex items-center justify-center gap-1.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50 rounded-[3px] text-xs font-semibold">
                            <XCircle size={15} className="text-rose-600" />
                            <span>Offer Declined</span>
                        </div>
                    ) : (
                        <div className="space-y-1.5 pt-1">
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    onClick={() => onAcceptOffer(msg)}
                                    className="flex-1 h-8 rounded-[3px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1"
                                >
                                    <Check size={13} /> Accept Offer
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => onSendCounterOffer(Math.max(100, initialOffer - 100), '')}
                                    className="flex-1 h-8 rounded-[3px] bg-[#FF4A1F] hover:bg-[#e03e15] text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1"
                                >
                                    Make Counter Offer
                                </Button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDeclineModal(true)}
                                className="w-full text-center text-[11px] font-medium text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 py-1 transition-colors cursor-pointer"
                            >
                                Decline this request
                            </button>
                        </div>
                    )}
                </div>

                <DeclineOfferModal
                    isOpen={showDeclineModal}
                    onClose={() => setShowDeclineModal(false)}
                    offerAmount={initialOffer}
                    currency="€"
                    onConfirm={(reason) => onRejectOffer(msg, reason)}
                />
            </div>
        );
    }

    // 2. Counter Offer Card
    if (msg.type === 'offer') {
        return (
            <div className={spacingClass}>
                <CounterOfferMessage msg={msg} onAccept={onAcceptOffer} onReject={onRejectOffer} />
            </div>
        );
    }

    // 3. System Announcement
    if (msg.type === 'system') {
        return (
            <div className={`flex justify-center ${spacingClass}`}>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-full shadow-2xs">
                    {msg.text || (msg as any).message} • {msg.time}
                </span>
            </div>
        );
    }

    // 4. Standard Message Bubble
    const isSent = msg.type === 'sent';
    const rawText = msg.text || '';
    const isLongText = rawText.length > 280;
    const displayedText = isExpanded || !isLongText ? rawText : `${rawText.slice(0, 260)}...`;

    const allAttachments = msg.attachments || [];
    const imageAttachments = allAttachments.filter(att => att.type === 'image' || (att.url && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(att.url)));
    const nonImageAttachments = allAttachments.filter(att => !imageAttachments.includes(att));
    const hasText = Boolean(rawText.trim());

    let borderRadiusClasses = 'rounded-2xl';
    if (isSent) {
        if (!isFirstInGroup && !isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-tr-sm rounded-br-sm';
        else if (!isFirstInGroup && isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-tr-sm';
        else if (isFirstInGroup && !isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-br-sm';
    } else {
        if (!isFirstInGroup && !isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-tl-sm rounded-bl-sm';
        else if (!isFirstInGroup && isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-tl-sm';
        else if (isFirstInGroup && !isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-bl-sm';
    }

    if (msg.isDeleted) {
        return (
            <div className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass}`}>
                <div className="px-3.5 py-1.5 rounded-2xl text-[12px] italic text-slate-400 border border-slate-200/80 bg-slate-50 flex items-center gap-1.5 font-medium shadow-2xs">
                    <Ban size={13} className="text-slate-400 shrink-0" />
                    <span>{isSent ? 'You deleted this message' : 'This message was deleted'}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass} group relative`}>
            {!isSent && (
                <div className="w-7 h-7 flex-shrink-0 mt-auto">
                    {isLastInGroup && (
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs">
                            {msg.avatar || activeChat?.avatar}
                        </div>
                    )}
                </div>
            )}

            <div
                id={`msg-bubble-${msg.id}`}
                className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] min-w-0 flex flex-col ${isSent ? 'items-end' : 'items-start'} relative group transition-all duration-500`}
            >
                {/* Image Attachments Gallery */}
                {imageAttachments.length > 0 && (
                    <div className={`${hasText || nonImageAttachments.length > 0 ? 'mb-1.5' : ''}`}>
                        {imageAttachments.length === 1 ? (
                            <div
                                onClick={() => setLightboxIndex(0)}
                                className="rounded-2xl overflow-hidden inline-block shadow-xs hover:opacity-95 transition-opacity max-w-[240px] sm:max-w-[280px] cursor-pointer"
                            >
                                <ChatImage
                                    src={imageAttachments[0].url}
                                    alt={imageAttachments[0].name || 'image'}
                                    className="w-auto h-auto max-w-[240px] sm:max-w-[280px] max-h-[300px] object-contain rounded-2xl"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden max-w-[260px] sm:max-w-[300px] shadow-xs">
                                {imageAttachments.slice(0, 4).map((att, idx) => {
                                    const isFourthAndMore = idx === 3 && imageAttachments.length > 4;
                                    const remainingCount = imageAttachments.length - 3;

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setLightboxIndex(idx)}
                                            className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer group"
                                        >
                                            <ChatImage
                                                src={att.url}
                                                alt={att.name || 'image'}
                                                className="w-full h-full object-contain transition-transform group-hover:scale-105"
                                            />
                                            {isFourthAndMore && (
                                                <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex flex-col items-center justify-center text-white font-extrabold text-lg sm:text-xl group-hover:bg-black/75 transition-colors z-20">
                                                    <span>+{remainingCount}</span>
                                                    <span className="text-[10px] font-medium text-slate-200 uppercase tracking-wider mt-0.5">more</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Document / File Attachments */}
                {nonImageAttachments.length > 0 && (
                    <div className={`flex flex-col gap-2 ${hasText ? 'mb-2' : ''}`}>
                        {nonImageAttachments.map((att, idx) => {
                            const isPdf = att.name.toLowerCase().endsWith('.pdf');
                            const isDoc = att.name.toLowerCase().endsWith('.doc') || att.name.toLowerCase().endsWith('.docx');
                            const isXls = att.name.toLowerCase().endsWith('.xls') || att.name.toLowerCase().endsWith('.xlsx');
                            const badgeColor = isPdf ? 'bg-[#EF4444]' : isXls ? 'bg-[#10B981]' : isDoc ? 'bg-[#2563EB]' : 'bg-[#F97316]';
                            const badgeText = isPdf ? 'PDF' : isXls ? 'XLS' : isDoc ? 'DOC' : 'FILE';
                            const cleanDocTitle = att.name.replace(/\.[^/.]+$/, '').toUpperCase();

                            return (
                                <a
                                    key={idx}
                                    href={getAttachmentUrl(att.url) || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`block rounded-2xl overflow-hidden shadow-xs transition-transform hover:scale-[1.01] max-w-[280px] sm:max-w-[320px] text-left cursor-pointer group/doc ${isSent
                                        ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] border border-emerald-200/60 dark:border-emerald-700/30'
                                        : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                                        }`}
                                    title={`Open ${att.name}`}
                                >
                                    <div className="w-full h-28 sm:h-32 bg-white relative overflow-hidden flex flex-col p-3 border-b border-black/5 select-none pointer-events-none">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-2">
                                            <div className="text-[12px] font-black text-slate-800 tracking-wider truncate font-serif">
                                                {cleanDocTitle}
                                            </div>
                                            <div className="flex flex-col items-end gap-0.5 shrink-0 ml-2">
                                                <div className="w-10 h-1 bg-slate-300 rounded-full" />
                                                <div className="w-6 h-1 bg-slate-200 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 opacity-70">
                                            <div className="w-3/4 h-1.5 bg-slate-300 rounded-full" />
                                            <div className="w-full h-1.5 bg-slate-200 rounded-full" />
                                            <div className="w-5/6 h-1.5 bg-slate-200 rounded-full" />
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent" />
                                    </div>

                                    <div className={`p-2.5 sm:p-3 flex items-center gap-3 ${isSent ? 'bg-black/5 dark:bg-black/20' : 'bg-white/90 dark:bg-slate-900/90'}`}>
                                        <div className={`w-7 h-9 ${badgeColor} rounded flex flex-col items-center justify-center text-white shrink-0 shadow-2xs`}>
                                            <span className="text-[9px] font-black tracking-tighter uppercase leading-none">{badgeText}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate leading-snug">
                                                {att.name}
                                            </p>
                                            <p className={`text-[11px] ${isSent ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'} font-normal mt-0.5`}>
                                                1 page • {badgeText} • {att.size || '85 kB'}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )}

                {/* Text Message Bubble */}
                {hasText && (
                    <div className={`relative px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full ${borderRadiusClasses} ${isSent
                        ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] border border-emerald-200/60 dark:border-emerald-700/30 shadow-2xs font-medium'
                        : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs font-medium'
                        }`}>
                        <div className="break-words [overflow-wrap:anywhere]">
                            <span>{displayedText}</span>
                            {isLongText && !isExpanded && (
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(true)}
                                    className={`ml-1 font-bold text-xs cursor-pointer hover:underline inline-block select-none ${isSent ? 'text-emerald-700 dark:text-emerald-300 underline font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                        }`}
                                >
                                    Read more
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Time & Seen Status */}
                <div className={`flex items-center gap-1.5 mt-1 px-1 text-[10.5px] font-medium text-slate-400 dark:text-slate-500 ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.time}</span>
                    {msg.isEdited && <span className="italic text-[9.5px]">(edited)</span>}
                    {isSent && (
                        (msg.seen === true || msg.deliveryStatus === 'seen' || msg.isRead === true) ? (
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
                        )
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && imageAttachments[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        type="button"
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 cursor-pointer"
                        title="Close (Esc)"
                    >
                        <X size={20} />
                    </button>

                    <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <ChatImage
                            src={imageAttachments[lightboxIndex].url}
                            alt={imageAttachments[lightboxIndex].name}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="mt-3 flex items-center justify-between w-full text-white/90 text-xs px-2">
                            <span className="font-semibold truncate max-w-xs">{imageAttachments[lightboxIndex].name}</span>
                            <span>{lightboxIndex + 1} / {imageAttachments.length}</span>
                        </div>
                    </div>

                    {imageAttachments.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : imageAttachments.length - 1));
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) => (prev! < imageAttachments.length - 1 ? prev! + 1 : 0));
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
