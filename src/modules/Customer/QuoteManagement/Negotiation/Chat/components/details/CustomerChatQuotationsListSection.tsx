import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { CustomerChatItem } from "../../types";
import StatusBadge from "@/components/common/StatusBadge";

interface CustomerChatQuotationsListSectionProps {
    contactQuotes: CustomerChatItem[];
    activeChat: CustomerChatItem;
    isOpen: boolean;
    onToggle: () => void;
    onSelectQuote?: (id: number | string) => void;
    supplierSlug: string;
}

export const CustomerChatQuotationsListSection: React.FC<CustomerChatQuotationsListSectionProps> = ({
    contactQuotes,
    activeChat,
    isOpen,
    onToggle,
    onSelectQuote,
    supplierSlug,
}) => {
    const navigate = useNavigate();
    const showSeeAll = contactQuotes.length > 4;
    const displayedQuotes = showSeeAll ? contactQuotes.slice(0, 4) : contactQuotes;

    return (
        <div>
            <div
                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors select-none"
                onClick={onToggle}
            >
                <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">
                    Quotations ({contactQuotes.length})
                </span>
                <ChevronDown size={15} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="px-4 pb-2">
                    <div className="space-y-2">
                        {displayedQuotes.map((q, idx) => {
                            const isSelected = String(q.id) === String(activeChat.id);
                            const rawStatusLower = String(q.raw?.status_raw || q.raw?.status || (q as any).status || "Active").toLowerCase();
                            const isBooked = Boolean(
                                q.raw?.is_paid ||
                                q.raw?.has_order ||
                                q.raw?.order_id ||
                                (q as any).isPaid ||
                                (q as any).hasOrder ||
                                rawStatusLower === "booked" ||
                                rawStatusLower.includes("book")
                            );
                            let statusLabel = q.raw?.status || (q as any).status || "Active";
                            if (isBooked) statusLabel = "Booked";
                            else if (rawStatusLower.includes("accept")) statusLabel = "Accepted";
                            else if (rawStatusLower.includes("reject") || rawStatusLower.includes("decline")) statusLabel = "Rejected";
                            else if (rawStatusLower.includes("expire")) statusLabel = "Expired";
                            else if (rawStatusLower.includes("pending")) statusLabel = "Pending";

                            return (
                                <div
                                    key={q.id}
                                    onClick={() => onSelectQuote && onSelectQuote(q.id)}
                                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${isSelected
                                        ? "border-[#ff4a1f] bg-orange-50/40 dark:bg-[#ff4a1f]/10 shadow-2xs"
                                        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700"
                                    }`}
                                >
                                    {/* Card Header: Badge, Quote ID, and Price */}
                                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span
                                                className={`w-5 h-5 rounded-full text-[10.5px] font-bold flex items-center justify-center shrink-0 transition-colors ${isSelected
                                                    ? "bg-[#FF4A1F] text-white shadow-2xs"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                                                }`}
                                            >
                                                {idx + 1}
                                            </span>
                                            <span className={`text-[12.5px] font-bold ${isSelected ? "text-[#FF4A1F]" : "text-slate-800 dark:text-slate-200"}`}>
                                                {q.quoteNo}
                                            </span>
                                        </div>
                                        <span className={`text-[13px] font-bold ${isSelected ? "text-[#FF4A1F]" : "text-slate-900 dark:text-slate-100"}`}>
                                            € {Number(q.currentPrice || 0).toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Key : Value Details Table */}
                                    <table className="w-full text-[11px] border-collapse">
                                        <tbody>
                                            <tr className="border-b border-slate-100/60 dark:border-slate-800/60">
                                                <td className="py-1 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[70px]">Status</td>
                                                <td className="py-1 text-slate-400 font-bold text-center w-[15px] select-none">:</td>
                                                <td className="py-1 pl-1 text-right">
                                                    <StatusBadge status={statusLabel} label={statusLabel} context="quote" />
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-100/60 dark:border-slate-800/60">
                                                <td className="py-1 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[70px] align-top">Pickup</td>
                                                <td className="py-1 text-slate-400 font-bold text-center w-[15px] select-none align-top">:</td>
                                                <td className="py-1 pl-1 text-slate-700 dark:text-slate-300 font-medium text-right leading-snug break-words text-[10.5px]" title={q.origin || q.raw?.pickup || '-'}>
                                                    {q.origin || q.raw?.pickup || '-'}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-100/60 dark:border-slate-800/60">
                                                <td className="py-1 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[70px] align-top">Delivery</td>
                                                <td className="py-1 text-slate-400 font-bold text-center w-[15px] select-none align-top">:</td>
                                                <td className="py-1 pl-1 text-slate-700 dark:text-slate-300 font-medium text-right leading-snug break-words text-[10.5px]" title={q.destination || q.raw?.delivery || '-'}>
                                                    {q.destination || q.raw?.delivery || '-'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap w-[70px]">Distance</td>
                                                <td className="py-1 text-slate-400 font-bold text-center w-[15px] select-none">:</td>
                                                <td className="py-1 pl-1 text-slate-700 dark:text-slate-300 font-semibold text-right">
                                                    {q.distance || '—'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                    </div>

                    {showSeeAll && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                            <button
                                type="button"
                                onClick={() => navigate(`/customer/quotes/negotiation/supplier/${supplierSlug}`)}
                                className="text-[11.5px] font-semibold text-[#FF4A1F] hover:text-[#e03f19] transition-colors py-1 cursor-pointer flex items-center justify-center gap-1 w-full"
                            >
                                <span>View all</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
