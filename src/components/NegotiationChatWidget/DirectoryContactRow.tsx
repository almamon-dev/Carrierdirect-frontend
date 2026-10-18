import React from 'react';
import { ConversationUser } from '@/services/messageService';
import { getAvatarBg, getInitials } from './negotiationChatWidgetUtils';

interface DirectoryContactRowProps {
  user: ConversationUser;
  onStart: (user: ConversationUser) => void;
}

export const DirectoryContactRow: React.FC<DirectoryContactRowProps> = ({
  user,
  onStart,
}) => {
  return (
    <div
      onClick={() => onStart(user)}
      className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarBg(
            user.name
          )} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
        >
          {getInitials(user.name)}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">{user.name}</h4>
          <p className="text-[10px] text-slate-400 truncate">{user.company_name || user.user_type || 'User'}</p>
        </div>
      </div>
      <button
        type="button"
        className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 hover:bg-orange-100 text-[#ff4a1f] border border-orange-200/80 transition-colors shrink-0"
      >
        Chat
      </button>
    </div>
  );
};
