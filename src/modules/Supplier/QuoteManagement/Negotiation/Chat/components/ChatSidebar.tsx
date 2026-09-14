import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, PanelLeftClose, X, Table } from 'lucide-react';
import Button from '@/components/ui/button';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { ChatSidebarCollapsed } from './sidebar/ChatSidebarCollapsed';
import { ChatSidebarItem } from './sidebar/ChatSidebarItem';

interface ChatSidebarProps {
    allNegotiations: NegotiationItem[];
    filteredChats: NegotiationItem[];
    activeNegotiation: NegotiationItem;
    pinnedChatIds: Record<string | number, boolean>;
    readChatIds: Record<string | number, boolean>;
    chatMessages: Record<string | number, ChatMessage[]>;
    liveOffers: Record<string | number, number>;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    filterTab: 'all' | 'unread';
    setFilterTab: (t: 'all' | 'unread') => void;
    handleSelectChat: (item: NegotiationItem) => void;
    togglePinChat: (e: React.MouseEvent, chatId: number | string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    sidebarWidth: number;
    onResizeStart?: (e: React.MouseEvent) => void;
    isResizing?: boolean;
    isMobileOpen?: boolean;
    onCloseMobile?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
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
    handleSelectChat,
    togglePinChat,
    isCollapsed,
    onToggleCollapse,
    sidebarWidth,
    onResizeStart,
    isResizing = false,
    isMobileOpen = false,
    onCloseMobile
}) => {
    const navigate = useNavigate();
    const totalUnread = allNegotiations.filter(n => !readChatIds[n.rawId] && (n.unreadCount || 0) > 0).length;

    const handleSelectMobileChat = (item: NegotiationItem) => {
        handleSelectChat(item);
        if (onCloseMobile) onCloseMobile();
    };

    return (
        <>
            {/* Mobile Drawer (Google Chat / Telegram style sliding drawer) */}
            {isMobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 lg:hidden animate-in fade-in duration-200"
                        onClick={onCloseMobile}
                        aria-hidden="true"
                    />

                    {/* Sliding Drawer Panel */}
                    <div
    className="fixed inset-y-0 left-0 z-50 w-[86vw] max-w-[340px] bg-white flex flex-col h-full shadow-2xl border-r border-slate-200 lg:hidden animate-in slide-in-from-left duration-200 font-sans">
                        <div
    className="px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/70">
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
                                    <h2 className="text-[14.5px] font-bold text-slate-900 tracking-tight leading-none truncate">
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
                                className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-full cursor-pointer shrink-0"
                                title="Close sidebar"
                            >
                                <X size={18} />
                            </Button>
                        </div>

                        {/* Search Bar */}
                        <div className="px-3.5 pt-3 pb-2">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                                <input
                                    type="text"
                                    placeholder="Search negotiations, routes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF4A1F]/30 text-slate-800 placeholder-slate-400 font-medium"
                                />
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="px-3.5 py-1.5 flex items-center gap-2 overflow-x-auto hide-scrollbar">
                            <button
                                type="button"
                                onClick={() => setFilterTab('all')}
                                className={`rounded-full px-3 py-1 text-[11.5px] cursor-pointer transition-colors ${
                                    filterTab === 'all'
                                        ? 'bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80 font-semibold'
                                }`}
                            >
                                All ({allNegotiations.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterTab('unread')}
                                className={`rounded-full px-3 py-1 text-[11.5px] cursor-pointer whitespace-nowrap transition-colors ${
                                    filterTab === 'unread'
                                        ? 'bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80 font-semibold'
                                }`}
                            >
                                Unread {totalUnread > 0 && `(${totalUnread})`}
                            </button>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto px-2 mt-1 hide-scrollbar">
                            {filteredChats.map((item) => (
                                <ChatSidebarItem
                                    key={item.rawId}
                                    item={item}
                                    isActive={item.rawId === activeNegotiation.rawId}
                                    isPinned={Boolean(pinnedChatIds[item.rawId])}
                                    isUnread={Boolean(!readChatIds[item.rawId] && (item.unreadCount || 0) > 0)}
                                    threadMsgs={chatMessages[item.rawId] || []}
                                    priceDisplay={liveOffers[item.rawId] || item.currentOffer || item.originalAmount || 1850}
                                    onSelect={() => handleSelectMobileChat(item)}
                                    onTogglePin={(e) => togglePinChat(e, item.rawId)}
                                />
                            ))}
                            {filteredChats.length === 0 && (
                                <div className="text-center py-10 text-slate-400 text-xs font-medium">
                                    No negotiations found.
                                </div>
                            )}
                        </div>

                        {/* Bottom link to Negotiations table */}
                        <div
    className="p-3 border-t border-slate-100 bg-slate-50/60">
                            <button
                                type="button"
                                onClick={() => navigate('/supplier/quotes/negotiation')}
                                className="w-full h-8 px-3 rounded-[4px] bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <Table size={13} className="text-slate-500" />
                                <span>View Negotiations Table</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Desktop Sidebar (lg+ screens) */}
            {isCollapsed ? (
                <ChatSidebarCollapsed
                    filteredChats={filteredChats}
                    activeNegotiation={activeNegotiation}
                    pinnedChatIds={pinnedChatIds}
                    readChatIds={readChatIds}
                    chatMessages={chatMessages}
                    liveOffers={liveOffers}
                    totalUnread={totalUnread}
                    onToggleCollapse={onToggleCollapse}
                    setFilterTab={setFilterTab}
                    handleSelectChat={handleSelectChat}
                    onNavigateBack={() => navigate('/supplier/quotes/negotiation')}
                />
            ) : (
                <div
                    style={{ width: `${sidebarWidth}px` }}
                    className={`hidden lg:flex flex-col min-h-0 h-full bg-white border-r border-slate-200 shrink-0 relative transition-[width] duration-150 ${
                        isResizing ? 'select-none' : ''
                    }`}
                >
                    <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center gap-3 min-w-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 -ml-2 cursor-pointer shrink-0"
                                onClick={() => navigate('/supplier/quotes/negotiation')}
                                title="Back to table"
                            >
                                <ArrowLeft size={18} />
                            </Button>
                            <div className="min-w-0">
                                <h2 className="text-[15px] font-bold text-slate-800 tracking-tight leading-none truncate">
                                    Negotiations
                                </h2>
                                <span className="text-[11px] text-slate-400 font-medium truncate block">
                                    Quote Negotiations
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleCollapse}
                            className="h-8 w-8 text-slate-500 hover:text-[#FF4A1F] hover:bg-orange-50 rounded-md cursor-pointer shrink-0 ml-1 transition-colors"
                            title="Collapse sidebar"
                        >
                            <PanelLeftClose size={18} />
                        </Button>
                    </div>

                    <div className="px-4 pt-3 pb-2">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                            <input
                                type="text"
                                placeholder="Search negotiations, routes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-700 placeholder-slate-400 font-medium"
                            />
                        </div>
                    </div>

                    <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        <button
                            type="button"
                            onClick={() => setFilterTab('all')}
                            className={`rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer transition-colors ${
                                filterTab === 'all'
                                    ? 'bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80 font-semibold'
                            }`}
                        >
                            All ({allNegotiations.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterTab('unread')}
                            className={`rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer whitespace-nowrap transition-colors ${
                                filterTab === 'unread'
                                    ? 'bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80 font-semibold'
                            }`}
                        >
                            Unread {totalUnread > 0 && `(${totalUnread})`}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {filteredChats.map((item) => (
                            <ChatSidebarItem
                                key={item.rawId}
                                item={item}
                                isActive={item.rawId === activeNegotiation.rawId}
                                isPinned={Boolean(pinnedChatIds[item.rawId])}
                                isUnread={Boolean(!readChatIds[item.rawId] && (item.unreadCount || 0) > 0)}
                                threadMsgs={chatMessages[item.rawId] || []}
                                priceDisplay={liveOffers[item.rawId] || item.currentOffer || item.originalAmount || 1850}
                                onSelect={() => handleSelectChat(item)}
                                onTogglePin={(e) => togglePinChat(e, item.rawId)}
                            />
                        ))}
                        {filteredChats.length === 0 && (
                            <div className="text-center py-8 text-slate-500 text-sm">No negotiations found.</div>
                        )}
                    </div>

                    <div
                        onMouseDown={onResizeStart}
                        className="absolute right-0 top-0 bottom-0 w-1.5 -mr-[3px] cursor-col-resize z-20"
                        title="Drag to resize sidebar width"
                    />
                </div>
            )}
        </>
    );
};
