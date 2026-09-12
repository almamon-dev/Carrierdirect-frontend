import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
    Check,
    CheckCheck,
    CornerUpLeft,
    Download,
    Edit2,
    Flag,
    MoreVertical,
    Pin,
    Trash2,
    X
} from 'lucide-react';
import { ConversationUser, GeneralMessage, MessageAttachment } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { parseRawAttachments } from '@/hooks/useGeneralMessages';

interface GeneralChatMessageBubbleProps {
    msg: GeneralMessage;
    partner?: ConversationUser | null;
    isFirstInGroup?: boolean;
    isLastInGroup?: boolean;
    onStartEdit?: (msg: GeneralMessage) => void;
    onDelete?: (id: number) => void;
    onOpenImageLightbox?: (images: MessageAttachment[], index: number) => void;
    onReply?: (msg: GeneralMessage) => void;
    onToggleReaction?: (id: number | string, emoji: string) => void;
    onTogglePin?: (id: number | string) => void;
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
    onStartEdit,
    onDelete,
    onOpenImageLightbox,
    onReply,
    onToggleReaction,
    onTogglePin
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPlacement, setMenuPlacement] = useState<'top' | 'bottom'>('top');
    const [localPinned, setLocalPinned] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

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

    const borderRadiusClasses = 'rounded-2xl';

    const partnerDisplayName = partner?.company_name || partner?.name || 'User';
    const partnerInitial = partnerDisplayName.charAt(0).toUpperCase();
    const partnerAvatarUrl = getAttachmentUrl(partner?.avatar);
    const isPinned = Boolean(msg.is_pinned || (msg as any).is_pinned || localPinned);

    // Smart placement check: accurately calculates available space above inside the scroll container
    useLayoutEffect(() => {
        if (isMenuOpen && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const scrollContainer = menuRef.current.closest('.overflow-y-auto');
            const containerTop = scrollContainer ? scrollContainer.getBoundingClientRect().top : 0;
            const spaceAbove = rect.top - containerTop;
            if (spaceAbove < 190) {
                setMenuPlacement('bottom');
            } else {
                setMenuPlacement('top');
            }
        }
    }, [isMenuOpen]);



    // Close menu when clicking outside
    useEffect(() => {
        if (!isMenuOpen) return;
        const handleMenuClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleMenuClickOutside);
        return () => document.removeEventListener('mousedown', handleMenuClickOutside);
    }, [isMenuOpen]);



    const handleEditClick = () => {
        setIsMenuOpen(false);
        if (onStartEdit) {
            onStartEdit(msg);
        }
    };



    const handleTogglePin = () => {
        if (onTogglePin) {
            onTogglePin(msg.id);
        } else {
            setLocalPinned(prev => !prev);
        }
        setIsMenuOpen(false);
    };



    const handleReplyClick = () => {
        setIsMenuOpen(false);
        if (onReply) {
            onReply(msg);
        }
    };

    const handleJumpToTarget = (e: React.MouseEvent, targetId?: number | string | null, snippet?: string | null) => {
        e.stopPropagation();

        let targetEl: HTMLElement | null = null;
        if (targetId) {
            targetEl = document.getElementById(`msg-${targetId}`);
        }

        if (!targetEl && snippet) {
            const cleanSnippet = snippet.trim().toLowerCase();
            const allMsgElements = document.querySelectorAll('[data-msg-text]');
            for (const el of Array.from(allMsgElements)) {
                const t = (el.getAttribute('data-msg-text') || '').trim().toLowerCase();
                if (t && (t.includes(cleanSnippet) || cleanSnippet.includes(t.slice(0, 30)))) {
                    targetEl = el as HTMLElement;
                    break;
                }
            }
        }

        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetEl.classList.remove('highlight-pulse-message');
            void targetEl.offsetWidth; // Force DOM reflow to restart CSS animation
            targetEl.classList.add('highlight-pulse-message');
            setTimeout(() => {
                targetEl?.classList.remove('highlight-pulse-message');
            }, 1800);
        }
    };

    const handleDelete = () => {
        setIsMenuOpen(false);
        if (onDelete) {
            onDelete(msg.id);
        }
    };

    // Action Toolbar (Buttons on hover)
    const renderActionToolbar = () => (
        <div
            className={`self-center shrink-0 flex items-center gap-1 transition-opacity duration-150 ${
                isMenuOpen ? 'opacity-100 z-50' : 'opacity-0 group-hover:opacity-100 z-20'
            }`}
        >
            {isSent ? (
                <>
                    {/* 1. More options (3 vertical dots) */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                                isMenuOpen
                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                            title="More options"
                        >
                            <MoreVertical size={14} />
                        </button>

                        {/* Light/Dark theme-adaptive Popover Modal Menu */}
                        {isMenuOpen && (
                            <div
                                className={`absolute left-1/2 -translate-x-1/2 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 rounded-2xl p-1.5 shadow-xl border border-slate-200/90 dark:border-slate-700 min-w-[155px] z-50 animate-in zoom-in-95 fade-in-0 duration-150 ${
                                    menuPlacement === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'
                                }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Pointer Arrow */}
                                {menuPlacement === 'top' ? (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-white dark:border-t-[#1e293b]" />
                                ) : (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-white dark:border-b-[#1e293b]" />
                                )}

                                {/* Unsend Option */}
                                {onDelete && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left text-[13px] font-medium"
                                    >
                                        <span>Unsend</span>
                                        <Trash2 size={14} className="text-red-500 shrink-0" />
                                    </button>
                                )}

                                {/* Edit Option (Telegram Style: Loads into input bar) */}
                                {onStartEdit && hasText && (
                                    <button
                                        type="button"
                                        onClick={handleEditClick}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left text-[13px] font-medium"
                                    >
                                        <span>Edit</span>
                                        <Edit2 size={14} className="text-slate-500 dark:text-slate-400 shrink-0" />
                                    </button>
                                )}



                                {/* Pin Option */}
                                <button
                                    type="button"
                                    onClick={handleTogglePin}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left text-[13px] font-medium"
                                >
                                    <span>{isPinned ? 'Unpin' : 'Pin'}</span>
                                    <Pin size={14} className={`shrink-0 ${isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-500 dark:text-slate-400'}`} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 2. Reply button */}
                    <button
                        type="button"
                        onClick={handleReplyClick}
                        className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Reply"
                    >
                        <CornerUpLeft size={14} />
                    </button>
                </>
            ) : (
                <>
                    {/* 1. Reply button */}
                    <button
                        type="button"
                        onClick={handleReplyClick}
                        className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Reply"
                    >
                        <CornerUpLeft size={14} />
                    </button>

                    {/* 2. More options (3 vertical dots) */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                                isMenuOpen
                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                            title="More options"
                        >
                            <MoreVertical size={14} />
                        </button>

                        {/* Light/Dark Popover Modal Menu */}
                        {isMenuOpen && (
                            <div
                                className={`absolute left-1/2 -translate-x-1/2 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 rounded-2xl p-1.5 shadow-xl border border-slate-200/90 dark:border-slate-700 min-w-[155px] z-50 animate-in zoom-in-95 fade-in-0 duration-150 ${
                                    menuPlacement === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'
                                }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Pointer Arrow */}
                                {menuPlacement === 'top' ? (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-white dark:border-t-[#1e293b]" />
                                ) : (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-white dark:border-b-[#1e293b]" />
                                )}



                                {/* Pin Option */}
                                <button
                                    type="button"
                                    onClick={handleTogglePin}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left text-[13px] font-medium"
                                >
                                    <span>{isPinned ? 'Unpin' : 'Pin'}</span>
                                    <Pin size={14} className={`shrink-0 ${isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-500 dark:text-slate-400'}`} />
                                </button>

                                {/* Report Option */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        alert('Message reported to administrator.');
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left text-[13px] font-medium"
                                >
                                    <span>Report</span>
                                    <Flag size={14} className="text-slate-500 dark:text-slate-400 shrink-0" />
                                </button>

                                {/* Delete Option */}
                                {onDelete && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left text-[13px] font-medium"
                                    >
                                        <span>Delete</span>
                                        <Trash2 size={14} className="text-red-500 shrink-0" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div
            id={`msg-${msg.id}`}
            data-msg-id={msg.id}
            data-msg-text={rawText}
            className={`flex gap-2 my-1 ${isSent ? 'justify-end' : 'justify-start'} group relative font-sans items-end rounded-2xl transition-all duration-300`}
            style={{ zIndex: isMenuOpen ? 40 : 1 }}
        >
            {/* Facebook Messenger Action Toolbar for Sent Messages (on left of bubble) */}
            {isSent && renderActionToolbar()}

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

            <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%] md:max-w-[65%] relative`}>
                {/* Image Attachments */}
                {imageAttachments.length > 0 && (
                    <div className={`${hasText || nonImageAttachments.length > 0 ? 'mb-1.5' : ''}`}>
                        {imageAttachments.length === 1 ? (
                            <div
                                onClick={() => onOpenImageLightbox?.(imageAttachments, 0)}
                                className="rounded-2xl overflow-hidden inline-block shadow-xs hover:opacity-95 transition-opacity max-w-[240px] sm:max-w-[280px] cursor-pointer"
                            >
                                <img
                                    src={imageAttachments[0].url}
                                    alt={imageAttachments[0].name || 'Photo'}
                                    className="w-auto h-auto max-w-[240px] sm:max-w-[280px] max-h-[280px] object-cover rounded-2xl block"
                                    loading="eager"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden max-w-[260px] sm:max-w-[300px] shadow-xs bg-slate-100 dark:bg-slate-800 p-1">
                                {imageAttachments.slice(0, 4).map((att, idx) => {
                                    const isFourthAndMore = idx === 3 && imageAttachments.length > 4;
                                    const remainingCount = imageAttachments.length - 3;

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => onOpenImageLightbox?.(imageAttachments, idx)}
                                            className="relative aspect-square overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-xl cursor-pointer group"
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
                                    className={`flex items-center gap-3 p-2 rounded-xl border transition-all hover:scale-[1.01] max-w-[280px] sm:max-w-[320px] ${isSent
                                        ? 'bg-[#d9fdd3] dark:bg-[#005c4b] border-emerald-200/70 dark:border-emerald-700/40 text-slate-900 dark:text-slate-100'
                                        : 'bg-white dark:bg-[#202c33] border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100'
                                        }`}
                                >
                                    <div className={`w-7 h-7 ${badgeColor} rounded-lg flex items-center justify-center text-white font-semibold text-[10px] shrink-0 shadow-2xs`}>
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

                {/* Text Bubble with Quoted Reply Support */}
                {hasText && (() => {
                    const replyTarget = msg.reply_to;
                    let quoteSnippet: string | null = null;
                    let cleanText = displayedText;

                    if (replyTarget) {
                        quoteSnippet = replyTarget.message || (replyTarget.message_type === 'image' ? 'Photo' : 'Attachment');
                    } else if (displayedText.startsWith('Replying to: "')) {
                        const endQuoteIdx = displayedText.indexOf("\"\n");
                        if (endQuoteIdx !== -1) {
                            quoteSnippet = displayedText.slice(14, endQuoteIdx);
                            cleanText = displayedText.slice(endQuoteIdx + 2);
                        }
                    }

                    const replySenderName = replyTarget
                        ? (replyTarget.is_me ? 'You' : (partnerDisplayName || 'Partner'))
                        : 'Reply';
                    const targetMsgId = msg.reply_to_id || replyTarget?.id;

                    return (
                        <div
                            className={`relative px-3.5 py-2.5 text-[13.5px] leading-relaxed break-words [overflow-wrap:anywhere] max-w-full ${borderRadiusClasses} ${isSent
                                ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] border border-emerald-200/60 dark:border-emerald-700/30 shadow-2xs font-medium'
                                : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs font-medium'
                                }`}
                        >
                            {quoteSnippet && (
                                <div
                                    onClick={(e) => handleJumpToTarget(e, targetMsgId, quoteSnippet)}
                                    role="button"
                                    tabIndex={0}
                                    title="Click to view original message"
                                    className={`mb-1.5 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all duration-150 active:scale-[0.98] select-none hover:opacity-85 ${
                                        isSent ? 'bg-black/5 dark:bg-black/25' : 'bg-slate-100 dark:bg-slate-800/80'
                                    }`}
                                >
                                    <p className="text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                                        <CornerUpLeft size={10} className="shrink-0" />
                                        <span>{replySenderName}</span>
                                    </p>
                                    <p className="text-[11.5px] text-slate-600 dark:text-slate-300 truncate mt-0.5">{quoteSnippet}</p>
                                </div>
                            )}
                            <div className="break-words [overflow-wrap:anywhere]">
                                <span className="whitespace-pre-wrap">{cleanText}</span>{isLongText && !isExpanded && (
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
                    );
                })()}

                {/* Time, Pin & Delivery status */}
                <div className={`flex items-center gap-1 mt-0.5 px-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
                    {isPinned && (
                        <Pin size={10} className="text-amber-500 fill-amber-500 mr-0.5 shrink-0" />
                    )}
                    {msg.is_edited && (
                        <span className="text-[9.5px] text-slate-400 dark:text-slate-400 select-none italic mr-0.5">
                            (edited)
                        </span>
                    )}
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

            {/* Facebook Messenger Action Toolbar for Received Messages (on right of bubble) */}
            {!isSent && renderActionToolbar()}
        </div>
    );
};

export default GeneralChatMessageBubble;
