import React from 'react';
import { ArrowLeft, Search, BadgeCheck } from 'lucide-react';
import Button from '@/components/ui/button';
import { CustomerChatItem } from '../types';

interface CustomerChatSidebarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    filterTab: 'all' | 'unread';
    setFilterTab: (val: 'all' | 'unread') => void;
    chats: CustomerChatItem[];
    filteredChats: CustomerChatItem[];
    activeChatId: string | number;
    handleSelectChat: (id: string | number) => void;
    onBack: () => void;
}

export const CustomerChatSidebar: React.FC<CustomerChatSidebarProps> = ({
    searchQuery,
    setSearchQuery,
    filterTab,
    setFilterTab,
    chats,
    filteredChats,
    activeChatId,
    handleSelectChat,
    onBack
}) => {
    const unreadCountTotal = chats.filter(c => Boolean(c.unread || (c.unreadCount && c.unreadCount > 0))).length;

    return (
        <div
    className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col min-h-0 h-full bg-white dark:bg-[#12161c] border-r border-slate-200 dark:border-slate-800">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 -ml-2"
                        onClick={onBack}
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">Negotiations</h2>
                </div>
            </div>

            <div className="px-4 pt-3 pb-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                        type="text"
                        placeholder="Search negotiations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-slate-100 dark:bg-slate-800/80 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-700 dark:text-slate-200 placeholder-slate-400"
                    />
                </div>
            </div>

            <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <button
                    type="button"
                    onClick={() => setFilterTab('all')}
                    className={`rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer transition-colors ${filterTab === 'all'
                        ? 'bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 border border-slate-200/80 dark:border-slate-700 font-semibold'
                    }`}
                >
                    All
                </button>
                <button
                    type="button"
                    onClick={() => setFilterTab('unread')}
                    className={`rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer whitespace-nowrap transition-colors ${filterTab === 'unread'
                        ? 'bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 border border-slate-200/80 dark:border-slate-700 font-semibold'
                    }`}
                >
                    Unread {unreadCountTotal > 0 && `(${unreadCountTotal})`}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-1 [&::-webkit-scrollbar]:hidden">
                {filteredChats.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                        No negotiations found.
                    </div>
                ) : (
                    filteredChats.map((chat) => {
                        const isActive = String(chat.id) === String(activeChatId);
                        const isUnread = Boolean(chat.unread || (chat.unreadCount && chat.unreadCount > 0));

                        return (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectChat(chat.id)}
                                className={`p-2.5 rounded-[4px] cursor-pointer flex gap-3 items-center transition-all ${
                                    isActive
                                        ? 'bg-slate-100 dark:bg-[#1c222b] border border-slate-200 dark:border-slate-700/80 shadow-2xs'
                                        : isUnread
                                            ? 'bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/80'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80'
                                }`}
                            >
                                <div className="relative shrink-0 w-11 h-11">
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs border overflow-hidden ${
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50 text-[#2563EB]'
                                            : 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F]'
                                    }`}>
                                        {chat.avatar && (chat.avatar.startsWith('http') || chat.avatar.startsWith('/storage') || chat.avatar.startsWith('data:') || chat.avatar.includes('.')) ? (
                                            <img
                                                src={chat.avatar}
                                                alt=""
                                                className="w-full h-full object-contain"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <span>{(chat.name || 'S').charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <span
                                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-[#12161c] ${
                                            chat.isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                        title={chat.isOnline ? "Active Now" : "Offline"}
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                            <h4 className={`text-[13px] truncate leading-tight ${
                                                isActive || isUnread ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-800 dark:text-slate-200'
                                            }`}>
                                                {chat.name}
                                            </h4>
                                            <BadgeCheck size={13.5} className="text-[#FF4A1F] shrink-0" />
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-normal shrink-0 whitespace-nowrap">
                                            {chat.time}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-0.5">
                                        <p className={`text-[11.5px] truncate ${
                                            isUnread ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                                        }`}>
                                            {chat.preview}
                                        </p>
                                        {isUnread ? (
                                            <span className="min-w-[18px] h-[18px] px-1 bg-[#FF4A1F] text-white text-[10px] font-semibold rounded-full flex items-center justify-center shrink-0 shadow-2xs">
                                                {chat.unreadCount || 1}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
