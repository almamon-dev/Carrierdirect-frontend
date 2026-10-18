import React from 'react';
import { ConversationPartnerItem, ConversationUser } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { getAvatarBg, getInitials, formatChatTime } from './negotiationChatWidgetUtils';

interface ConversationItemRowProps {
  item: ConversationPartnerItem;
  isActive: boolean;
  onSelect: (user: ConversationUser) => void;
}

export const ConversationItemRow: React.FC<ConversationItemRowProps> = ({
  item,
  isActive,
  onSelect,
}) => {
  const user = item.user;
  const isOnline = Boolean(user.is_online);
  const hasUnread = (item.unread_count || 0) > 0;
  const lastMsg = item.last_message;

  return (
    <div
      onClick={() => onSelect(user)}
      className={`flex items-center gap-3 px-3.5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
        isActive ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
      }`}
    >
      <div className="relative shrink-0">
        {user.avatar ? (
          <img
            src={getAttachmentUrl(user.avatar)}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarBg(
              user.name
            )} text-white font-bold text-xs flex items-center justify-center shadow-xs`}
          >
            {getInitials(user.name)}
          </div>
        )}
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{user.name}</h4>
          {lastMsg && (
            <span className="text-[10px] text-slate-400 shrink-0">
              {formatChatTime(lastMsg.time, lastMsg.created_at_human)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={`text-xs truncate ${
              hasUnread ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {lastMsg?.is_me && <span className="text-slate-400 font-normal mr-1">You:</span>}
            {lastMsg?.message ||
              (lastMsg?.message_type === 'image'
                ? '📷 Photo'
                : lastMsg?.message_type === 'file'
                ? '📎 Attachment'
                : 'No messages yet')}
          </p>
          {hasUnread && (
            <span className="min-w-[18px] h-[18px] px-1 bg-[#ff4a1f] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
              {item.unread_count}
            </span>
          )}
        </div>

        {user.company_name && (
          <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.company_name}</p>
        )}
      </div>
    </div>
  );
};
