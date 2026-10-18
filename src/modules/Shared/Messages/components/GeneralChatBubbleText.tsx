import React from 'react';
import { Check, CheckCheck, CornerUpLeft, Pin } from 'lucide-react';
import { GeneralMessage } from '@/services/messageService';

interface GeneralChatBubbleTextProps {
    msg: GeneralMessage;
    isSent: boolean;
    partnerDisplayName: string;
    displayedText: string;
    isLongText: boolean;
    isExpanded: boolean;
    setIsExpanded: (val: boolean) => void;
    isPinned: boolean;
    borderRadiusClasses: string;
    onJumpToTarget: (e: React.MouseEvent, targetId?: number | string | null, snippet?: string | null) => void;
}

export const GeneralChatBubbleText: React.FC<GeneralChatBubbleTextProps> = ({
    msg,
    isSent,
    partnerDisplayName,
    displayedText,
    isLongText,
    isExpanded,
    setIsExpanded,
    isPinned,
    borderRadiusClasses,
    onJumpToTarget,
}) => {
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
            className={`relative px-3.5 py-2 text-[13.5px] leading-relaxed break-words [overflow-wrap:anywhere] w-fit max-w-full ${borderRadiusClasses} shadow-2xs font-normal ${
                isSent
                    ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] border border-emerald-200/60 dark:border-emerald-700/30'
                    : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] border border-slate-200/80 dark:border-slate-700/60'
            }`}
        >
            {quoteSnippet && (
                <div
                    onClick={(e) => onJumpToTarget(e, targetMsgId, quoteSnippet)}
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
                <span className="whitespace-pre-wrap">{cleanText}</span>
                {isLongText && !isExpanded && (
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
                <span className="float-right ml-3.5 mt-1.5 inline-flex items-center gap-1 text-[10px] font-normal text-slate-400 dark:text-slate-400 select-none align-bottom">
                    {isPinned && <Pin size={10} className="text-amber-500 fill-amber-500 mr-0.5 shrink-0" />}
                    {Boolean(msg.is_edited) && (
                        <span className="text-[9px] italic mr-0.5">
                            (edited)
                        </span>
                    )}
                    <span>
                        {msg.time || msg.created_at_human || 'Just now'}
                    </span>
                    {isSent && (
                        msg.is_read ? (
                            <CheckCheck size={13} className="text-[#38bdf8] shrink-0" />
                        ) : (
                            <Check size={13} className="text-slate-400 shrink-0" />
                        )
                    )}
                </span>
            </div>
        </div>
    );
};
