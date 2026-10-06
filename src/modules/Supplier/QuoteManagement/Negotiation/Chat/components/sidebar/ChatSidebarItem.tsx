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
    priceDisplay,
    onSelect,
}) => {
    const isOnline = Boolean(item.isOnline);
    const lastMsg = threadMsgs && threadMsgs.length > 0 ? threadMsgs[threadMsgs.length - 1] : null;
    const isMe = lastMsg ? (lastMsg.type === 'sent' || lastMsg.sender === 'supplier' || (lastMsg as any)?.is_me || (lastMsg as any)?.isMe) : false;
    
    // Extract intelligent preview text from lastMsg
    let previewText = '';
    if (lastMsg) {
        if (lastMsg.text && lastMsg.text.trim()) {
            previewText = lastMsg.text.trim();
        } else if (lastMsg.attachments && lastMsg.attachments.length > 0) {
            const hasImg = lastMsg.attachments.some(a => a.type === 'image' || (a.url && /\.(jpe?g|png|webp|gif)/i.test(a.url)));
            previewText = hasImg ? '📷 Photo' : `📎 ${lastMsg.attachments[0].name || 'Attachment'}`;
        } else if (lastMsg.type === 'offer') {
            const amt = lastMsg.newTotal || (lastMsg as any).amount || priceDisplay || 548;
            previewText = `Revised Offer: € ${amt}`;
        } else if (lastMsg.type === 'quote_request') {
            const amt = lastMsg.newTotal || (lastMsg as any).amount || priceDisplay || 548;
            previewText = `Quote Request: € ${amt}`;
        } else if (lastMsg.type === 'system') {
            previewText = (lastMsg as any).message || lastMsg.text || 'System notification';
        } else if (lastMsg.notes) {
            previewText = lastMsg.notes;
        }
    }

    const isAccepted = item.status?.toLowerCase().includes('accept') || (item as any)?.isAccepted;
    const priceVal = priceDisplay || item.currentOffer || (item as any)?.originalAmount || (item as any)?.amount || 548;
    
    const formattedSubtitle = previewText 
        ? previewText 
        : isAccepted 
            ? `Offer Accepted • € ${priceVal}` 
            : (item.notes || 'No messages yet');

    const displayTime = lastMsg?.time || item.lastUpdated || "4 hours ago";

    // Customer initials e.g. Customer Co 1 -> C1
    const nameWords = (item.customer || 'C').split(' ');
    const initials = nameWords.length > 2 && !isNaN(Number(nameWords[nameWords.length - 1]))
        ? `${nameWords[0].charAt(0)}${nameWords[nameWords.length - 1]}`
        : `${(item.customer || 'C').charAt(0)}${nameWords.length > 1 ? nameWords[1].charAt(0) : ''}`.toUpperCase();

    return (
        <div
            onClick={onSelect}
            className={`p-2.5 rounded-[4px] cursor-pointer flex gap-3 items-center transition-all ${isActive
                    ? "bg-slate-100 dark:bg-[#1c222b] border border-slate-200 dark:border-slate-700/80 shadow-2xs"
                    : isUnread
                        ? "bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/80"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/80"
                }`}
        >
            {/* Avatar with Online/Offline Indicator */}
            <div className="relative shrink-0 w-10 h-10">
                {item.customerAvatar && (item.customerAvatar.startsWith('http') || item.customerAvatar.startsWith('/storage') || item.customerAvatar.startsWith('data:') || item.customerAvatar.includes('.')) ? (
                    <img
                        src={item.customerAvatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs border bg-[#DCFCE7] text-[#16A344] border-[#BBF7D0]"
                    >
                        {initials || "C1"}
                    </div>
                )}
                {isOnline !== false ? (
                    <span
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#12161c]"
                        title="Active Now"
                    />
                ) : (
                    <span
                        className="absolute bottom-0 right-0 w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full ring-2 ring-white dark:ring-[#12161c]"
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
                            <BadgeCheck size={13.5} className="text-[#FF6A00] shrink-0 fill-[#FF6A00]/20" />
                        )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal shrink-0 whitespace-nowrap">
                        {displayTime}
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
                        {isMe && Boolean(previewText) && <span className="text-slate-400 font-normal">You: </span>}
                        {formattedSubtitle}
                    </p>

                    {isUnread && (
                        <span className="min-w-[18px] h-[18px] px-1 bg-[#FF6A00] text-white text-[10px] font-semibold rounded-[4px] flex items-center justify-center shrink-0 shadow-2xs">
                            {item.unreadCount || 1}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
