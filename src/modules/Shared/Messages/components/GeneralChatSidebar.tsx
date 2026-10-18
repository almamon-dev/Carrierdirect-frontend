import React from 'react';
import { ConversationPartnerItem, ConversationUser } from '@/services/messageService';
import { MessageSquare, Search } from 'lucide-react';
import { GeneralChatSidebarSkeleton } from './GeneralChatSidebarSkeleton';
import { GeneralChatSidebarHeader } from './GeneralChatSidebarHeader';
import { GeneralChatSidebarItem } from './GeneralChatSidebarItem';
import { formatSidebarTime, getRoleBadge } from './generalChatSidebarUtils';

export { formatSidebarTime, getRoleBadge };

export interface GeneralChatSidebarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    filterTab: 'all' | 'unread';
    setFilterTab: (val: 'all' | 'unread') => void;
    conversations: ConversationPartnerItem[];
    directoryUsers?: ConversationUser[];
    activePartnerId: number | string | null;
    onSelectPartner: (partner: ConversationPartnerItem) => void;
    onSelectDirectoryUser?: (user: ConversationUser) => void;
    onOpenNewMessage?: () => void;
    role?: 'supplier' | 'customer' | string;
    onBack?: () => void;
    isLoading?: boolean;
    onRefresh?: () => void;
}

export const GeneralChatSidebar: React.FC<GeneralChatSidebarProps> = ({
    searchQuery,
    setSearchQuery,
    filterTab,
    setFilterTab,
    conversations,
    activePartnerId,
    onSelectPartner,
    onOpenNewMessage,
    onBack,
    isLoading,
}) => {
    const unreadTotal = conversations.filter((c) => c.unread_count > 0).length;

    const filteredConversations = conversations.filter((item) => {
        const name = (item.user.company_name || item.user.name || '').toLowerCase();
        const lastMsg = (item.last_message?.message || '').toLowerCase();
        const matches = name.includes(searchQuery.toLowerCase()) || lastMsg.includes(searchQuery.toLowerCase());

        if (filterTab === 'unread') {
            return matches && item.unread_count > 0;
        }
        return matches;
    });

    return (
        <div className="w-full flex flex-col min-h-0 h-full bg-white dark:bg-[#12161c] border-r border-slate-200 dark:border-slate-800 font-sans">
            <GeneralChatSidebarHeader
                unreadTotal={unreadTotal}
                onBack={onBack}
                onOpenNewMessage={onOpenNewMessage}
            />

            {/* Search Box */}
            <div className="px-3 pt-3 pb-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                        type="text"
                        placeholder="Search conversations"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-[36px] pl-9 pr-4 text-[12.5px] bg-slate-100 dark:bg-[#181d24] border-none outline-none focus:outline-none focus:ring-0 rounded-full text-slate-800 dark:text-slate-200 placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Filter Tabs: All & Unread */}
            <div className="px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <button
                    type="button"
                    onClick={() => setFilterTab('all')}
                    className={`rounded-full px-3.5 py-1 text-[11.5px] font-medium cursor-pointer transition-colors whitespace-nowrap ${
                        filterTab === 'all'
                            ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/80 dark:border-orange-900/60 shadow-2xs font-semibold'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
                    }`}
                >
                    All {!isLoading && `(${conversations.length})`}
                </button>

                <button
                    type="button"
                    onClick={() => setFilterTab('unread')}
                    className={`rounded-full px-3.5 py-1 text-[11.5px] font-medium cursor-pointer transition-colors whitespace-nowrap ${
                        filterTab === 'unread'
                            ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/80 dark:border-orange-900/60 shadow-2xs font-semibold'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
                    }`}
                >
                    Unread {!isLoading && unreadTotal > 0 && `(${unreadTotal})`}
                </button>
            </div>

            {/* List Body with hidden scrollbar */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {isLoading && conversations.length === 0 ? (
                    <GeneralChatSidebarSkeleton />
                ) : filteredConversations.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 flex flex-col items-center">
                        <MessageSquare size={26} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No chats found</p>
                        <p className="text-[11.5px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                            {searchQuery ? 'No match for search terms.' : 'Start a new conversation using the "New Message" button above.'}
                        </p>
                    </div>
                ) : (
                    filteredConversations.map((item, idx) => (
                        <GeneralChatSidebarItem
                            key={item.user?.id || (item as any).partner_id || idx}
                            item={item}
                            activePartnerId={activePartnerId}
                            onSelectPartner={onSelectPartner}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default GeneralChatSidebar;
