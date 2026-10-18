import React from "react";
import Skeleton from "@/components/ui/skeleton";
import { CustomerChatFilterTab, CustomerChatItem, CustomerContactGroup } from "../types";
import { CustomerChatSidebarCollapsed } from "./CustomerChatSidebarCollapsed";
import { extractSidebarGroupsDisplay } from "./chatSidebarUtils";
import { CustomerChatSidebarHeader } from "./CustomerChatSidebarHeader";
import { CustomerChatSidebarContactRow } from "./CustomerChatSidebarContactRow";

interface CustomerChatSidebarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    filterTab: CustomerChatFilterTab;
    setFilterTab: (val: CustomerChatFilterTab) => void;
    counts?: {
        all: number;
        new: number;
        existing: number;
        unread: number;
    };
    chats?: CustomerChatItem[];
    filteredChats?: CustomerChatItem[];
    contactGroups?: CustomerContactGroup[];
    filteredContactGroups?: CustomerContactGroup[];
    activeContactGroup?: CustomerContactGroup | null;
    activeChatId: string | number;
    chatMessages?: Record<string | number, any[]>;
    handleSelectChat: (id: string | number) => void;
    handleSelectContact?: (group: CustomerContactGroup, preferredQuoteId?: number | string) => void;
    onBack: () => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
    isLoading?: boolean;
}

export const CustomerChatSidebar: React.FC<CustomerChatSidebarProps> = ({
    searchQuery,
    setSearchQuery,
    filterTab,
    setFilterTab,
    counts,
    chats = [],
    filteredChats = [],
    contactGroups = [],
    filteredContactGroups = [],
    activeContactGroup = null,
    activeChatId,
    chatMessages = {},
    handleSelectChat,
    handleSelectContact,
    onBack,
    isCollapsed = false,
    onToggleCollapse,
    isLoading = false,
}) => {
    const groupsToDisplay: CustomerContactGroup[] = React.useMemo(() => {
        return extractSidebarGroupsDisplay(
            filteredContactGroups,
            contactGroups,
            filteredChats,
            chats,
            chatMessages
        );
    }, [filteredContactGroups, contactGroups, filteredChats, chats, chatMessages]);

    const totalUnreadCount = groupsToDisplay.filter(
        g => !g.quotes.some(q => String(q.id) === String(activeChatId)) && (g.hasUnread || g.totalUnreadCount > 0)
    ).length;

    if (isCollapsed && onToggleCollapse) {
        return (
            <CustomerChatSidebarCollapsed
                groupsToDisplay={groupsToDisplay}
                activeContactGroup={activeContactGroup}
                activeChatId={activeChatId}
                totalUnreadCount={totalUnreadCount}
                onToggleCollapse={onToggleCollapse}
                onBack={onBack}
                handleSelectContact={handleSelectContact}
                handleSelectChat={handleSelectChat}
            />
        );
    }

    return (
        <div className="hidden lg:flex w-[320px] 2xl:w-[350px] shrink-0 flex-col min-h-0 h-full bg-white dark:bg-[#12161c] border-r border-slate-200 dark:border-slate-800">
            <CustomerChatSidebarHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterTab={filterTab}
                setFilterTab={setFilterTab}
                counts={counts}
                onBack={onBack}
                onToggleCollapse={onToggleCollapse}
                isLoading={isLoading}
                totalUnreadCount={totalUnreadCount}
            />

            {/* Unique Contact List */}
            <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-1 [&::-webkit-scrollbar]:hidden">
                {isLoading && groupsToDisplay.length === 0 ? (
                    <div className="space-y-1 p-0.5">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="p-2.5 rounded-[4px] flex gap-3 items-center bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-700/80"
                            >
                                <div className="relative shrink-0 w-11 h-11">
                                    <Skeleton className="w-11 h-11 rounded-full aspect-square" />
                                </div>
                                <div className="min-w-0 flex-1 space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <Skeleton className="h-3.5 w-28 rounded-md" />
                                        <Skeleton className="h-2.5 w-10 rounded-md" />
                                    </div>
                                    <Skeleton className="h-3 w-40 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : groupsToDisplay.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                        No negotiations found.
                    </div>
                ) : (
                    groupsToDisplay.map((group) => {
                        const isContactActive =
                            activeContactGroup?.contactId === group.contactId ||
                            group.quotes.some(q => String(q.id) === String(activeChatId));

                        return (
                            <CustomerChatSidebarContactRow
                                key={group.contactId}
                                group={group}
                                isContactActive={isContactActive}
                                onClick={() => {
                                    if (handleSelectContact) {
                                        handleSelectContact(group);
                                    } else if (group.quotes.length > 0) {
                                        handleSelectChat(group.quotes[0].id);
                                    }
                                }}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};
