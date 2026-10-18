import React from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  ExternalLink,
  X as CloseIcon,
} from 'lucide-react';
import { ConversationPartnerItem, ConversationUser } from '@/services/messageService';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import { getAvatarBg, getInitials } from './negotiationChatWidgetUtils';

interface ChatWidgetActiveHeaderProps {
  activePartner: ConversationUser;
  conversations: ConversationPartnerItem[];
  showSwitchDropdown: boolean;
  setShowSwitchDropdown: (show: boolean | ((p: boolean) => boolean)) => void;
  switchDropdownRef: React.RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onSelectPartner: (user: ConversationUser) => void;
  onNavigateToFullChat: () => void;
  onClose: () => void;
}

export const ChatWidgetActiveHeader: React.FC<ChatWidgetActiveHeaderProps> = ({
  activePartner,
  conversations,
  showSwitchDropdown,
  setShowSwitchDropdown,
  switchDropdownRef,
  onBack,
  onSelectPartner,
  onNavigateToFullChat,
  onClose,
}) => {
  return (
    <div className="px-3.5 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 relative">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onBack}
          className="w-8 h-8 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors cursor-pointer text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
          title="All Conversations"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="relative shrink-0">
          {activePartner.avatar ? (
            <img
              src={getAttachmentUrl(activePartner.avatar)}
              alt={activePartner.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarBg(
                activePartner.name
              )} text-white font-bold text-xs flex items-center justify-center shadow-xs`}
            >
              {getInitials(activePartner.name)}
            </div>
          )}
          {Boolean(activePartner.is_online) && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" />
          )}
        </div>

        <div className="min-w-0">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate leading-tight">
            {activePartner.name}
          </h4>
          <p className="text-[10px] text-slate-400 truncate">
            {activePartner.is_online
              ? 'Active now'
              : activePartner.company_name || activePartner.user_type || 'Direct Message'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <div className="relative" ref={switchDropdownRef}>
          <button
            type="button"
            onClick={() => setShowSwitchDropdown((prev) => !prev)}
            className="h-8 px-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-full flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700 shadow-2xs"
            title="Switch Partner"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#ff4a1f]" />
            <span>Switch</span>
            <span className="w-4 h-4 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-full flex items-center justify-center">
              {conversations.length}
            </span>
          </button>

          {showSwitchDropdown && (
            <div className="absolute right-0 top-10 w-64 sm:w-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in py-1 max-h-72 overflow-y-auto">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
                Switch contact
              </div>
              {conversations.map((c) => (
                <button
                  key={c.user.id}
                  type="button"
                  onClick={() => onSelectPartner(c.user)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    c.user.id === activePartner.id ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarBg(
                      c.user.name
                    )} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}
                  >
                    {getInitials(c.user.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {c.user.name}
                    </p>
                    {c.user.company_name && (
                      <p className="text-[10px] text-slate-400 truncate">
                        {c.user.company_name}
                      </p>
                    )}
                  </div>
                  {c.unread_count > 0 && (
                    <span className="min-w-[16px] h-4 px-1 bg-[#ff4a1f] text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {c.unread_count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onNavigateToFullChat}
          className="w-8 h-8 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors cursor-pointer text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
          title="Open in Full Messages Page"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onClose}
          className="w-8 h-8 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors cursor-pointer text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
          title="Close Window"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
