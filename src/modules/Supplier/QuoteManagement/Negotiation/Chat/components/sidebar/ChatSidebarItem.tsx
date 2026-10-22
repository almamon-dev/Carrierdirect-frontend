import { BadgeCheck, CreditCard, Tag, CheckCircle2 } from "lucide-react";
import { isSupplierQuoteBooked, isSupplierQuoteAwaitingPayment, isSupplierQuoteCounterOffer } from "../../hooks/useChatNegotiation";
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
    isRepeatCustomer?: boolean;
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

    let extractedPreview = item.notes || '';
    let extractedTime = item.lastUpdated || item.requestDate || "Recently";

    if (lastMsg) {
        const isMe = Boolean(
            lastMsg.type === 'sent' ||
            lastMsg.sender === 'supplier' ||
            (lastMsg as any).sender_type === 'supplier' ||
            (lastMsg as any).is_me === true ||
            (lastMsg as any).isMe === true
        );

        let text = (lastMsg.text || (lastMsg as any).message || '').trim();
        if (!text && lastMsg.attachments && lastMsg.attachments.length > 0) {
            const isImg = lastMsg.attachments.some(
                (a: any) => a.type === 'image' || (a.url && /\.(jpe?g|png|webp|gif)/i.test(a.url))
            );
            text = isImg ? '📷 Photo' : `📎 ${lastMsg.attachments[0].name || 'Attachment'}`;
        } else if (!text && lastMsg.type === 'offer') {
            const amt = lastMsg.newTotal || (lastMsg as any).amount || priceDisplay || 548;
            text = `Revised Offer: € ${amt}`;
        } else if (!text && lastMsg.type === 'quote_request') {
            const amt = lastMsg.newTotal || (lastMsg as any).amount || priceDisplay || 548;
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

    if (!extractedPreview) {
        const rawItem = (item as any)?.raw;
        const candidate =
            (item as any)?.last_message ||
            rawItem?.last_message ||
            (item as any)?.latest_message ||
            rawItem?.latest_message ||
            rawItem?.message_snippet ||
            item.notes;
        if (typeof candidate === 'string' && candidate.trim()) {
            extractedPreview = candidate.trim();
        } else if (candidate && typeof candidate === 'object') {
            extractedPreview = candidate.message || candidate.text || candidate.body || '';
        }
    }

    if (!extractedPreview) {
        extractedPreview = 'No messages yet';
    }

    const unreadCount = Number(item.unreadCount || 0);

    const quotes = (item as any).allCustomerQuotes || [item];
    const hasAwaitingPayment = quotes.some(isSupplierQuoteAwaitingPayment);
    const hasCounterOffer = !hasAwaitingPayment && quotes.some(isSupplierQuoteCounterOffer);
    const hasBooked = !hasAwaitingPayment && !hasCounterOffer && quotes.some(isSupplierQuoteBooked);
    const quoteNo = (item as any).quoteId || (item as any).quote_id || ((item as any).rawId ? "QT-" + String((item as any).rawId).padStart(4, "0") : null);
    const quoteAmount = priceDisplay || (item as any).amount || (item as any).currentOffer || (item as any).originalAmount || null;

    return (
        <div
            onClick={onSelect}
            className={`p-2.5 rounded-[4px] cursor-pointer flex gap-3 items-center transition-all mb-1 ${
                isActive
                    ? "bg-slate-100 dark:bg-[#1c222b] border border-slate-200 dark:border-slate-700/80 shadow-2xs"
                    : isUnread
                        ? "bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/80"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80"
            }`}
        >
            <div className="relative shrink-0 w-11 h-11">
                <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs border overflow-hidden ${
                        isActive
                            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50 text-[#2563EB]"
                            : "bg-orange-50 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F]"
                    }`}
                >
                    {item.customerAvatar &&
                    (item.customerAvatar.startsWith("http") ||
                        item.customerAvatar.startsWith("/storage") ||
                        item.customerAvatar.startsWith("data:") ||
                        item.customerAvatar.includes(".")) ? (
                        <img
                            src={item.customerAvatar}
                            alt=""
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <span>{(item.customer || "C").charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-[#12161c] ${
                        isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                    title={isOnline ? "Active Now" : "Offline"}
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <h4
                            className={`text-[13px] truncate leading-tight ${
                                isActive || isUnread
                                    ? "font-semibold text-slate-900 dark:text-white"
                                    : "font-medium text-slate-800 dark:text-slate-200"
                            }`}
                        >
                            {item.customer}
                        </h4>
                        <BadgeCheck size={13.5} className="text-[#FF4A1F] shrink-0" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal shrink-0 whitespace-nowrap">
                        {extractedTime}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                        className={`text-[11.5px] truncate ${
                            isUnread
                                ? "font-medium text-slate-900 dark:text-slate-100"
                                : "text-slate-500 dark:text-slate-400"
                        }`}
                        title={extractedPreview}
                    >
                        {extractedPreview}
                    </p>
                    {!isActive && isUnread && unreadCount > 0 ? (
                        <span className="min-w-[18px] h-[18px] px-1 bg-[#FF4A1F] text-white text-[10px] font-semibold rounded-full flex items-center justify-center shrink-0 shadow-2xs">
                            {unreadCount}
                        </span>
                    ) : null}
                </div>

                {(hasAwaitingPayment || hasCounterOffer || hasBooked || quoteAmount) && (
                    <div className="flex items-center justify-between gap-1.5 mt-1 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center gap-1 min-w-0 overflow-hidden">
                            {hasAwaitingPayment ? (
                                <span className="px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60 inline-flex items-center gap-1 shrink-0">
                                    <CreditCard size={9.5} />
                                    <span>Awaiting Payment</span>
                                </span>
                            ) : hasCounterOffer ? (
                                <span className="px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200/80 dark:border-purple-800/60 inline-flex items-center gap-1 shrink-0">
                                    <Tag size={9.5} />
                                    <span>Counter Offer</span>
                                </span>
                            ) : hasBooked ? (
                                <span className="px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 inline-flex items-center gap-1 shrink-0">
                                    <CheckCircle2 size={9.5} />
                                    <span>Booked</span>
                                </span>
                            ) : null}

                            {quoteNo && (
                                <span className="text-[10px] text-slate-400 font-semibold truncate">
                                    {quoteNo}
                                </span>
                            )}
                        </div>

                        {quoteAmount ? (
                            <span className="text-[10.5px] font-bold text-slate-800 dark:text-slate-200 shrink-0">
                                €{Number(quoteAmount).toLocaleString()}
                            </span>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};
