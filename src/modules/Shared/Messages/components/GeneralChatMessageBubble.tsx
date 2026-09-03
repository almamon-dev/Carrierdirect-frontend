import React, { useState } from 'react';
import {
    Check,
    CheckCheck,
    Download,
    Trash2
} from 'lucide-react';
import { ConversationUser, GeneralMessage, MessageAttachment } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

import { parseRawAttachments } from '@/hooks/useGeneralMessages';

interface GeneralChatMessageBubbleProps {
    msg: GeneralMessage;
    partner?: ConversationUser | null;
    isFirstInGroup?: boolean;
    isLastInGroup?: boolean;
    onDelete?: (id: number) => void;
    onOpenImageLightbox?: (images: MessageAttachment[], index: number) => void;
}

export const isImageAttachment = (att: MessageAttachment | any): boolean => {
    if (!att) return false;
    if (att.type === 'image') return true;
    if (typeof att.mime_type === 'string' && att.mime_type.startsWith('image/')) return true;
    if (typeof att.mime === 'string' && att.mime.startsWith('image/')) return true;
    const name = String(att.name || att.file_name || att.filename || '').trim();
    if (/\.(jpg|jpeg|png|webp|gif|svg|bmp|avif)($|\?)/i.test(name)) return true;
    const url = String(att.url || att.path || '').trim();
    if (url.startsWith('data:image/') || url.startsWith('blob:')) return true;
    if (/\.(jpg|jpeg|png|webp|gif|svg|bmp|avif)($|\?)/i.test(url)) return true;
    return false;
};

export const normalizeAttachment = (att: any): MessageAttachment => {
    if (!att) return { name: 'Attachment', url: '', size: '', type: 'file' };

    if (typeof att === 'string') {
        const url = getAttachmentUrl(att);
        const cleanName = att.split('/').pop()?.split('?')[0] || 'Attachment';
        const isImg = isImageAttachment({ name: cleanName, url });
        return {
            name: cleanName,
            url,
            size: '',
            type: isImg ? 'image' : 'file'
        };
    }

    const rawUrl = att.original_url || att.full_url || att.url || att.file_url || att.download_url || att.path || att.file_path || att.src || att.image_url || att.photo_url || '';
    const url = getAttachmentUrl(rawUrl);
    const cleanName = att.file_name || att.name || att.original_name || att.filename || att.title || (rawUrl ? rawUrl.split('/').pop()?.split('?')[0] : 'Attachment');
    const isImg = isImageAttachment({ ...att, name: cleanName, url });

    return {
        name: String(cleanName || 'Attachment'),
        url: String(url || ''),
        size: att.size || att.file_size || (att.size_bytes ? `${Math.round(att.size_bytes / 1024)} KB` : ''),
        type: isImg ? 'image' : 'file'
    };
};

export const GeneralChatMessageBubble: React.FC<GeneralChatMessageBubbleProps> = ({
    msg,
    partner,
    isFirstInGroup = true,
    isLastInGroup = true,
    onDelete,
    onOpenImageLightbox
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const isSent = msg.is_me;
    const rawText = msg.message || (msg as any).body || (msg as any).content || (msg as any).text || '';
    const isLongText = Boolean(rawText && rawText.length > 280);
    const displayedText = (() => {
        if (!isLongText || isExpanded) return rawText;
        const sub = rawText.slice(0, 220);
        const lastSpace = sub.lastIndexOf(' ');
        const cleanSub = lastSpace > 160 ? sub.slice(0, lastSpace) : sub;
        return `${cleanSub.trim()}...`;
    })();

    const rawAttachments: any[] = parseRawAttachments(msg);

    const allAttachments: MessageAttachment[] = rawAttachments.map(normalizeAttachment);
    const imageAttachments = allAttachments.filter(isImageAttachment);
    const nonImageAttachments = allAttachments.filter(att => !isImageAttachment(att));
    const isOnlyImage = rawAttachments.length > 0 && rawAttachments[0] === rawText;
    const hasText = Boolean(rawText.trim()) && !isOnlyImage;

    const borderRadiusClasses = 'rounded-sm';

    const partnerDisplayName = partner?.company_name || partner?.name || 'User';
    const partnerInitial = partnerDisplayName.charAt(0).toUpperCase();
    const partnerAvatarUrl = getAttachmentUrl(partner?.avatar);

    return (
        <div className={`flex gap-2.5 my-1 ${isSent ? 'justify-end' : 'justify-start'} group relative font-sans items-end`}>
            {/* Action buttons (hover) */}
            {isSent && onDelete && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onDelete(msg.id)}
                        className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete message"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            )}

            {/* Partner Avatar for incoming messages */}
            {!isSent && (
                <div className="shrink-0 mb-1">
                    {partnerAvatarUrl ? (
                        <img
                            src={partnerAvatarUrl}
                            alt={partnerDisplayName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                        />
                    ) : (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] border shadow-2xs ${partner?.user_type === 'supplier'
                            ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F]'
                            : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50 text-[#2563EB]'
                            }`}>
                            {partnerInitial}
                        </div>
                    )}
                </div>
            )}

            <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} max-w-[82%] sm:max-w-[72%] md:max-w-[65%]`}>
                {/* Image Attachments */}
                {imageAttachments.length > 0 && (
                    <div className={`${hasText || nonImageAttachments.length > 0 ? 'mb-1.5' : ''}`}>
                        {imageAttachments.length === 1 ? (
                            <div
                                onClick={() => onOpenImageLightbox?.(imageAttachments, 0)}
                                className="rounded-sm overflow-hidden inline-block shadow-xs hover:opacity-95 transition-opacity max-w-[240px] sm:max-w-[280px] cursor-pointer"
                            >
                                <img
                                    src={imageAttachments[0].url}
                                    alt={imageAttachments[0].name || 'Photo'}
                                    className="w-auto h-auto max-w-[240px] sm:max-w-[280px] max-h-[280px] object-cover rounded-sm block"
                                    loading="eager"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-1 rounded-sm overflow-hidden max-w-[260px] sm:max-w-[300px] shadow-xs bg-slate-100 dark:bg-slate-800 p-1">
                                {imageAttachments.slice(0, 4).map((att, idx) => {
                                    const isFourthAndMore = idx === 3 && imageAttachments.length > 4;
                                    const remainingCount = imageAttachments.length - 3;

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => onOpenImageLightbox?.(imageAttachments, idx)}
                                            className="relative aspect-square overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-sm cursor-pointer group"
                                        >
                                            <img
                                                src={att.url}
                                                alt={att.name || 'Photo'}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                loading="eager"
                                            />
                                            {isFourthAndMore && (
                                                <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex flex-col items-center justify-center text-white font-bold text-lg group-hover:bg-black/75 transition-colors z-10">
                                                    <span>+{remainingCount}</span>
                                                    <span className="text-[10px] font-normal text-slate-200">more</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Non-Image Attachments (PDF, XLS, DOC) */}
                {nonImageAttachments.length > 0 && (
                    <div className={`flex flex-col gap-1.5 ${hasText ? 'mb-1.5' : ''}`}>
                        {nonImageAttachments.map((att, idx) => {
                            const isPdf = att.name.toLowerCase().endsWith('.pdf');
                            const isDoc = att.name.toLowerCase().endsWith('.doc') || att.name.toLowerCase().endsWith('.docx');
                            const isXls = att.name.toLowerCase().endsWith('.xls') || att.name.toLowerCase().endsWith('.xlsx');
                            const badgeColor = isPdf ? 'bg-[#EF4444]' : isXls ? 'bg-[#10B981]' : isDoc ? 'bg-[#2563EB]' : 'bg-[#F97316]';
                            const badgeText = isPdf ? 'PDF' : isXls ? 'XLS' : isDoc ? 'DOC' : 'File';
                            const downloadUrl = att.url || getAttachmentUrl(att.name);

                            return (
                                <a
                                    key={idx}
                                    href={downloadUrl || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-3 p-2 rounded-sm border transition-all hover:scale-[1.01] max-w-[280px] sm:max-w-[320px] ${isSent
                                        ? 'bg-[#d9fdd3] dark:bg-[#005c4b] border-emerald-200/70 dark:border-emerald-700/40 text-slate-900 dark:text-slate-100'
                                        : 'bg-white dark:bg-[#202c33] border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100'
                                        }`}
                                >
                                    <div className={`w-7 h-7 ${badgeColor} rounded-sm flex items-center justify-center text-white font-semibold text-[10px] shrink-0 shadow-2xs`}>
                                        {badgeText}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate leading-tight">{att.name}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{att.size || 'Attachment'}</p>
                                    </div>
                                    <Download size={13} className="text-slate-400 shrink-0" />
                                </a>
                            );
                        })}
                    </div>
                )}

                {/* Text Bubble */}
                {hasText && (
                    <div
                        className={`relative px-3.5 py-2.5 text-[13.5px] leading-relaxed break-words [overflow-wrap:anywhere] max-w-full ${borderRadiusClasses} ${isSent
                            ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] border border-emerald-200/60 dark:border-emerald-700/30 shadow-2xs font-medium'
                            : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs font-medium'
                            }`}
                    >
                        <div className="break-words [overflow-wrap:anywhere]">
                            <span className="whitespace-pre-wrap">{displayedText}</span>{isLongText && !isExpanded && (
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(true)}
                                    className={`inline font-bold text-xs cursor-pointer hover:underline select-none ml-1 ${
                                        isSent
                                            ? 'text-emerald-700 dark:text-emerald-300'
                                            : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                >
                                    Read more
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Time & Delivery status */}
                <div className={`flex items-center gap-1 mt-0.5 px-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 select-none">
                        {msg.time || msg.created_at_human || 'Just now'}
                    </span>
                    {isSent && (
                        <span className="text-slate-400 dark:text-slate-400 shrink-0">
                            {msg.is_read ? (
                                <CheckCheck size={13} className="text-[#38bdf8]" />
                            ) : (
                                <Check size={13} className="text-slate-400" />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GeneralChatMessageBubble;
