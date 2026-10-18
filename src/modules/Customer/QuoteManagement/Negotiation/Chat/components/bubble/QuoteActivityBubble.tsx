import { FileText, RefreshCw, Tag, LucideIcon } from "lucide-react";
import React from "react";

export type ActivityBubbleType = "quote_request" | "counter_offer" | "revised_offer" | "quote_offer";

export interface QuoteActivityBubbleProps {
    type: ActivityBubbleType;
    actorName?: string;
    quoteNumber?: string;
    origin?: string;
    destination?: string;
    distance?: string;
    amount?: number | string;
    currency?: string;
    time?: string;
    customMessage?: string;
    isSent?: boolean;
}

interface TypeConfig {
    icon: LucideIcon;
    iconBg: string;
    bg: string;
    titleSent: string;
    titleReceived: string;
}

const CONFIG: Record<ActivityBubbleType, TypeConfig> = {
    quote_request: {
        icon: FileText,
        iconBg: "bg-[#059669]",
        bg: "bg-[#ecfdf5] dark:bg-[#064e3b]/25 border-[#a7f3d0] dark:border-[#065f46]/60",
        titleSent: "Quote Request Submitted",
        titleReceived: "New Quote Request",
    },
    counter_offer: {
        icon: Tag,
        iconBg: "bg-[#2563eb]",
        bg: "bg-[#eff6ff] dark:bg-[#1e3a8a]/25 border-[#bfdbfe] dark:border-[#1e40af]/60",
        titleSent: "Counter Offer Submitted",
        titleReceived: "Counter Offer Received",
    },
    quote_offer: {
        icon: Tag,
        iconBg: "bg-[#2563eb]",
        bg: "bg-[#eff6ff] dark:bg-[#1e3a8a]/25 border-[#bfdbfe] dark:border-[#1e40af]/60",
        titleSent: "Quotation Offer Submitted",
        titleReceived: "Quotation Offer Received",
    },
    revised_offer: {
        icon: RefreshCw,
        iconBg: "bg-[#FF6A00]",
        bg: "bg-[#fff7ed] dark:bg-[#7c2d12]/25 border-[#fed7aa] dark:border-[#9a3412]/60",
        titleSent: "Revised Offer Submitted",
        titleReceived: "Revised Offer Received",
    },
};

export const QuoteActivityBubble: React.FC<QuoteActivityBubbleProps> = ({
    type,
    actorName = "Supplier Co 1",
    quoteNumber = "QT-0001",
    origin,
    distance,
    amount,
    currency = "€",
    time,
    customMessage,
    isSent = false,
}) => {
    const cleanQuoteNo = String(quoteNumber).replace(/^#+/, "");
    const formattedQuoteRef = `#${cleanQuoteNo}`;

    let formattedAmount = "";
    if (amount !== undefined && amount !== null && amount !== "") {
        const num = typeof amount === "number" ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, ""));
        if (!isNaN(num)) {
            formattedAmount = `${currency} ${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            formattedAmount = `${currency} ${amount}`;
        }
    }

    const cfg = CONFIG[type] || CONFIG.revised_offer;
    const Icon = cfg.icon;

    const renderDefaultBody = () => {
        if (type === "quote_request") {
            const locationPart = origin ? ` for transport from ${origin}${distance ? ` (${distance})` : ""}` : "";
            return isSent ? (
                <>
                    You have submitted a new quote request{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{formattedQuoteRef}</span>
                    {locationPart}. Please review the details below.
                </>
            ) : (
                <>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{actorName}</span>{" "}
                    has submitted a new quote request{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{formattedQuoteRef}</span>
                    {locationPart}. Please review the details below.
                </>
            );
        }

        if (type === "counter_offer") {
            return isSent ? (
                <>
                    You have submitted a counter offer to{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{actorName}</span>{" "}
                    for <span className="font-semibold text-slate-900 dark:text-slate-100">{formattedQuoteRef}</span>
                    {formattedAmount ? ` with a total offered rate of ${formattedAmount}` : ""}. Please review the counter offer details below.
                </>
            ) : (
                <>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{actorName}</span>{" "}
                    has submitted a counter offer for{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{formattedQuoteRef}</span>
                    {formattedAmount ? ` with a total offered rate of ${formattedAmount}` : ""}. Please review the counter offer details below.
                </>
            );
        }

        if (type === "quote_offer") {
            return isSent ? (
                <>
                    You have submitted a quotation offer to{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{actorName}</span>{" "}
                    for <span className="font-semibold text-slate-900 dark:text-slate-100">{formattedQuoteRef}</span>
                    {formattedAmount ? ` with a total rate of ${formattedAmount}` : ""}. Please review the offer details below.
                </>
            ) : (
                <>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{actorName}</span>{" "}
                    has submitted a quotation offer for{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{formattedQuoteRef}</span>
                    {formattedAmount ? ` with a total rate of ${formattedAmount}` : ""}. Please review the offer details below.
                </>
            );
        }

        // revised_offer
        return isSent ? (
            <>
                You have submitted a revised offer to{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-100">{actorName}</span>{" "}
                for <span className="font-semibold text-slate-900 dark:text-slate-100">{formattedQuoteRef}</span>
                {formattedAmount ? ` with an updated total rate of ${formattedAmount}` : " with an updated total rate"}. Please review the revised offer details below.
            </>
        ) : (
            <>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{actorName}</span>{" "}
                has submitted a revised offer for{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formattedQuoteRef}</span>
                {formattedAmount ? ` with an updated total rate of ${formattedAmount}` : " with an updated total rate"}. Please review the revised offer details below.
            </>
        );
    };

    return (
        <div className={`relative w-full max-w-full rounded-[4px] ${cfg.bg} border p-3 sm:p-3.5 shadow-2xs font-sans animate-in fade-in-50 duration-150`}>
            <div className="flex items-start gap-2.5 sm:gap-3">
                <div className={`w-7 h-7 min-w-[28px] min-h-[28px] rounded-full ${cfg.iconBg} text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}>
                    <Icon size={14} className="stroke-[2.2] shrink-0" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {isSent ? cfg.titleSent : cfg.titleReceived}
                        </h4>
                        {time && (
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                                {time}
                            </span>
                        )}
                    </div>

                    <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                        {customMessage || renderDefaultBody()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuoteActivityBubble;
