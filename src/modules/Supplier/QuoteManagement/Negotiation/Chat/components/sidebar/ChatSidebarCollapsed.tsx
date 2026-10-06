import Button from '@/components/ui/button';
import { ArrowLeft, PanelLeftOpen, Pin, Search } from 'lucide-react';
import React from 'react';
import { NegotiationItem } from '../../../types';
import { ChatMessage } from '../../types';

interface ChatSidebarCollapsedProps {
    filteredChats: NegotiationItem[];
    activeNegotiation: NegotiationItem;
    pinnedChatIds: Record<string | number, boolean>;
    readChatIds: Record<string | number, boolean>;
    chatMessages: Record<string | number, ChatMessage[]>;
    liveOffers: Record<string | number, number>;
    totalUnread: number;
    onToggleCollapse: () => void;
    setFilterTab: (t: 'all' | 'unread') => void;
    handleSelectChat: (item: NegotiationItem) => void;
    onNavigateBack: () => void;
}

export const ChatSidebarCollapsed: React.FC<ChatSidebarCollapsedProps> = ({
    filteredChats,
    activeNegotiation,
    pinnedChatIds,
    readChatIds,
    chatMessages,
    liveOffers,
    totalUnread,
    onToggleCollapse,
    setFilterTab,
    handleSelectChat,
    onNavigateBack,
}) => {
    return (
        <div className="hidden lg:flex w-[60px] shrink-0 flex-col min-h-0 h-full bg-white dark:bg-[#12161c] border-r border-slate-200 dark:border-slate-800 select-none relative transition-[width] duration-200 z-10">
            {/* Header: compact controls */}
            <div className="p-2 flex flex-col items-center border-b border-slate-200 dark:border-slate-800 gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleCollapse}
                    className="h-8 w-8 text-slate-600 dark:text-slate-300 hover:text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-[4px] cursor-pointer transition-colors"
                    title="Expand sidebar"
                >
                    <PanelLeftOpen size={17} />
                </Button>
                <button
                    type="button"
                    onClick={onNavigateBack}
                    className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer"
                    title="Back to negotiations"
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="relative h-8 w-8 text-slate-400 hover:text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer"
                    title="Search negotiations"
                >
                    <Search size={16} />
                    {totalUnread > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF4A1F]" />
                    )}
                </button>
            </div>

            {/* Avatars List */}
            <div className="flex-1 overflow-y-auto py-2 flex flex-col items-center gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                            className="relative group flex items-center justify-center cursor-pointer w-full py-0.5"
                        >
                            {/* Active left indicator pill */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#FF4A1F] rounded-r-full" />
                            )}

                            <div className={`relative rounded-full transition-all ${isActive ? 'ring-2 ring-[#FF4A1F]' : 'hover:opacity-90'}`}>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs overflow-hidden border shadow-2xs ${
                                    isActive
                                        ? 'bg-[#EFF6FF] dark:bg-blue-950/40 border-[#BFDBFE] dark:border-blue-900/50 text-[#2563EB] dark:text-blue-400'
                                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                }`}>
                                    {item.customerAvatar && (item.customerAvatar.startsWith('http') || item.customerAvatar.startsWith('/storage') || item.customerAvatar.startsWith('data:') || item.customerAvatar.includes('.')) ? (
                                        <img src={item.customerAvatar} alt={item.customer} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{(item.customer || 'C').charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#12161c] rounded-full z-10" />
                                {isUnread && (
                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF4A1F] text-white rounded-full text-[8px] font-bold flex items-center justify-center border border-white shadow-2xs">
                                        {item.unreadCount || 1}
                                    </span>
                                )}
                                {isPinned && (
                                    <span className="absolute -top-1 -left-1 w-3 h-3 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-2xs">
                                        <Pin size={7} className="fill-white rotate-45" />
                                    </span>
                                )}
                            </div>

                            {/* Hover tooltip card */}
                            <div className="absolute left-full ml-2 hidden group-hover:flex flex-col bg-slate-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-2xl z-50 pointer-events-none min-w-[160px] animate-in fade-in zoom-in-95 duration-150">
                                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1">
                                    <span className="font-bold text-white truncate max-w-[120px]">{item.customer}</span>
                                    <span className="text-[#FF4A1F] font-semibold text-[11px]">{item.quoteId}</span>
                                </div>
                                <div className="text-[11px] text-slate-300 mt-1 truncate max-w-[160px]">{previewText}</div>
                                <div className="text-[11px] text-orange-400 font-bold mt-0.5">€{priceDisplay.toLocaleString()}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
