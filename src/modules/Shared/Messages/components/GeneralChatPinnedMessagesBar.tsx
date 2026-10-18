import React from 'react';
import { Pin, X } from 'lucide-react';
import { GeneralMessage } from '@/services/messageService';

interface GeneralChatPinnedMessagesBarProps {
    messages: GeneralMessage[];
    onOpenAllPinned: () => void;
    onTogglePin: (messageId: number | string) => void;
}

export const GeneralChatPinnedMessagesBar: React.FC<GeneralChatPinnedMessagesBarProps> = ({
    messages,
    onOpenAllPinned,
    onTogglePin,
}) => {
    const pinnedMessages = messages.filter((m) => Boolean(m.is_pinned));
    if (pinnedMessages.length === 0) return null;
    const latestPinned = pinnedMessages[pinnedMessages.length - 1];

    const handleJumpToPinned = () => {
        const el = document.getElementById(`msg-${latestPinned.id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.remove('highlight-pulse-message');
            void el.offsetWidth;
            el.classList.add('highlight-pulse-message');
            setTimeout(() => el.classList.remove('highlight-pulse-message'), 1800);
        }
    };

    return (
        <div className="px-4 py-2 bg-slate-50/95 dark:bg-[#151a21] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between z-10 animate-in fade-in">
            <div
                onClick={handleJumpToPinned}
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer hover:opacity-85 transition-opacity select-none"
                title="Click to view pinned message"
            >
                <Pin size={13} className="text-amber-500 fill-amber-500 shrink-0" />
                <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight flex items-center gap-1.5">
                        <span>Pinned Message</span>
                        {pinnedMessages.length > 1 && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenAllPinned();
                                }}
                                className="text-[10px] px-1.5 py-0.2 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full font-bold hover:bg-amber-200 transition-colors"
                                title="View all pinned messages in details panel"
                            >
                                {pinnedMessages.length} pinned (view all)
                            </span>
                        )}
                    </div>
                    <div className="text-[12px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                        {latestPinned.message || (latestPinned.attachments?.length ? 'Attachment' : 'Message')}
                    </div>
                </div>
            </div>
            <button
                type="button"
                onClick={() => onTogglePin(latestPinned.id)}
                className="text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 p-1 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer transition-colors shrink-0 ml-2"
                title="Unpin message"
            >
                <X size={14} />
            </button>
        </div>
    );
};
