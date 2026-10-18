import React from 'react';
import { Check, CheckCheck, Pin } from 'lucide-react';
import { GeneralMessage } from '@/services/messageService';

interface GeneralChatBubbleTimeStatusProps {
    msg: GeneralMessage;
    isSent: boolean;
    isPinned: boolean;
}

export const GeneralChatBubbleTimeStatus: React.FC<GeneralChatBubbleTimeStatusProps> = ({
    msg,
    isSent,
    isPinned,
}) => (
    <div className={`flex items-center gap-1 mt-0.5 px-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
        {isPinned && <Pin size={10} className="text-amber-500 fill-amber-500 mr-0.5 shrink-0" />}
        {Boolean(msg.is_edited) && (
            <span className="text-[9.5px] text-slate-400 dark:text-slate-400 select-none italic mr-0.5">(edited)</span>
        )}
        <span className="text-[10px] text-slate-400 dark:text-slate-400 select-none">
            {msg.time || msg.created_at_human || 'Just now'}
        </span>
        {isSent && (
            <span className="text-slate-400 dark:text-slate-400 shrink-0">
                {msg.is_read ? <CheckCheck size={13} className="text-[#38bdf8]" /> : <Check size={13} className="text-slate-400" />}
            </span>
        )}
    </div>
);
