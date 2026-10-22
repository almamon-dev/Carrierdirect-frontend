import React from 'react';
import { formatDisplayDate } from '@/lib/utils';

export const PriorityCell: React.FC<{ priority: string }> = ({ priority }) => {
    const p = (priority || '').toLowerCase().trim();
    const isActionRequired = p === 'urgent' || p === 'high';

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center justify-center px-[10px] py-[4px] text-[12px] font-semibold leading-none rounded-[2px] whitespace-nowrap ${
                isActionRequired ? 'bg-[#F5D0AD] text-[#8A4210]' : 'bg-[#D8DCE3] text-[#374151]'
            }`}>
                {priority || 'Standard'}
            </span>
        </div>
    );
};

export const StatusCell: React.FC<{ status?: string; row?: any }> = ({ status, row }) => {
    const isAwaitingPayment = Boolean(
        row?.isAwaitingPayment ||
        row?.is_awaiting_payment ||
        status === 'Awaiting Payment' ||
        row?.status === 'Awaiting Payment' ||
        ((row?.statusRaw === 'accepted' || row?.status === 'Accepted' || status === 'Accepted') && (row && !row.isPaid && !row.is_paid && !row.isCompleted && !row.isBooked))
    );

    const s = isAwaitingPayment ? 'awaiting payment' : (status || row?.status || "").toLowerCase().trim();
    let displayLabel = isAwaitingPayment ? 'Awaiting Payment' : (status || row?.status || "Open");

    let colorClass = "bg-[#BBD8F7] text-[#1E40AF]"; // default in progress/open

    if (s === "awaiting payment" || s === "awaiting_payment") {
        colorClass = "bg-[#D8DCE3] text-[#374151]";
    } else if (s === "booked" || s === "completed" || s === "won" || s === "succeeded" || s === "paid" || s === "accepted" || s === "awarded" || s === "confirmed") {
        colorClass = "bg-[#BBEBD0] text-[#166534]";
    } else if (s.includes("counter received") || s === "counter_received") {
        colorClass = "bg-[#F5D0AD] text-[#8A4210]";
    } else if (s.includes("counter") || s === "negotiating" || s === "in discussion" || s === "active negotiation" || s === "open") {
        colorClass = "bg-[#BBD8F7] text-[#1E40AF]";
    } else if (s === "closed" || s === "expired" || s === "draft") {
        colorClass = "bg-[#D8DCE3] text-[#374151]";
    } else if (s === "rejected" || s === "failed" || s === "declined" || s === "cancelled") {
        colorClass = "bg-[#F4C2C2] text-[#991B1B]";
    }

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center justify-center px-[10px] py-[3.5px] text-[11.5px] font-semibold leading-none rounded-[2px] whitespace-nowrap ${colorClass}`}>
                {displayLabel}
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
