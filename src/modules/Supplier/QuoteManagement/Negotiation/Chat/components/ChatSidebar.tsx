import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Search,
    PanelLeftClose,
    MoreHorizontal,
    CreditCard,
    Tag,
    CheckCircle2,
    Pin,
    Clock,
    Flame,
    ArrowUpDown,
    X,
    Filter
} from 'lucide-react';
import Button from '@/components/ui/button';
import { NegotiationItem } from '../../types';
import { ChatMessage, NegotiationFilterTab, SupplierChatSortOption } from '../types';
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
    sortBy?: SupplierChatSortOption;
    setSortBy?: (s: SupplierChatSortOption) => void;
    counts?: {
        all: number;
        new: number;
        existing: number;
        unread: number;
        awaiting_payment?: number;
        counter_offers?: number;
        booked?: number;
        pinned?: number;
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
    sortBy = 'recent',
    setSortBy,
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

    const awaitingPaymentCount = counts?.awaiting_payment ?? 0;
    const counterOffersCount = counts?.counter_offers ?? 0;
    const bookedCount = counts?.booked ?? 0;
    const pinnedCount = counts?.pinned ?? 0;

    // Track custom swapped 3rd pill when picked from dropdown
    const [customThirdTab, setCustomThirdTab] = useState<NegotiationFilterTab | null>(null);

    const defaultThirdTab: NegotiationFilterTab =
        awaitingPaymentCount > 0
            ? 'awaiting_payment'
            : counterOffersCount > 0
            ? 'counter_offers'
            : 'new';

    useEffect(() => {
        if (filterTab !== 'all' && filterTab !== 'unread' && filterTab !== defaultThirdTab) {
            setCustomThirdTab(filterTab);
        }
    }, [filterTab, defaultThirdTab]);

    const activeThirdTabId: NegotiationFilterTab =
        customThirdTab || (!['all', 'unread'].includes(filterTab) ? filterTab : defaultThirdTab);

    const isThirdTabCustom = activeThirdTabId !== defaultThirdTab;

    const getTabMeta = (tabId: NegotiationFilterTab) => {
        switch (tabId) {
            case 'awaiting_payment':
                return {
                    id: tabId,
                    label: 'awaiting payment',
                    count: awaitingPaymentCount,
                    icon: <CreditCard size={11} className="shrink-0" />,
                };
            case 'counter_offers':
                return {
                    id: tabId,
                    label: 'customer countered',
                    count: counterOffersCount,
                    icon: <Tag size={11} className="shrink-0" />,
                };
            case 'booked':
                return {
                    id: tabId,
                    label: 'booked & confirmed',
                    count: bookedCount,
                    icon: <CheckCircle2 size={11} className="shrink-0" />,
                };
            case 'pinned':
                return {
                    id: tabId,
                    label: 'pinned chats',
                    count: pinnedCount,
                    icon: <Pin size={11} className="shrink-0" />,
                };
            case 'new':
                return {
                    id: tabId,
                    label: 'new',
                    count: counts?.new ?? 0,
                    icon: <Flame size={11} className="shrink-0" />,
                };
            case 'existing':
                return {
                    id: tabId,
                    label: 'existing',
                    count: counts?.existing ?? 0,
                    icon: <Clock size={11} className="shrink-0" />,
                };
            default:
                return {
                    id: tabId,
                    label: tabId,
                    count: 0,
                    icon: undefined,
                };
        }
    };

    const primaryPills: { id: NegotiationFilterTab; label: string; count: number; icon?: React.ReactNode }[] = [
        { id: 'all', label: 'all', count: counts?.all ?? allNegotiations.length },
        { id: 'unread', label: 'unread', count: totalUnread },
        getTabMeta(activeThirdTabId),
    ];

    const isSpecialFilterActive = isThirdTabCustom || (filterTab !== 'all' && filterTab !== 'unread' && filterTab !== defaultThirdTab) || sortBy !== 'recent';

    const moreFilterOptions = [
        {
            id: 'awaiting_payment' as NegotiationFilterTab,
            label: 'awaiting payment',
            desc: 'customer accepted quote, payment pending',
            count: awaitingPaymentCount,
            icon: <CreditCard size={13} className="text-amber-500" />,
            badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
        },
        {
            id: 'counter_offers' as NegotiationFilterTab,
            label: 'customer countered',
            desc: 'customers proposed revised rate',
            count: counterOffersCount,
            icon: <Tag size={13} className="text-purple-500" />,
            badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
        },
        {
            id: 'booked' as NegotiationFilterTab,
            label: 'booked & confirmed',
            desc: 'payment confirmed, ready to haul',
            count: bookedCount,
            icon: <CheckCircle2 size={13} className="text-emerald-500" />,
            badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
        },
        {
            id: 'pinned' as NegotiationFilterTab,
            label: 'pinned chats',
            desc: 'high priority customer conversations',
            count: pinnedCount,
            icon: <Pin size={13} className="text-orange-500" />,
            badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300',
        },
        {
            id: 'new' as NegotiationFilterTab,
            label: 'new inquiries',
            desc: 'open bidding requests',
            count: counts?.new ?? 0,
            icon: <Flame size={13} className="text-blue-500" />,
            badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
        },
        {
            id: 'existing' as NegotiationFilterTab,
            label: 'existing deals',
            desc: 'all active and historical conversations',
            count: counts?.existing ?? 0,
            icon: <Clock size={13} className="text-slate-500" />,
            badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        },
    ];

    const sortOptions: { id: SupplierChatSortOption; label: string; icon: React.ReactNode }[] = [
        { id: 'recent', label: 'recent activity', icon: <Clock size={12} /> },
        { id: 'unread_first', label: 'unread first', icon: <Flame size={12} /> },
        { id: 'amount_high', label: 'highest quote', icon: <ArrowUpDown size={12} /> },
        { id: 'amount_low', label: 'lowest quote', icon: <ArrowUpDown size={12} /> },
    ];

    const activeFilterObj = moreFilterOptions.find((o) => o.id === filterTab);

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
                    handleSelectChat={handleSelectChat}
                    setFilterTab={setFilterTab}
                    onNavigateBack={() => navigate('/supplier/quotes')}
                />
            ) : (
                <div
                    style={{ width: `${sidebarWidth}px` }}
                    className="hidden lg:flex shrink-0 flex-col min-h-0 h-full bg-white dark:bg-[#12161c] border-r border-slate-200 dark:border-slate-800 relative select-none"
                >
                    {/* Top bar */}
                    <div className="h-[60px] px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 -ml-2 cursor-pointer shrink-0"
                                onClick={() => navigate('/supplier/quotes')}
                                title="Back to quotes"
                            >
                                <ArrowLeft size={18} />
                            </Button>
                            <div className="min-w-0">
                                <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate">
                                    Negotiations
                                </h2>
                                <span className="text-[11px] text-slate-400 font-medium truncate block mt-0.5">
                                    Customer Conversations
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleCollapse}
                            className="h-8 w-8 text-slate-500 hover:text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-[4px] cursor-pointer shrink-0 transition-colors"
                            title="Collapse sidebar"
                        >
                            <PanelLeftClose size={18} />
                        </Button>
                    </div>

                    {/* Search */}
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

                    {/* Filters Row with Quick Pills & 3-Dot More Filter */}
                    <div className="px-3 py-1.5 flex items-center justify-between gap-1 relative z-30 shrink-0">
                        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar flex-1 min-w-0 pr-0.5">
                            {primaryPills.map((tab, idx) => {
                                const isActive = filterTab === tab.id;
                                const isThisTabCustom = idx === 2 && isThirdTabCustom;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setFilterTab(tab.id)}
                                        className={`rounded-full px-2 py-0.5 text-[11px] cursor-pointer whitespace-nowrap outline-none transition-all flex items-center gap-1 shrink-0 ${
                                            isActive
                                                ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/80 dark:border-orange-800 font-semibold shadow-2xs'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 font-normal'
                                        }`}
                                    >
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                        {!isLoading && tab.count > 0 && (
                                            <span
                                                className={`min-w-[15px] h-[15px] px-1 rounded-full text-[9.5px] font-bold inline-flex items-center justify-center leading-none shrink-0 ${
                                                    isActive
                                                        ? 'bg-[#FF4A1F] text-white'
                                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                }`}
                                            >
                                                {tab.count}
                                            </span>
                                        )}
                                        {isThisTabCustom && (
                                            <span
                                                role="button"
                                                tabIndex={0}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCustomThirdTab(null);
                                                    setFilterTab('all');
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.stopPropagation();
                                                        setCustomThirdTab(null);
                                                        setFilterTab('all');
                                                    }
                                                }}
                                                className="ml-0.5 hover:bg-orange-200/60 dark:hover:bg-orange-900/60 rounded-full p-0.5 text-[#FF4A1F] cursor-pointer inline-flex items-center justify-center"
                                                title="Reset to default pill"
                                            >
                                                <X size={10} />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* 3-Dot (•••) More Filters Button */}
                        <div className="relative shrink-0" ref={moreMenuRef}>
                            <button
                                type="button"
                                onClick={() => setIsMoreOpen((prev) => !prev)}
                                title="More filters & sorting options"
                                className={`h-[26px] w-[26px] rounded-full cursor-pointer flex items-center justify-center transition-all ${
                                    isMoreOpen
                                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                                }`}
                            >
                                <MoreHorizontal size={14} />
                            </button>

                            {/* Popover Dropdown Menu */}
                            {isMoreOpen && (
                                <div className="absolute right-0 top-full mt-2 w-[280px] bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] shadow-2xl z-50 p-2.5 animate-in fade-in zoom-in-95 duration-150 text-xs">
                                    {/* Dropdown Header */}
                                    <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1.5">
                                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100 font-semibold">
                                            <Filter size={12} className="text-[#FF4A1F]" />
                                            <span>filter & sort</span>
                                        </div>
                                        {(filterTab !== 'all' || sortBy !== 'recent' || isThirdTabCustom) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFilterTab('all');
                                                    setCustomThirdTab(null);
                                                    if (setSortBy) setSortBy('recent');
                                                    setIsMoreOpen(false);
                                                }}
                                                className="text-[10.5px] font-semibold text-[#FF4A1F] hover:underline cursor-pointer"
                                            >
                                                reset
                                            </button>
                                        )}
                                    </div>

                                    {/* Section 1: Lifecycle Filters */}
                                    <div className="px-2 py-1 text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
                                        status & deals
                                    </div>
                                    <div className="space-y-0.5">
                                        {moreFilterOptions.map((opt) => {
                                            const isOptActive = filterTab === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setCustomThirdTab(opt.id);
                                                        setFilterTab(opt.id);
                                                        setIsMoreOpen(false);
                                                    }}
                                                    className={`w-full px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-left transition-colors cursor-pointer ${
                                                        isOptActive
                                                            ? 'bg-orange-50 dark:bg-orange-950/50 text-[#FF4A1F] font-semibold'
                                                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-normal'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        {opt.icon}
                                                        <div className="truncate">
                                                            <span className="block truncate leading-tight">{opt.label}</span>
                                                            <span className="text-[10px] text-slate-400 font-normal block truncate leading-none mt-0.5">
                                                                {opt.desc}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {opt.count > 0 && (
                                                        <span className={`min-w-[17px] h-[17px] px-1 rounded-full text-[9.5px] font-bold inline-flex items-center justify-center shrink-0 ml-1.5 ${
                                                            isOptActive ? 'bg-[#FF4A1F] text-white' : opt.badgeClass
                                                        }`}>
                                                            {opt.count}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Section 2: Sort By */}
                                    {setSortBy && (
                                        <>
                                            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1.5" />
                                            <div className="px-2 py-1 text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
                                                sort conversations
                                            </div>
                                            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                                {sortOptions.map((s) => {
                                                    const isSortActive = sortBy === s.id;
                                                    return (
                                                        <button
                                                            key={s.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSortBy(s.id);
                                                                setIsMoreOpen(false);
                                                            }}
                                                            className={`px-2 py-1.5 rounded-[4px] text-[11px] flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
                                                                isSortActive
                                                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white font-semibold shadow-xs'
                                                                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 font-normal'
                                                            }`}
                                                        >
                                                            {s.icon}
                                                            <span>{s.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat list */}
                    <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-1 [&::-webkit-scrollbar]:hidden">
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

                    {/* Resize Handle */}
                    {onResizeStart && (
                        <div
                            onMouseDown={onResizeStart}
                            className={`absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#FF4A1F]/30 transition-colors z-40 ${
                                isResizing ? 'bg-[#FF4A1F]' : ''
                            }`}
                            title="Drag to resize sidebar"
                        />
                    )}
                </div>
            )}
        </>
    );
};
