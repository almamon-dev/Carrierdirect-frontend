import React from 'react';
import { ArrowLeft, PanelLeftOpen, Pin, Search } from 'lucide-react';
import Button from '@/components/ui/button';
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
        <div className="hidden lg:flex w-[72px] shrink-0 flex-col min-h-0 h-full bg-white border-r border-slate-200 select-none relative transition-[width] duration-200 z-10">
            <div className="p-3 flex flex-col items-center border-b border-slate-100 gap-2">
                <Button
                    variant="ghost" size="icon" onClick={onToggleCollapse}
                    className="h-9 w-9 text-slate-600 hover:text-[#FF4A1F] hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
                    title="Expand sidebar"
                >
                    <PanelLeftOpen size={19} />
                </Button>
                <button
                    type="button" onClick={onNavigateBack}
                    className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    title="Back to negotiations"
                >
                    <ArrowLeft size={16} />
                </button>
            </div>

            <div className="py-2.5 flex flex-col items-center gap-1.5 border-b border-slate-100">
                <button
                    type="button" onClick={onToggleCollapse}
                    className="h-9 w-9 text-slate-500 hover:text-[#FF4A1F] hover:bg-orange-50 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    title="Search negotiations"
                >
                    <Search size={16} />
                </button>
                {totalUnread > 0 && (
                    <span
                        onClick={() => { setFilterTab('unread'); onToggleCollapse(); }}
                        className="px-1.5 py-0.5 rounded-full bg-[#FF4A1F] text-white text-[9.5px] font-bold cursor-pointer hover:bg-[#E03E15] transition-colors"
                    >
                        {totalUnread}
                    </span>
                )}
            </div>

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
                            className="relative group flex items-center justify-center py-1 cursor-pointer w-full"
                        >
                            <div className={`relative rounded-full transition-all ${isActive ? 'ring-2 ring-[#FF4A1F] ring-offset-2 scale-105' : 'hover:scale-105'}`}>
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base overflow-hidden border shadow-2xs ${
                                    isActive
                                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50 text-[#2563EB]'
                                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                }`}>
                                    {item.customerAvatar ? (
                                        <img src={item.customerAvatar} alt={item.customer} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{item.customer.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full z-10 shadow-2xs" />
                                {isUnread && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4A1F] text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-2xs">
                                        {item.unreadCount || 1}
                                    </span>
                                )}
                                {isPinned && (
                                    <span className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-2xs">
                                        <Pin size={8} className="fill-white rotate-45" />
                                    </span>
                                )}
                            </div>

                            <div className="absolute left-full ml-3 hidden group-hover:flex flex-col bg-slate-900 text-white text-xs rounded-xl py-2 px-3 whitespace-nowrap shadow-2xl z-50 pointer-events-none min-w-[170px] animate-in fade-in zoom-in-95 duration-150">
                                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1">
                                    <span className="font-bold text-white truncate max-w-[130px]">{item.customer}</span>
                                    <span className="text-[#FF4A1F] font-semibold text-[11px]">{item.quoteId}</span>
                                </div>
                                <div className="text-[11px] text-slate-300 mt-1 truncate max-w-[180px]">{previewText}</div>
                                <div className="text-[11px] text-orange-400 font-bold mt-0.5">€{priceDisplay.toLocaleString()}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
