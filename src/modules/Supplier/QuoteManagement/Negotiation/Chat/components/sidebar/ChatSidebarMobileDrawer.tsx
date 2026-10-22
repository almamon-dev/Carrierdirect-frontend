import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, Table } from 'lucide-react';
import Button from '@/components/ui/button';
import Skeleton from '@/components/ui/skeleton';
import { NegotiationItem } from '../../../types';
import { ChatMessage, NegotiationFilterTab } from '../../types';
import { ChatSidebarItem } from './ChatSidebarItem';

interface ChatSidebarMobileDrawerProps {
    isMobileOpen: boolean;
    onCloseMobile?: () => void;
    allNegotiations: NegotiationItem[];
    filteredChats: NegotiationItem[];
    activeNegotiation: NegotiationItem | null;
    pinnedChatIds: Record<string | number, boolean>;
    readChatIds: Record<string | number, boolean>;
    chatMessages: Record<string | number, ChatMessage[]>;
    liveOffers: Record<string | number, number>;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    filterTab: NegotiationFilterTab;
    setFilterTab: (t: NegotiationFilterTab) => void;
    counts?: {
        all: number;
        new: number;
        existing: number;
        unread: number;
    };
    repeatCustomerMap?: Record<string, number>;
    handleSelectChat: (item: NegotiationItem) => void;
    togglePinChat: (e: React.MouseEvent, chatId: number | string) => void;
    isLoading?: boolean;
}

export const ChatSidebarMobileDrawer: React.FC<ChatSidebarMobileDrawerProps> = ({
    isMobileOpen,
    onCloseMobile,
    allNegotiations,
    filteredChats,
    activeNegotiation,
    pinnedChatIds,
    readChatIds,
    chatMessages,
    liveOffers,
    searchQuery,
    setSearchQuery,
    filterTab,
    setFilterTab,
    counts,
    repeatCustomerMap,
    handleSelectChat,
    togglePinChat,
    isLoading = false,
}) => {
    const navigate = useNavigate();
    if (!isMobileOpen) return null;

    const totalUnread = counts?.unread ?? allNegotiations.filter((n) => !readChatIds[n.rawId] && (n.unreadCount || 0) > 0).length;

    const filterTabs: { id: NegotiationFilterTab; label: string; count: number }[] = [
        { id: 'all', label: 'all', count: counts?.all ?? allNegotiations.length },
        { id: 'new', label: 'new', count: counts?.new ?? 0 },
        { id: 'existing', label: 'existing', count: counts?.existing ?? 0 },
        { id: 'unread', label: 'unread', count: counts?.unread ?? totalUnread },
    ];

    const handleSelectMobileChat = (item: NegotiationItem) => {
        handleSelectChat(item);
        if (onCloseMobile) onCloseMobile();
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-2xs transition-opacity animate-in fade-in duration-200"
                onClick={onCloseMobile}
            />

            <div className="fixed inset-y-0 left-0 z-50 w-[86vw] max-w-[360px] bg-white dark:bg-[#12161c] flex flex-col h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 lg:hidden animate-in slide-in-from-left duration-200 font-sans">
                <div className="h-[60px] px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 box-border bg-white dark:bg-[#12161c]">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-200/70 -ml-1 cursor-pointer shrink-0"
                            onClick={() => navigate('/supplier/quotes/negotiation')}
                            title="Back to all negotiations table"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <div className="min-w-0">
                            <h2 className="text-[14.5px] font-bold text-slate-900 dark:text-white tracking-tight leading-none truncate">
                                Negotiations
                            </h2>
                            <span className="text-[10.5px] text-slate-500 font-medium truncate block mt-0.5">
                                {allNegotiations.length} total active threads
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onCloseMobile}
                        className="h-8 w-8 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/70 rounded-full cursor-pointer shrink-0"
                        title="Close sidebar"
                    >
                        <X size={18} />
                    </Button>
                </div>

                <div className="px-3.5 pt-3 pb-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                        <input
                            type="text"
                            placeholder="Search negotiations, routes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-slate-100 dark:bg-slate-800/80 border-none rounded-full outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-none text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium"
                        />
                    </div>
                </div>

                <div className="px-3.5 py-1.5 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
                    {filterTabs.map((tab) => {
                        const isActive = filterTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setFilterTab(tab.id)}
                                className={`rounded-full px-3 py-1 text-[11.5px] cursor-pointer whitespace-nowrap outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-colors flex items-center gap-1.5 shrink-0 ${
                                    isActive
                                        ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/80 dark:border-orange-800 font-bold shadow-2xs'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 font-semibold'
                                }`}
                            >
                                <span>{tab.label}</span>
                                {!isLoading && tab.count > 0 && (
                                    <span
                                        className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold inline-flex items-center justify-center leading-none shrink-0 ${
                                            isActive
                                                ? 'bg-[#FF4A1F] text-white'
                                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="flex-1 overflow-y-auto px-2 mt-1 hide-scrollbar">
                    {isLoading ? (
                        <div className="space-y-1.5 py-1">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="p-2.5 rounded-lg flex gap-3 items-center border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-[#12161c]"
                                >
                                    <Skeleton className="w-10 h-10 rounded-full shrink-0 aspect-square" />
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <Skeleton className="h-3.5 w-24 rounded-md" />
                                            <Skeleton className="h-2.5 w-10 rounded-md" />
                                        </div>
                                        <Skeleton className="h-3 w-40 rounded-md" />
                                        <div className="flex items-center justify-between pt-0.5">
                                            <Skeleton className="h-3 w-16 rounded-md" />
                                            <Skeleton className="h-3.5 w-14 rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredChats.map((item) => {
                                const custKey = (item.customer || '').trim().toLowerCase();
                                const isRepeat = Boolean(repeatCustomerMap && (repeatCustomerMap[custKey] || 0) > 1);
                                const isContactActive = (item.customer || '').trim().toLowerCase() === (activeNegotiation?.customer || '').trim().toLowerCase() || String(item.rawId) === String(activeNegotiation?.rawId);
                                const isPinned = Boolean((item as any).groupIsPinned || pinnedChatIds[item.rawId]);
                                const isUnread = Boolean(!isContactActive && ((item as any).groupHasUnread || (!readChatIds[item.rawId] && (item.unreadCount || 0) > 0)));

                                return (
                                    <ChatSidebarItem
                                        key={item.rawId}
                                        item={item}
                                        isActive={isContactActive}
                                        isPinned={isPinned}
                                        isUnread={isUnread}
                                        isRepeatCustomer={isRepeat}
                                        threadMsgs={chatMessages[item.rawId] || chatMessages[String(item.rawId)] || chatMessages[item.id] || []}
                                        priceDisplay={liveOffers[item.rawId] || item.currentOffer || item.originalAmount || 1850}
                                        onSelect={() => handleSelectMobileChat(item)}
                                        onTogglePin={(e) => togglePinChat(e, item.rawId)}
                                    />
                                );
                            })}
                            {filteredChats.length === 0 && (
                                <div className="text-center py-10 text-slate-400 text-xs font-medium">
                                    No negotiations found.
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#12161c]">
                    <button
                        type="button"
                        onClick={() => navigate('/supplier/quotes/negotiation')}
                        className="w-full h-8 px-3 rounded-[4px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <Table size={13} className="text-slate-500" />
                        <span>View Negotiations Table</span>
                    </button>
                </div>
            </div>
        </>
    );
};
