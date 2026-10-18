import React from 'react';
import { formatDisplayDate } from '@/lib/utils';

export const PriorityCell: React.FC<{ priority: string }> = ({ priority }) => {
    const p = (priority || '').toLowerCase().trim();
    const badgeStyle = p === 'urgent'
        ? 'bg-[#fff1f2] dark:bg-rose-950/40 text-[#e11d48] dark:text-rose-300 border-[#fecdd3] dark:border-rose-800/60'
        : p === 'high'
            ? 'bg-[#fff7ed] dark:bg-orange-950/40 text-[#ea580c] dark:text-orange-300 border-[#fed7aa] dark:border-orange-800/60'
            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-[4px] font-bold whitespace-nowrap border ${badgeStyle}`}>
                {priority || 'Standard'}
            </span>
        </div>
    );
};

export const StatusCell: React.FC<{ status: string }> = ({ status }) => {
    const s = (status || "").toLowerCase().trim();
    const isBooked = s === "booked" || s === "completed" || s === "won" || s === "succeeded" || s === "paid";
    const isAccepted = s === "accepted" || s === "awarded" || s === "confirmed";
    const isCounter = (s.includes("counter") || s === "counter_offers") && !s.includes("negotiat");
    const isNegotiating = s === "negotiating" || s === "in discussion" || s === "active negotiation";
    const isClosed = s === "closed" || s === "rejected" || s === "expired" || s === "failed" || s === "declined" || s === "cancelled";

    const badgeStyle = isBooked
        ? "bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60"
        : isAccepted
            ? "bg-[#eff6ff] dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-300 border border-[#bfdbfe] dark:border-blue-800/60"
            : isCounter
                ? "bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-300 border border-[#fde68a] dark:border-amber-800/60"
                : isNegotiating
                    ? "bg-[#eff6ff] dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-300 border border-[#bfdbfe] dark:border-blue-800/60"
                    : isClosed
                    ? "bg-[#fef2f2] dark:bg-rose-950/40 text-[#dc2626] dark:text-rose-300 border border-[#fecaca] dark:border-rose-800/60"
                    : "bg-[#f0f9ff] dark:bg-sky-950/40 text-[#0284c7] dark:text-sky-300 border border-[#bae6fd] dark:border-sky-800/60";

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-[4px] font-bold whitespace-nowrap border ${badgeStyle}`}>
                {status || "Open"}
            </span>
        </div>
    );
};

export const NegotiationStatusBadgeCell = StatusCell;

export const NegotiationDateCell: React.FC<{ date?: any; row?: any }> = ({ date, row }) => {
    const rawDate = date || row?.requestDate || row?.date || row?.created_at;
    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className="whitespace-nowrap text-[12.5px] text-slate-700 dark:text-slate-300 font-semibold leading-none">
                {formatDisplayDate(rawDate) || rawDate || '—'}
            </span>
        </div>
    );
};
