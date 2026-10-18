import React from 'react';
import { CornerUpLeft, Edit2, X } from 'lucide-react';
import { GeneralMessage } from '@/services/messageService';

interface GeneralChatEditReplyBannersProps {
    editingMessage: GeneralMessage | null;
    replyingTo: GeneralMessage | null;
    partnerName?: string;
    onCancelEdit?: () => void;
    onCancelReply?: () => void;
}

export const GeneralChatEditReplyBanners: React.FC<GeneralChatEditReplyBannersProps> = ({
    editingMessage,
    replyingTo,
    partnerName = 'User',
    onCancelEdit,
    onCancelReply,
}) => {
    if (editingMessage) {
        return (
            <div className="mb-2 px-1 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <Edit2 size={13} className="text-slate-500 dark:text-slate-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">Edit Message</div>
                        <div className="text-[12px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                            {editingMessage.message}
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onCancelEdit}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors shrink-0"
                    title="Cancel edit (Esc)"
                >
                    <X size={15} />
                </button>
            </div>
        );
    }

    if (replyingTo) {
        return (
            <div className="mb-2 px-1 flex items-center justify-between text-xs animate-in fade-in">
                <div
                    onClick={() => {
                        const el = document.getElementById(`msg-${replyingTo.id}`);
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.classList.add('highlight-pulse-message');
                            setTimeout(() => el.classList.remove('highlight-pulse-message'), 1800);
                        }
                    }}
                    className="flex items-center gap-2.5 min-w-0 flex-1 mr-2 cursor-pointer hover:opacity-80 transition-opacity select-none"
                    title="Click to view original message"
                >
                    <CornerUpLeft size={13} className="text-slate-500 dark:text-slate-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                            Replying to {replyingTo.is_me ? 'yourself' : partnerName}
                        </div>
                        <div className="text-[12px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                            {replyingTo.message || 'Attachment'}
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onCancelReply}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors shrink-0"
                    title="Cancel reply"
                >
                    <X size={15} />
                </button>
            </div>
        );
    }

    return null;
};
