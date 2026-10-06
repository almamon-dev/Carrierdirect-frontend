import React from "react";
import { ArrowLeft, Search, BadgeCheck, PanelLeftClose } from "lucide-react";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { CustomerChatItem, CustomerContactGroup } from "../types";
import { CustomerChatSidebarCollapsed } from "./CustomerChatSidebarCollapsed";

interface CustomerChatSidebarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    filterTab: "all" | "unread";
    setFilterTab: (val: "all" | "unread") => void;
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
        if (filteredContactGroups && filteredContactGroups.length > 0) {
            return filteredContactGroups;
        }
        if (contactGroups && contactGroups.length > 0) {
            return contactGroups;
        }
        
        const map = new Map<string, CustomerContactGroup>();
        (filteredChats.length > 0 ? filteredChats : chats).forEach(chat => {
            const senderId = chat.raw?.sender_id || chat.raw?.supplier_id || chat.raw?.user_id;
            const supplierKey = senderId
                ? `sender_${senderId}`
                : (chat.name || chat.carrier || chat.company || "supplier_partner").trim().toLowerCase();

            // Extract real latest message preview and time from chatMessages if available
            const thread = chatMessages[chat.id] || chatMessages[String(chat.id)] || (chat.raw?.rawId ? chatMessages[chat.raw.rawId] : null) || [];
            const lastMsg = thread && thread.length > 0 ? thread[thread.length - 1] : null;

            let extractedPreview = chat.preview;
            let extractedTime = chat.time;

            if (lastMsg) {
                const isMe = Boolean(
                    lastMsg.type === 'sent' || 
                    lastMsg.sender === 'customer' || 
                    (lastMsg as any).sender_type === 'customer' || 
                    (lastMsg as any).is_me === true || 
                    (lastMsg as any).isMe === true
                );

                let text = (lastMsg.text || (lastMsg as any).message || '').trim();
                if (!text && lastMsg.attachments && lastMsg.attachments.length > 0) {
                    const isImg = lastMsg.attachments.some((a: any) => a.type === 'image' || (a.url && /\.(jpe?g|png|webp|gif)/i.test(a.url)));
                    text = isImg ? '📷 Photo' : `📎 ${lastMsg.attachments[0].name || 'Attachment'}`;
                } else if (!text && lastMsg.type === 'offer') {
                    const amt = lastMsg.newTotal || (lastMsg as any).amount || (chat.currentPrice || 548);
                    text = `Revised Offer: € ${amt}`;
                } else if (!text && lastMsg.type === 'quote_request') {
                    const amt = lastMsg.newTotal || (lastMsg as any).amount || (chat.currentPrice || 548);
                    text = `Quote Request: € ${amt}`;
                } else if (!text && lastMsg.type === 'system') {
                    text = (lastMsg as any).message || lastMsg.text || 'System notification';
                }

                if (text) {
                    extractedPreview = isMe ? `You: ${text}` : text;
                }
                if (lastMsg.time) {
                    extractedTime = lastMsg.time;
                }
            }

            if (!map.has(supplierKey)) {
                map.set(supplierKey, {
                    contactId: supplierKey,
                    senderId: senderId,
                    name: chat.name || chat.carrier || chat.company || "Carrier Partner",
                    avatar: chat.avatar,
                    isOnline: Boolean(chat.isOnline),
                    lastSeenHuman: chat.lastSeenHuman,
                    lastSeenAt: chat.lastSeenAt,
                    isVerified: Boolean(chat.isVerified),
                    quotes: [chat],
                    activeQuoteId: chat.id,
                    latestActivityTime: extractedTime,
                    latestPreview: extractedPreview,
                    totalUnreadCount: chat.unreadCount || 0,
                    hasUnread: Boolean(chat.unread || (chat.unreadCount && chat.unreadCount > 0)),
                    hasPendingOffer: Boolean(chat.raw?.status === "Counter Received" || chat.raw?.status === "Pending"),
                    isPinned: Boolean(chat.isPinned)
                });
            } else {
                const group = map.get(supplierKey)!;
                group.quotes.push(chat);
                group.totalUnreadCount += (chat.unreadCount || 0);
                group.hasUnread = group.hasUnread || Boolean(chat.unread || (chat.unreadCount && chat.unreadCount > 0));
                group.isPinned = group.isPinned || Boolean(chat.isPinned);
                if (lastMsg) {
                    group.latestPreview = extractedPreview;
                    group.latestActivityTime = extractedTime;
                }
            }
        });
        return Array.from(map.values());
    }, [filteredContactGroups, contactGroups, filteredChats, chats, chatMessages]);

    const totalUnreadCount = groupsToDisplay.filter(g => !g.quotes.some(q => String(q.id) === String(activeChatId)) && (g.hasUnread || g.totalUnreadCount > 0)).length;

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
            {/* Header */}
            <div className="h-[60px] px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 box-border bg-white dark:bg-[#12161c]">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 -ml-2 cursor-pointer"
                        onClick={onBack}
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                        Negotiations
                    </h2>
                </div>
                {onToggleCollapse && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleCollapse}
                        className="h-8 w-8 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] cursor-pointer"
                        title="Collapse sidebar"
                    >
                        <PanelLeftClose size={18} />
                    </Button>
                )}
            </div>

            {/* Search */}
            <div className="px-4 pt-3 pb-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                        type="text"
                        placeholder="Search negotiations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-slate-100 dark:bg-slate-800/80 border-none rounded-full outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <button
                    type="button"
                    onClick={() => setFilterTab("all")}
                    className={`rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-colors ${
                        filterTab === "all"
                            ? "bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 border border-slate-200/80 dark:border-slate-700 font-semibold"
                    }`}
                >
                    All
                </button>
                <button
                    type="button"
                    onClick={() => setFilterTab("unread")}
                    className={`rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer whitespace-nowrap outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-colors ${
                        filterTab === "unread"
                            ? "bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 border border-slate-200/80 dark:border-slate-700 font-semibold"
                    }`}
                >
                    Unread {!isLoading && totalUnreadCount > 0 && `(${totalUnreadCount})`}
                </button>
            </div>

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
                        const isUnread = group.hasUnread;

                        return (
                            <div
                                key={group.contactId}
                                onClick={() => {
                                    if (handleSelectContact) {
                                        handleSelectContact(group);
                                    } else if (group.quotes.length > 0) {
                                        handleSelectChat(group.quotes[0].id);
                                    }
                                }}
                                className={`p-2.5 rounded-[4px] cursor-pointer flex gap-3 items-center transition-all ${
                                    isContactActive
                                        ? "bg-slate-100 dark:bg-[#1c222b] border border-slate-200 dark:border-slate-700/80 shadow-2xs"
                                        : isUnread
                                            ? "bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/80"
                                            : "hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80"
                                }`}
                            >
                                <div className="relative shrink-0 w-11 h-11">
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs border overflow-hidden ${
                                        isContactActive
                                            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50 text-[#2563EB]"
                                            : "bg-orange-50 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F]"
                                    }`}>
                                        {group.avatar && (group.avatar.startsWith("http") || group.avatar.startsWith("/storage") || group.avatar.startsWith("data:") || group.avatar.includes(".")) ? (
                                            <img
                                                src={group.avatar}
                                                alt=""
                                                className="w-full h-full object-contain"
                                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                                            />
                                        ) : (
                                            <span>{(group.name || "S").charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <span
                                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-[#12161c] ${
                                            group.isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                        title={group.isOnline ? "Active Now" : "Offline"}
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                            <h4 className={`text-[13px] truncate leading-tight ${
                                                isContactActive || isUnread ? "font-semibold text-slate-900 dark:text-white" : "font-medium text-slate-800 dark:text-slate-200"
                                            }`}>
                                                {group.name}
                                            </h4>
                                            <BadgeCheck size={13.5} className="text-[#FF4A1F] shrink-0" />
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-normal shrink-0 whitespace-nowrap">
                                            {group.latestActivityTime}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-0.5">
                                        <p className={`text-[11.5px] truncate ${
                                            isUnread ? "font-medium text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
                                        }`}>
                                            {group.latestPreview}
                                        </p>
                                        {!isContactActive && isUnread && group.totalUnreadCount > 0 ? (
                                            <span className="min-w-[18px] h-[18px] px-1 bg-[#FF4A1F] text-white text-[10px] font-semibold rounded-full flex items-center justify-center shrink-0 shadow-2xs">
                                                {group.totalUnreadCount}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
