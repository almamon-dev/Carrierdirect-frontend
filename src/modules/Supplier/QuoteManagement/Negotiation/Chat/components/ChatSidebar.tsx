import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, PanelLeftClose, MoreHorizontal } from 'lucide-react';
import Button from '@/components/ui/button';
import { NegotiationItem } from '../../types';
import { ChatMessage, NegotiationFilterTab } from '../types';
import { ChatSidebarCollapsed } from './sidebar/ChatSidebarCollapsed';
import { ChatSidebarMobileDrawer } from './sidebar/ChatSidebarMobileDrawer';
import { ChatSidebarConversationList } from './sidebar/ChatSidebarConversationList';

interface ChatSidebarProps {
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
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    sidebarWidth: number;
    onResizeStart?: (e: React.MouseEvent) => void;
    isResizing?: boolean;
    isMobileOpen?: boolean;
    onCloseMobile?: () => void;
    isLoading?: boolean;
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
    counts,
    repeatCustomerMap,
    handleSelectChat,
    togglePinChat,
    isCollapsed,
    onToggleCollapse,
    sidebarWidth,
    onResizeStart,
    isResizing = false,
    isMobileOpen = false,
    onCloseMobile,
    isLoading = false,
}) => {
    const navigate = useNavigate();
    const totalUnread = counts?.unread ?? allNegotiations.filter((n) => !readChatIds[n.rawId] && (n.unreadCount || 0) > 0).length;

    const filterTabs: { id: NegotiationFilterTab; label: string; count: number }[] = [
        { id: 'all', label: 'All', count: counts?.all ?? allNegotiations.length },
        { id: 'new', label: 'New', count: counts?.new ?? 0 },
        { id: 'existing', label: 'Existing', count: counts?.existing ?? 0 },
        { id: 'unread', label: 'Unread', count: counts?.unread ?? totalUnread },
    ];

    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    // Close more menu on outside click or escape key
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
                setIsMoreOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMoreOpen(false);
            }
        };
        if (isMoreOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMoreOpen]);

    // Close menu when sidebar resize drag starts
    useEffect(() => {
        if (isResizing) {
            setIsMoreOpen(false);
        }
    }, [isResizing]);


    const visibleCount = sidebarWidth >= 345 ? 4 : sidebarWidth >= 295 ? 3 : 2;
    const visibleTabs = filterTabs.slice(0, visibleCount);
    const hiddenTabs = filterTabs.slice(visibleCount);
    const isHiddenTabActive = hiddenTabs.some((t) => t.id === filterTab);
    const activeHiddenTab = hiddenTabs.find((t) => t.id === filterTab);

    return (
        <>
            <ChatSidebarMobileDrawer
                isMobileOpen={isMobileOpen}
                onCloseMobile={onCloseMobile}
                allNegotiations={allNegotiations}
                filteredChats={filteredChats}
                activeNegotiation={activeNegotiation}
                pinnedChatIds={pinnedChatIds}
                readChatIds={readChatIds}
                chatMessages={chatMessages}
                liveOffers={liveOffers}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterTab={filterTab}
                setFilterTab={setFilterTab}
                counts={counts}
                repeatCustomerMap={repeatCustomerMap}
                handleSelectChat={handleSelectChat}
                togglePinChat={togglePinChat}
                isLoading={isLoading}
            />

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
                    className={`hidden lg:flex flex-col min-h-0 h-full bg-white dark:bg-[#12161c] border-r border-slate-200 dark:border-slate-800 shrink-0 relative transition-[width] duration-150 ${isResizing ? 'select-none' : ''
                        }`}
                >
                    <div className="h-[60px] px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 box-border bg-white dark:bg-[#12161c]">
                        <div className="flex items-center gap-3 min-w-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 -ml-2 cursor-pointer shrink-0"
                                onClick={() => navigate('/supplier/quotes/negotiation')}
                                title="Back to table"
                            >
                                <ArrowLeft size={18} />
                            </Button>
                            <div className="min-w-0">
                                <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate">
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
                            className="h-8 w-8 text-slate-500 hover:text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-md cursor-pointer shrink-0 ml-1 transition-colors"
                            title="Collapse sidebar"
                        >
                            <PanelLeftClose size={18} />
                        </Button>
                    </div>

                    <div className="px-3.5 pt-3 pb-2">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                            <input
                                type="text"
                                placeholder="Search negotiations, routes, #order..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-slate-100 dark:bg-slate-800/80 border-none rounded-full outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-none text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium transition-all"
                            />
                        </div>
                    </div>

                    <div className="px-3.5 py-1.5 flex items-center gap-1.5 relative z-30 shrink-0">
                        {visibleTabs.map((tab) => {
                            const isActive = filterTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setFilterTab(tab.id)}
                                    className={`rounded-full px-3 py-1 text-[11.5px] cursor-pointer whitespace-nowrap outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all flex items-center gap-1.5 shrink-0 ${isActive
                                            ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/80 dark:border-orange-800 font-bold shadow-2xs'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 font-semibold'
                                        }`}
                                >
                                    <span>{tab.label}</span>
                                    {!isLoading && tab.count > 0 && (
                                        <span
                                            className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold inline-flex items-center justify-center leading-none shrink-0 ${isActive
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

                        {hiddenTabs.length > 0 && (
                            <div className="relative shrink-0" ref={moreMenuRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsMoreOpen((prev) => !prev)}
                                    title={isHiddenTabActive && activeHiddenTab ? `Active: ${activeHiddenTab.label} (More filters)` : 'More filter tabs'}
                                    className={`rounded-full px-2.5 py-1 text-[11.5px] cursor-pointer whitespace-nowrap outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all flex items-center justify-center shrink-0 ${isHiddenTabActive
                                            ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/80 dark:border-orange-800 font-bold shadow-2xs'
                                            : isMoreOpen
                                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 font-semibold'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 font-semibold'
                                        }`}
                                >
                                    <MoreHorizontal size={15} className="shrink-0" />
                                </button>

                                {isMoreOpen && (
                                    <div className="absolute right-0 top-full mt-1.5 min-w-[155px] bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                            More Filters
                                        </div>
                                        <div className="space-y-0.5 mt-0.5">
                                            {hiddenTabs.map((tab) => {
                                                const isTabActive = filterTab === tab.id;
                                                return (
                                                    <button
                                                        key={tab.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFilterTab(tab.id);
                                                            setIsMoreOpen(false);
                                                        }}
                                                        className={`w-full px-2.5 py-1.5 rounded-lg text-[12px] cursor-pointer flex items-center justify-between gap-2 transition-colors ${isTabActive
                                                                ? 'bg-orange-50 dark:bg-orange-950/50 text-[#FF4A1F] font-bold'
                                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium'
                                                            }`}
                                                    >
                                                        <span className="truncate">{tab.label}</span>
                                                        {!isLoading && tab.count > 0 && (
                                                            <span
                                                                className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold inline-flex items-center justify-center leading-none shrink-0 ${isTabActive
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
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <ChatSidebarConversationList
                            isLoading={isLoading}
                            filteredChats={filteredChats}
                            activeNegotiation={activeNegotiation}
                            pinnedChatIds={pinnedChatIds}
                            readChatIds={readChatIds}
                            chatMessages={chatMessages}
                            liveOffers={liveOffers}
                            repeatCustomerMap={repeatCustomerMap}
                            handleSelectChat={handleSelectChat}
                            togglePinChat={togglePinChat}
                        />
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
