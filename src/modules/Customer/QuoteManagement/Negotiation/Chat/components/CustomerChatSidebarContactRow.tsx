import React from "react";
import { BadgeCheck, CreditCard, Tag, CheckCircle2 } from "lucide-react";
import { CustomerContactGroup } from "../types";
import {
    isCustomerQuoteBooked,
    isCustomerQuoteAwaitingPayment,
    isCustomerQuoteCounterOffer
} from "../hooks/chatNegotiationHelpers";

interface CustomerChatSidebarContactRowProps {
    group: CustomerContactGroup;
    isContactActive: boolean;
    onClick: () => void;
}

export const CustomerChatSidebarContactRow: React.FC<CustomerChatSidebarContactRowProps> = ({
    group,
    isContactActive,
    onClick,
}) => {
    const isUnread = group.hasUnread;
    const quotes = group.quotes || [];
    const hasAwaitingPayment = quotes.some(isCustomerQuoteAwaitingPayment);
    const hasCounterOffer = !hasAwaitingPayment && quotes.some(isCustomerQuoteCounterOffer);
    const hasBooked = !hasAwaitingPayment && !hasCounterOffer && quotes.some(isCustomerQuoteBooked);

    // Get current quote reference & amount
    const activeQuote = quotes[0];
    const amountVal = activeQuote?.currentPrice || (activeQuote?.raw && (activeQuote.raw.amount_raw || activeQuote.raw.amount)) || null;

    return (
        <div
            onClick={onClick}
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

                {/* Status Badges & Price Tag row */}
                {(hasAwaitingPayment || hasCounterOffer || hasBooked || amountVal) && (
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

                            {activeQuote?.quoteNo && (
                                <span className="text-[10px] text-slate-400 font-semibold truncate">
                                    {activeQuote.quoteNo}
                                </span>
                            )}
                        </div>

                        {amountVal ? (
                            <span className="text-[10.5px] font-bold text-slate-800 dark:text-slate-200 shrink-0">
                                €{Number(amountVal).toLocaleString()}
                            </span>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};
