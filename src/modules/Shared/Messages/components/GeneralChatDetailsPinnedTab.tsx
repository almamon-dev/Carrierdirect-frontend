import React from 'react';
import { Pin, X } from 'lucide-react';
import { GeneralMessage } from '@/services/messageService';

interface GeneralChatDetailsPinnedTabProps {
    pinnedMessages: GeneralMessage[];
    displayName: string;
    onTogglePin?: (messageId: number | string) => void;
}

export const GeneralChatDetailsPinnedTab: React.FC<GeneralChatDetailsPinnedTabProps> = ({
    pinnedMessages,
    displayName,
    onTogglePin,
}) => {
    return (
        <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-[12px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Pin size={13} className="text-amber-500 fill-amber-500" />
                    <span>Pinned Messages ({pinnedMessages.length})</span>
                </h4>
            </div>

            {pinnedMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-amber-500">
                        <Pin size={18} />
                    </div>
                    <p className="text-xs font-medium">No pinned messages yet.</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed px-4">
                        Hover over any message and click Pin in the menu to access it quickly here.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {pinnedMessages.map((pMsg) => {
                        const senderName = pMsg.is_me ? 'You' : displayName;
                        return (
                            <div
                                key={pMsg.id}
                                onClick={() => {
                                    const el = document.getElementById(`msg-${pMsg.id}`);
                                    if (el) {
                                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        el.classList.remove('highlight-pulse-message');
                                        void el.offsetWidth;
                                        el.classList.add('highlight-pulse-message');
                                        setTimeout(() => el.classList.remove('highlight-pulse-message'), 1800);
                                    }
                                }}
                                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all flex items-start justify-between gap-2 group cursor-pointer"
                                title="Click to jump to this message"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate">
                                            {senderName}
                                        </span>
                                        <span className="text-[10px] text-slate-400 shrink-0">
                                            {pMsg.time || pMsg.created_at_human || 'Pinned'}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-slate-700 dark:text-slate-200 line-clamp-3 leading-relaxed break-words font-medium">
                                        {pMsg.message || (pMsg.attachments?.length ? 'Shared Attachment' : 'Pinned Message')}
                                    </p>
                                </div>
                                {onTogglePin && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTogglePin(pMsg.id);
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors shrink-0"
                                        title="Unpin message"
                                    >
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
