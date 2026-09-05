import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { ChatMessage } from '../../types';

interface ChatBubbleStatusFooterProps {
    msg: ChatMessage;
    isSent: boolean;
}

export const ChatBubbleStatusFooter: React.FC<ChatBubbleStatusFooterProps> = ({ msg, isSent }) => (
    <div className={`flex items-center gap-1.5 mt-1 px-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 ${isSent ? 'justify-end' : 'justify-start'}`}>
        <span>{msg.time}</span>
        {msg.isEdited && <span className="italic text-[9.5px]">(edited)</span>}
        {isSent && (
            (msg.seen === true || msg.deliveryStatus === 'seen' || msg.isRead === true) ? (
                <span className="inline-flex items-center gap-0.5 text-sky-500 font-semibold ml-1">
                    <span>• Seen</span>
                    <CheckCheck size={13} className="text-sky-500 inline-block ml-0.5" />
                </span>
            ) : msg.deliveryStatus === 'delivered' ? (
                <span className="inline-flex items-center gap-0.5 text-slate-400 font-medium ml-1">
                    <span>• Delivered</span>
                    <CheckCheck size={13} className="text-slate-400 inline-block ml-0.5" />
                </span>
            ) : (
                <span className="inline-flex items-center gap-0.5 text-slate-400 font-medium ml-1">
                    <span>• Sent</span>
                    <Check size={13} className="text-slate-400 inline-block ml-0.5" />
                </span>
            )
        )}
    </div>
);
