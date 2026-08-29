import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';
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
    const unreadCountTotal = chats.filter(c => c.unread || c.unreadCount > 0).length;

    return (
        <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col min-h-0 h-full bg-white dark:bg-[#12161c] border-r border-slate-200 dark:border-slate-800">
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
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                    filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleSelectChat(chat.id)}
                            className={`p-2.5 rounded-md cursor-pointer flex gap-3 items-center group relative transition-all ${
                                String(chat.id) === String(activeChatId)
                                    ? 'bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/60 shadow-2xs'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent'
                            }`}
                        >
                            <div className="relative shrink-0 w-10 h-10 aspect-square">
                                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F] flex items-center justify-center font-bold text-sm shrink-0 aspect-square overflow-hidden shadow-2xs">
                                    {chat.avatar}
                                </div>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full z-10" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 truncate">{chat.name}</h4>
                                    <span className="text-[10.5px] text-slate-400 shrink-0">{chat.time}</span>
                                </div>
                                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{chat.preview}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-[10.5px] font-semibold text-[#FF4A1F]">{chat.quoteNo}</span>
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{chat.baseFreight}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
