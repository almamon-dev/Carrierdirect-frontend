import React, { useState } from 'react';
import { Check, CheckCheck, Pin } from 'lucide-react';
import { shortenUrl } from '../../utils/customerChatUtils';

interface CustomerChatTextBubbleProps {
    text: string;
    isSent: boolean;
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

export const CustomerChatTextBubble: React.FC<CustomerChatTextBubbleProps> = ({
    text,
    isSent,
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
        <div className={`relative px-3.5 py-2 text-[13.5px] leading-relaxed break-words [overflow-wrap:anywhere] w-fit max-w-full shadow-2xs font-normal ${
            isSent
                ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] border border-emerald-200/60 dark:border-emerald-700/30 rounded-[4px]'
                : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] border border-slate-200/80 dark:border-slate-700/60 rounded-[4px]'
        }`}>
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
