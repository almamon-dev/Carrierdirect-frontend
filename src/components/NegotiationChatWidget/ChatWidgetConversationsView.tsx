import React, { useMemo } from 'react';
import {
  MessageSquare as ChatIcon,
  X as CloseIcon,
  Search,
  RefreshCw,
  Lock,
  Loader2,
} from 'lucide-react';
import { ConversationPartnerItem, ConversationUser } from '@/services/messageService';
import { ConversationItemRow } from './ConversationItemRow';
import { DirectoryContactRow } from './DirectoryContactRow';

interface ChatWidgetConversationsViewProps {
  conversations: ConversationPartnerItem[];
  directoryUsers: ConversationUser[];
  unreadCount: number;
  isLoadingConversations: boolean;
  activePartnerId: number | null;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSelectPartner: (user: ConversationUser) => void;
  onStartWithDirectory: (user: ConversationUser) => void;
  onRefresh: () => void;
  onClose: () => void;
}

export const ChatWidgetConversationsView: React.FC<ChatWidgetConversationsViewProps> = ({
  conversations,
  directoryUsers,
  unreadCount,
  isLoadingConversations,
  activePartnerId,
  searchQuery,
  setSearchQuery,
  onSelectPartner,
  onStartWithDirectory,
  onRefresh,
  onClose,
}) => {
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase().trim();
    return conversations.filter(c =>
      (c.user.name && c.user.name.toLowerCase().includes(q)) ||
      (c.user.company_name && c.user.company_name.toLowerCase().includes(q)) ||
      (c.user.email && c.user.email.toLowerCase().includes(q)) ||
      (c.last_message?.message && c.last_message.message.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  const filteredDirectoryUsers = useMemo(() => {
    const existingPartnerIds = new Set(conversations.map(c => c.user.id));
    const available = directoryUsers.filter(u => !existingPartnerIds.has(u.id));
    if (!searchQuery.trim()) return available.slice(0, 8);
    const q = searchQuery.toLowerCase().trim();
    return available.filter(u =>
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.company_name && u.company_name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  }, [directoryUsers, conversations, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
      <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#ff4a1f]/10 text-[#ff4a1f] flex items-center justify-center">
            <ChatIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">Messages</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct Customer & Supplier Chat</p>
          </div>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#ff4a1f] text-white text-[10px] font-bold ml-1">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRefresh}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors cursor-pointer text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
            title="Refresh Conversations"
          >
            <RefreshCw className="w-3.5 h-3.5" />
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

      <div className="px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts or messages..."
            className="w-full h-8 pl-8 pr-8 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#ff4a1f] text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Clear search"
            >
              <CloseIcon className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {isLoadingConversations && conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#ff4a1f]" />
            <span className="text-xs">Loading conversations...</span>
          </div>
        ) : filteredConversations.length > 0 ? (
          <div>
            <div className="px-3.5 py-1.5 bg-slate-50/50 dark:bg-slate-800/20 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Recent conversations
            </div>
            {filteredConversations.map((item) => (
              <ConversationItemRow
                key={item.user.id}
                item={item}
                isActive={activePartnerId === item.user.id}
                onSelect={onSelectPartner}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400">
            <ChatIcon className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">No recent conversations found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Pick a contact below to start chatting</p>
          </div>
        )}

        {filteredDirectoryUsers.length > 0 && (
          <div>
            <div className="px-3.5 py-1.5 bg-slate-50/50 dark:bg-slate-800/20 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Start new conversation
            </div>
            {filteredDirectoryUsers.map((user) => (
              <DirectoryContactRow
                key={user.id}
                user={user}
                onStart={onStartWithDirectory}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-sans">
        <Lock className="w-3 h-3 text-slate-400" />
        <span>Encrypted & secure messaging channel</span>
      </div>
    </div>
  );
};
