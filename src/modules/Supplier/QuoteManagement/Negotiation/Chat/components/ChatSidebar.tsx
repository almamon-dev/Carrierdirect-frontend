import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BadgeCheck, Pin, PinOff } from 'lucide-react';
import Button from '@/components/ui/button';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';

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
    togglePinChat
}) => {
    const navigate = useNavigate();
    const totalUnread = allNegotiations.filter(n => !readChatIds[n.rawId] && (n.unreadCount || 0) > 0).length;

    return (
        <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col min-h-0 h-full bg-white border-r border-slate-200">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 -ml-2 cursor-pointer"
                        onClick={() => navigate('/supplier/quotes/negotiation')}
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h2 className="text-[15px] font-bold text-slate-800 tracking-tight leading-none">Negotiations</h2>
                        <span className="text-[11px] text-slate-400 font-medium">Quote Negotiations</span>
                    </div>
                </div>
            </div>

            {/* Search Input */}
            <div className="px-4 pt-3 pb-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search negotiations, routes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-700 placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
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

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-2 mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {filteredChats.map((item) => {
                    const isActive = item.rawId === activeNegotiation.rawId;
                    const isPinned = pinnedChatIds[item.rawId];
                    const isUnread = !readChatIds[item.rawId] && (item.unreadCount || 0) > 0;
                    const threadMsgs = chatMessages[item.rawId] || [];
                    const lastMsg = threadMsgs[threadMsgs.length - 1];
                    const previewText = lastMsg ? lastMsg.text : `Quote Offer ${item.budget}`;
                    const priceDisplay = liveOffers[item.rawId] || item.currentOffer || item.originalAmount || 1850;

                    return (
                        <div
                            key={item.rawId}
                            onClick={() => handleSelectChat(item)}
                            className={`p-2.5 rounded-md cursor-pointer flex gap-3 items-center group relative transition-all mt-1 ${
                                isActive ? 'bg-orange-50/60 border border-orange-200/80 shadow-2xs' : 'hover:bg-slate-50 border border-transparent'
                            }`}
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base overflow-hidden bg-slate-100 border border-slate-200">
                                    {item.customerAvatar ? (
                                        <img src={item.customerAvatar} alt={item.customer} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[#FF4A1F]">{item.customer.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full z-10 shadow-2xs" />
                            </div>

                            {/* Conversation Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <div className="flex items-center gap-1 min-w-0">
                                        <h4 className={`text-[13px] truncate ${isActive ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                            {item.customer}
                                        </h4>
                                        <span title="Verified Client"><BadgeCheck size={14} className="text-[#FF4A1F] shrink-0" /></span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 ml-1">
                                        {isPinned && <span title="Pinned"><Pin size={12} className="text-[#FF4A1F] fill-[#FF4A1F] rotate-45 shrink-0" /></span>}
                                        <button
                                            type="button"
                                            onClick={(e) => togglePinChat(e, item.rawId)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-[#FF4A1F] p-0.5 rounded cursor-pointer"
                                            title={isPinned ? 'Unpin chat' : 'Pin chat to top'}
                                        >
                                            {isPinned ? <PinOff size={12} /> : <Pin size={12} />}
                                        </button>
                                        <span className="text-[10px] text-slate-400 font-medium">{item.lastUpdated || 'Today'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-1">
                                    <p className={`text-[11.5px] truncate ${isUnread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{previewText}</p>
                                    <span className="text-[11px] font-bold text-[#FF4A1F] shrink-0">
                                        {item.currency || '€'} {priceDisplay.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                                    <span className="font-semibold text-slate-600">{item.quoteId}</span>
                                    <span>{item.distance}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredChats.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">No negotiations found.</div>
                )}
            </div>
        </div>
    );
};
