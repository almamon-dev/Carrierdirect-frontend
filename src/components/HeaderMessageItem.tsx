import React from 'react';
import { ConversationPartnerItem } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { formatChatTime } from './headerMessagesUtils';

interface HeaderMessageItemProps {
    item: ConversationPartnerItem;
    onSelect: (partner: ConversationPartnerItem) => void;
}

export const HeaderMessageItem: React.FC<HeaderMessageItemProps> = ({ item, onSelect }) => {
    const displayName = item.user.company_name || item.user.name || 'User';
    const userInitials = (item.user.name || 'U').slice(0, 2).toUpperCase();
    const isUnread = item.unread_count > 0;
    const isMe = item.last_message?.is_me;
    const formattedTime = formatChatTime(item.last_message_at, item.last_message);

    return (
        <div
            onClick={() => onSelect(item)}
            className={`p-3 flex items-start gap-3 cursor-pointer transition-colors group ${
                isUnread
                    ? 'bg-orange-50/40 dark:bg-orange-950/20 hover:bg-orange-50/70 dark:hover:bg-orange-950/30'
                    : 'hover:bg-slate-50 dark:hover:bg-[#1c2128]'
            }`}
        >
            <div className="relative shrink-0">
                {item.user.avatar ? (
                    <img
                        src={getAttachmentUrl(item.user.avatar)}
                        alt={displayName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                        {userInitials}
                    </div>
                )}
                {item.unread_count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#FF4A1F] rounded-full ring-2 ring-white dark:ring-[#161b22]" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <p className={`text-xs truncate ${isUnread ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-800 dark:text-slate-200'}`}>
                            {displayName}
                        </p>
                        {item.user.user_type && (
                            <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.2 rounded shrink-0 capitalize">
                                {item.user.user_type}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {formattedTime}
                    </span>
                </div>

                <p className={`text-[11.5px] truncate mt-0.5 ${isUnread ? 'font-semibold text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {isMe && <span className="text-slate-400 font-normal">You: </span>}
                    {item.last_message?.message || (item.last_message ? 'Sent an attachment' : 'No messages yet')}
                </p>
            </div>
        </div>
    );
};
