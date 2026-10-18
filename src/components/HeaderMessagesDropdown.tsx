import React from 'react';
import { MessageSquare, Search, RefreshCw } from 'lucide-react';
import { ConversationPartnerItem } from '@/services/messageService';
import { HeaderMessageItem } from './HeaderMessageItem';

interface HeaderMessagesDropdownProps {
    unreadCount: number;
    isLoadingConversations: boolean;
    onRefresh: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    activeTab: 'all' | 'unread';
    onTabChange: (tab: 'all' | 'unread') => void;
    conversationsCount: number;
    filteredConversations: ConversationPartnerItem[];
    directoryUsers: any[];
    role: 'supplier' | 'customer' | 'driver';
    onSelectConversation: (partner: ConversationPartnerItem) => void;
    onSelectDirectoryUser: (user: any) => void;
}

export const HeaderMessagesDropdown: React.FC<HeaderMessagesDropdownProps> = ({
    unreadCount,
    isLoadingConversations,
    onRefresh,
    searchQuery,
    onSearchChange,
    activeTab,
    onTabChange,
    conversationsCount,
    filteredConversations,
    directoryUsers,
    role,
    onSelectConversation,
    onSelectDirectoryUser,
}) => {
    return (
        <div className="fixed sm:absolute top-14 sm:top-auto left-2 right-2 sm:left-auto sm:right-0 mt-2 w-auto sm:w-[390px] max-w-[calc(100vw-1rem)] bg-white dark:bg-[#161b22] rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 z-[999] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col font-sans">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#12161c]/80 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center font-bold">
                        <MessageSquare size={14} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Messages</h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Direct chats & communication</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {unreadCount > 0 && (
                        <span className="text-[11px] font-medium bg-orange-100 dark:bg-orange-950/50 text-[#FF4A1F] px-2 py-0.5 rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isLoadingConversations}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={13} className={isLoadingConversations ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Search & Tabs */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                        type="text"
                        placeholder="Search messages or people..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-8 pl-8 pr-4 text-xs bg-slate-100 dark:bg-[#1c2128] border-none outline-none focus:outline-none focus:ring-0 rounded-full text-slate-800 dark:text-slate-200 placeholder-slate-400"
                    />
                </div>

                <div className="flex items-center gap-1.5 pt-0.5">
                    <button
                        type="button"
                        onClick={() => onTabChange('all')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                            activeTab === 'all'
                                ? 'bg-[#FF4A1F] text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-[#1c2128] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        All ({conversationsCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => onTabChange('unread')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                            activeTab === 'unread'
                                ? 'bg-[#FF4A1F] text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-[#1c2128] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        Unread {unreadCount > 0 && `(${unreadCount})`}
                    </button>
                </div>
            </div>

            {/* Conversations List */}
            <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {isLoadingConversations && conversationsCount === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                        <RefreshCw size={18} className="animate-spin mx-auto text-[#FF4A1F]" />
                        <p>Loading conversations...</p>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="p-3 text-center space-y-2">
                        <div className="py-3 px-2">
                            <MessageSquare size={22} className="mx-auto mb-1 text-[#FF4A1F]" />
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Start Platform Chat</p>
                            <p className="text-[10.5px] text-slate-400">Click any user to message on platform:</p>
                        </div>
                        <div className="space-y-1 text-left divide-y divide-slate-100 dark:divide-slate-800/40">
                            {directoryUsers.filter(u => {
                                const ut = (u.user_type || '').toLowerCase();
                                if (role === 'customer') return ut.includes('supplier') || ut.includes('carrier');
                                if (role === 'supplier') return ut.includes('customer') || ut.includes('shipper');
                                return true;
                            }).slice(0, 4).map((user) => {
                                const displayName = user.company_name || user.name || 'User';
                                const initials = (user.name || 'U').slice(0, 2).toUpperCase();
                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => onSelectDirectoryUser(user)}
                                        className="pt-1.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1c2128] cursor-pointer flex items-center justify-between gap-2 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{displayName}</p>
                                                <p className="text-[10px] text-slate-400 capitalize">{user.user_type || 'User'}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#FF4A1F] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full shrink-0">
                                            Chat
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    filteredConversations.map((item) => (
                        <HeaderMessageItem
                            key={item.user.id}
                            item={item}
                            onSelect={onSelectConversation}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
