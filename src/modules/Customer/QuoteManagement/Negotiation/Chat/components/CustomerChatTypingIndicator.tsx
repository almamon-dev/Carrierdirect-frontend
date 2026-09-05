import React from 'react';
import { CustomerChatItem } from '../types';

interface CustomerChatTypingIndicatorProps {
    isSupplierTyping: boolean;
    activeChat: CustomerChatItem | null;
}

export const CustomerChatTypingIndicator: React.FC<CustomerChatTypingIndicatorProps> = ({
    isSupplierTyping,
    activeChat,
}) => {
    if (!isSupplierTyping || !activeChat) return null;

    return (
        <div className="flex gap-2.5 justify-start mt-3 mb-3 items-center animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs shrink-0 shadow-2xs">
                {activeChat.avatar ? (
                    <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                ) : (
                    <span>{(activeChat.name || 'S').charAt(0).toUpperCase()}</span>
                )}
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-2xs border border-slate-200/80 dark:border-slate-700">
                <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[#00a884] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {activeChat.name} is typing...
            </span>
        </div>
    );
};
