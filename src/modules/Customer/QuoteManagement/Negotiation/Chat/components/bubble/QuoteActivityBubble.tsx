import { FileText, RefreshCw, Tag } from "lucide-react";
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
    // Format quote reference with single # prefix
    const cleanQuoteNo = String(quoteNumber).replace(/^#+/, "");
    const formattedQuoteRef = `#${cleanQuoteNo}`;

    // Format amount if available
    let formattedAmount = "";
    if (amount !== undefined && amount !== null && amount !== "") {
        const num = typeof amount === "number" ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, ""));
        if (!isNaN(num)) {
            formattedAmount = `${currency} ${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            formattedAmount = `${currency} ${amount}`;
        }
    }

    const bubbleRadiusClass = "rounded-[4px]";

    if (type === "quote_request") {
        const locationPart = origin
            ? ` for transport from ${origin}${distance ? ` (${distance})` : ""}`
            : "";

        return (
            <div className={`relative w-full max-w-full ${bubbleRadiusClass} bg-[#ecfdf5] dark:bg-[#064e3b]/25 border border-[#a7f3d0] dark:border-[#065f46]/60 p-3 sm:p-3.5 shadow-2xs font-sans animate-in fade-in-50 duration-150`}>
                <div className="flex items-start gap-2.5 sm:gap-3">
                    {/* Green circular document icon */}
                    <div className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <FileText size={14} className="stroke-[2.2] shrink-0" />
                    </div>

                    <div className="min-w-0 flex-1">
                        {/* Title & Time */}
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {isSent ? "Quote Request Submitted" : "New Quote Request"}
                            </h4>
                            {time && (
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                                    {time}
                                </span>
                            )}
                        </div>

                        {/* Body text */}
                        <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                            {customMessage || (
                                isSent ? (
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
                                )
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (type === "counter_offer") {
        return (
            <div className={`relative w-full max-w-full ${bubbleRadiusClass} bg-[#eff6ff] dark:bg-[#1e3a8a]/25 border border-[#bfdbfe] dark:border-[#1e40af]/60 p-3 sm:p-3.5 shadow-2xs font-sans animate-in fade-in-50 duration-150`}>
                <div className="flex items-start gap-2.5 sm:gap-3">
                    {/* Blue circular tag icon */}
                    <div className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Tag size={14} className="stroke-[2.2] shrink-0" />
                    </div>

                    <div className="min-w-0 flex-1">
                        {/* Title & Time */}
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {isSent ? "Counter Offer Submitted" : "Counter Offer Received"}
                            </h4>
                            {time && (
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                                    {time}
                                </span>
                            )}
                        </div>

                        {/* Body text */}
                        <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                            {customMessage || (
                                isSent ? (
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
                                )
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (type === "quote_offer") {
        return (
            <div className={`relative w-full max-w-full ${bubbleRadiusClass} bg-[#eff6ff] dark:bg-[#1e3a8a]/25 border border-[#bfdbfe] dark:border-[#1e40af]/60 p-3 sm:p-3.5 shadow-2xs font-sans animate-in fade-in-50 duration-150`}>
                <div className="flex items-start gap-2.5 sm:gap-3">
                    {/* Blue circular tag icon */}
                    <div className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Tag size={14} className="stroke-[2.2] shrink-0" />
                    </div>

                    <div className="min-w-0 flex-1">
                        {/* Title & Time */}
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {isSent ? "Quotation Offer Submitted" : "Quotation Offer Received"}
                            </h4>
                            {time && (
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                                    {time}
                                </span>
                            )}
                        </div>

                        {/* Body text */}
                        <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                            {customMessage || (
                                isSent ? (
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
                                )
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Default: revised_offer
    return (
        <div className={`relative w-full max-w-full ${bubbleRadiusClass} bg-[#fff7ed] dark:bg-[#7c2d12]/25 border border-[#fed7aa] dark:border-[#9a3412]/60 p-3 sm:p-3.5 shadow-2xs font-sans animate-in fade-in-50 duration-150`}>
            <div className="flex items-start gap-2.5 sm:gap-3">
                {/* Orange circular refresh icon */}
                <div className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full bg-[#FF6A00] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <RefreshCw size={14} className="stroke-[2.2] shrink-0" />
                </div>

                <div className="min-w-0 flex-1">
                    {/* Title & Time */}
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {isSent ? "Revised Offer Submitted" : "Revised Offer Received"}
                        </h4>
                        {time && (
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                                {time}
                            </span>
                        )}
                    </div>

                    {/* Body text */}
                    <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                        {customMessage || (
                            isSent ? (
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
                            )
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuoteActivityBubble;
