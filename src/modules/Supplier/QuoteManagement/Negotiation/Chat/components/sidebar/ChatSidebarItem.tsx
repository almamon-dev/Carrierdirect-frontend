import { BadgeCheck } from "lucide-react";
import React from "react";
import { NegotiationItem } from "../../../types";
import { ChatMessage } from "../../types";

interface ChatSidebarItemProps {
    item: NegotiationItem;
    isActive: boolean;
    isPinned?: boolean;
    isUnread: boolean;
    threadMsgs: ChatMessage[];
    priceDisplay?: number;
    onSelect: () => void;
    onTogglePin?: (e: React.MouseEvent) => void;
}

export const ChatSidebarItem: React.FC<ChatSidebarItemProps> = ({
    item,
    isActive,
    isUnread,
    threadMsgs,
    onSelect,
}) => {
    const lastMsg = threadMsgs[threadMsgs.length - 1];
    const isMe = lastMsg?.type === 'sent' || lastMsg?.sender === 'supplier' || (lastMsg as any)?.isMe;
    const previewText = lastMsg ? lastMsg.text : (item.notes || 'No messages yet');
    const isOnline = Boolean(item.isOnline);

    return (
        <div
            onClick={onSelect}
            className={`p-2.5 rounded-[4px] cursor-pointer flex gap-3 items-center transition-all ${isActive
                    ? "bg-slate-100 dark:bg-[#1c222b] border border-slate-200 dark:border-slate-700/80 shadow-2xs"
                    : isUnread
                        ? "bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/80"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80"
                }`}
        >
            {/* Avatar with Online/Offline Indicator */}
            <div className="relative shrink-0 w-11 h-11">
                {item.customerAvatar && (item.customerAvatar.startsWith('http') || item.customerAvatar.startsWith('/storage') || item.customerAvatar.startsWith('data:') || item.customerAvatar.includes('.')) ? (
                    <img
                        src={item.customerAvatar}
                        alt=""
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs border ${isActive
                                ? "bg-orange-50 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F]"
                                : "bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50 text-[#2563EB]"
                            }`}
                    >
                        {item.customer ? item.customer.charAt(0).toUpperCase() : "C"}
                    </div>
                )}
                {isOnline ? (
                    <span
                        className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#12161c]"
                        title="Active Now"
                    />
                ) : (
                    <span
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 rounded-full ring-2 ring-white dark:ring-[#12161c]"
                        title={item.lastSeenHuman || "Offline"}
                    />
                )}
            </div>

            {/* Content: Clean Minimal 2-Row Layout matching General Messages */}
            <div className="flex-1 min-w-0">
                {/* Row 1: Name, Verified Badge, Time */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <h4
                            className={`text-[13px] truncate leading-tight ${isActive || isUnread
                                    ? "font-semibold text-slate-900 dark:text-white"
                                    : "font-medium text-slate-800 dark:text-slate-200"
                                }`}
                        >
                            {item.customer}
                        </h4>
                        {item.isVerified !== false && (
                            <BadgeCheck size={13.5} className="text-[#FF4A1F] shrink-0" />
                        )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal shrink-0 whitespace-nowrap">
                        {item.lastUpdated || "Today"}
                    </span>
                </div>

                {/* Row 2: Message preview on left, Unread badge on right */}
                <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                        className={`text-[11.5px] truncate ${isUnread
                                ? "font-medium text-slate-900 dark:text-slate-100"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                    >
                        {isMe && <span className="text-slate-400 font-normal">You: </span>}
                        {previewText}
                    </p>

                    {isUnread && (
                        <span className="min-w-[18px] h-[18px] px-1 bg-[#FF4A1F] text-white text-[10px] font-semibold rounded-full flex items-center justify-center shrink-0 shadow-2xs">
                            {item.unreadCount || 1}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
