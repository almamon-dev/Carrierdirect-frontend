import React, { useState } from 'react';
import { ExternalLink, Check, CheckCheck, Pin } from 'lucide-react';
import { LinkPreviewData, shortenUrl } from './chatLinkUtils';

interface ChatTextBubbleProps {
    text: string;
    isSent: boolean;
    linkPreview?: LinkPreviewData | null;
    time?: string;
    isPinned?: boolean;
    isEdited?: boolean;
    isSeen?: boolean;
    isDelivered?: boolean;
}

const renderMessageTextWithLinks = (text: string, isSent: boolean) => {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
        if (part.match(urlRegex)) {
            const displayUrl = shortenUrl(part, 42);
            return (
                <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noreferrer"
                    className={`underline break-all transition-opacity font-semibold ${
                        isSent ? 'text-emerald-900 hover:text-emerald-950 dark:text-emerald-200' : 'text-blue-600 hover:text-blue-700'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                    title={part}
                >
                    {displayUrl}
                </a>
            );
        }
        return part;
    });
};

export const ChatTextBubble: React.FC<ChatTextBubbleProps> = ({
    text,
    isSent,
    linkPreview,
    time,
    isPinned,
    isEdited,
    isSeen,
    isDelivered,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongText = Boolean(text && text.length > 280);

    const displayedText = (() => {
        if (!isLongText || isExpanded) return text || '';
        const sub = text.slice(0, 220);
        const lastSpace = sub.lastIndexOf(' ');
        const cleanSub = lastSpace > 160 ? sub.slice(0, lastSpace) : sub;
        return `${cleanSub.trim()}...`;
    })();

    return (
        <div className={`relative px-3.5 py-2 text-[13.5px] leading-relaxed break-words [overflow-wrap:anywhere] w-fit max-w-full ${linkPreview ? 'max-w-[340px] sm:max-w-[380px]' : ''} shadow-2xs font-normal ${
            isSent
                ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] border border-emerald-200/60 dark:border-emerald-700/30 rounded-[4px]'
                : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] border border-slate-200/80 dark:border-slate-700/60 rounded-[4px]'
        }`}>
            {linkPreview && (
                <a
                    href={linkPreview.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`block rounded-lg overflow-hidden mb-2.5 transition-all hover:opacity-95 text-left border-l-4 group/link cursor-pointer ${
                        isSent
                            ? 'bg-black/5 dark:bg-black/20 text-[#111b21] dark:text-[#e9edef] border-emerald-500'
                            : 'bg-black/5 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-emerald-500'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {linkPreview.image && (
                        <div className="w-full h-32 sm:h-36 overflow-hidden bg-black/10 relative">
                            <img
                                src={linkPreview.image}
                                alt={linkPreview.title}
                                className="w-full h-full object-cover group-hover/link:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white rounded-full p-1.5 shadow-xs">
                                <ExternalLink size={12} />
                            </div>
                        </div>
                    )}
                    <div className="p-2.5">
                        <h4 className="text-[13.5px] font-bold truncate leading-snug">{linkPreview.domain.toLowerCase()}</h4>
                        <p className={`text-xs ${isSent ? 'text-slate-600 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'} truncate mt-0.5 underline`}>
                            {linkPreview.url}
                        </p>
                        <p className={`text-[11px] ${isSent ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'} line-clamp-1 mt-0.5 font-normal`}>
                            {linkPreview.description || linkPreview.title}
                        </p>
                    </div>
                </a>
            )}

            <div className="break-words [overflow-wrap:anywhere]">
                <span className="whitespace-pre-wrap">{renderMessageTextWithLinks(displayedText, isSent)}</span>
                {isLongText && !isExpanded && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className={`inline font-bold text-xs cursor-pointer hover:underline select-none ml-1 ${
                            isSent ? 'text-emerald-700 dark:text-emerald-300' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                    >
                        Read more
                    </button>
                )}
                {time && (
                    <span className="float-right ml-3.5 mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-normal text-slate-400 dark:text-slate-400 select-none align-bottom">
                        {isPinned && <Pin size={10} className="text-amber-500 fill-amber-500 mr-0.5 shrink-0 rotate-45" />}
                        <span>{time}</span>
                        {isEdited && <span className="italic text-[9px]">(edited)</span>}
                        {isSent && (
                            isSeen ? (
                                <CheckCheck size={14} className="text-[#38bdf8] shrink-0" />
                            ) : isDelivered ? (
                                <CheckCheck size={14} className="text-slate-400 shrink-0" />
                            ) : (
                                <Check size={14} className="text-slate-400 shrink-0" />
                            )
                        )}
                    </span>
                )}
            </div>
        </div>
    );
};
