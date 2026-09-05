import React, { useState } from 'react';
import { shortenUrl } from '../../utils/customerChatUtils';

interface CustomerChatTextBubbleProps {
    text: string;
    isSent: boolean;
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

export const CustomerChatTextBubble: React.FC<CustomerChatTextBubbleProps> = ({ text, isSent }) => {
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
        <div className={`relative px-3.5 py-2.5 text-[13.5px] leading-relaxed break-words [overflow-wrap:anywhere] max-w-full rounded-sm ${
            isSent
                ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] border border-emerald-200/60 dark:border-emerald-700/30 shadow-2xs font-medium'
                : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs font-medium'
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
            </div>
        </div>
    );
};
