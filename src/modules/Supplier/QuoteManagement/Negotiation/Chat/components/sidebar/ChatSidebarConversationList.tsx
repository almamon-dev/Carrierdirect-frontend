import React from 'react';
import Skeleton from '@/components/ui/skeleton';
import { NegotiationItem } from '../../../types';
import { ChatMessage } from '../../types';
import { ChatSidebarItem } from './ChatSidebarItem';

interface ChatSidebarConversationListProps {
    isLoading?: boolean;
    filteredChats: NegotiationItem[];
    activeNegotiation: NegotiationItem | null;
    pinnedChatIds: Record<string | number, boolean>;
    readChatIds: Record<string | number, boolean>;
    chatMessages: Record<string | number, ChatMessage[]>;
    liveOffers: Record<string | number, number>;
    repeatCustomerMap?: Record<string, number>;
    handleSelectChat: (item: NegotiationItem) => void;
    togglePinChat: (e: React.MouseEvent, chatId: number | string) => void;
}

export const ChatSidebarConversationList: React.FC<ChatSidebarConversationListProps> = ({
    isLoading,
    filteredChats,
    activeNegotiation,
    pinnedChatIds,
    readChatIds,
    chatMessages,
    liveOffers,
    repeatCustomerMap,
    handleSelectChat,
    togglePinChat,
}) => {
    if (isLoading) {
        return (
            <div className="space-y-1 py-1 animate-in fade-in duration-150">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="p-2.5 rounded-[4px] flex gap-3 items-center border border-transparent bg-white dark:bg-[#12161c]"
                    >
                        <Skeleton className="w-10 h-10 rounded-full shrink-0 aspect-square" />
                        <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                                <Skeleton className="h-3.5 w-28 rounded-md" />
                                <Skeleton className="h-2.5 w-12 rounded-md" />
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-0.5">
                                <Skeleton className="h-3 w-36 rounded-md" />
                                <Skeleton className="h-4 w-4 rounded-[4px]" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-150">
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
                        threadMsgs={chatMessages[item.rawId] || chatMessages[String(item.rawId)] || chatMessages[item.id] || (item.raw?.rawId ? chatMessages[item.raw.rawId] : null) || []}
                        priceDisplay={liveOffers[item.rawId] || item.currentOffer || item.originalAmount || 1850}
                        onSelect={() => handleSelectChat(item)}
                        onTogglePin={(e) => togglePinChat(e, item.rawId)}
                    />
                );
            })}
            {filteredChats.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">No negotiations found.</div>
            )}
        </div>
    );
};
