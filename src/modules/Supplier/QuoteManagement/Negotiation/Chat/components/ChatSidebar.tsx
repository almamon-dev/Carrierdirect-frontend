import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, PanelLeftClose } from 'lucide-react';
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
    isResizing = false
}) => {
    const navigate = useNavigate();
    const totalUnread = allNegotiations.filter(n => !readChatIds[n.rawId] && (n.unreadCount || 0) > 0).length;

    if (isCollapsed) {
        return (
            <ChatSidebarCollapsed
                filteredChats={filteredChats} activeNegotiation={activeNegotiation}
                pinnedChatIds={pinnedChatIds} readChatIds={readChatIds} chatMessages={chatMessages}
                liveOffers={liveOffers} totalUnread={totalUnread} onToggleCollapse={onToggleCollapse}
                setFilterTab={setFilterTab} handleSelectChat={handleSelectChat}
                onNavigateBack={() => navigate('/supplier/quotes/negotiation')}
            />
        );
    }

    return (
        <div style={{ width: `${sidebarWidth}px` }} className={`hidden lg:flex flex-col min-h-0 h-full bg-white border-r border-slate-200 shrink-0 relative transition-[width] duration-150 ${isResizing ? 'select-none' : ''}`}>
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 -ml-2 cursor-pointer shrink-0" onClick={() => navigate('/supplier/quotes/negotiation')} title="Back to table">
                        <ArrowLeft size={18} />
                    </Button>
                    <div className="min-w-0">
                        <h2 className="text-[15px] font-bold text-slate-800 tracking-tight leading-none truncate">Negotiations</h2>
                        <span className="text-[11px] text-slate-400 font-medium truncate block">Quote Negotiations</span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8 text-slate-500 hover:text-[#FF4A1F] hover:bg-orange-50 rounded-md cursor-pointer shrink-0 ml-1 transition-colors" title="Collapse sidebar">
                    <PanelLeftClose size={18} />
                </Button>
            </div>

            <div className="px-4 pt-3 pb-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" placeholder="Search negotiations, routes..." value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-700 placeholder-slate-400 font-medium"
                    />
                </div>
            </div>

            <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <button type="button" onClick={() => setFilterTab('all')} className={`rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer transition-colors ${filterTab === 'all' ? 'bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80 font-semibold'}`}>
                    All ({allNegotiations.length})
                </button>
                <button type="button" onClick={() => setFilterTab('unread')} className={`rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer whitespace-nowrap transition-colors ${filterTab === 'unread' ? 'bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80 font-semibold'}`}>
                    Unread {totalUnread > 0 && `(${totalUnread})`}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {filteredChats.map((item) => (
                    <ChatSidebarItem
                        key={item.rawId} item={item} isActive={item.rawId === activeNegotiation.rawId}
                        isPinned={Boolean(pinnedChatIds[item.rawId])} isUnread={Boolean(!readChatIds[item.rawId] && (item.unreadCount || 0) > 0)}
                        threadMsgs={chatMessages[item.rawId] || []} priceDisplay={liveOffers[item.rawId] || item.currentOffer || item.originalAmount || 1850}
                        onSelect={() => handleSelectChat(item)} onTogglePin={(e) => togglePinChat(e, item.rawId)}
                    />
                ))}
                {filteredChats.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">No negotiations found.</div>}
            </div>

            <div onMouseDown={onResizeStart} className="absolute right-0 top-0 bottom-0 w-1.5 -mr-[3px] cursor-col-resize z-20" title="Drag to resize sidebar width" />
        </div>
    );
};
