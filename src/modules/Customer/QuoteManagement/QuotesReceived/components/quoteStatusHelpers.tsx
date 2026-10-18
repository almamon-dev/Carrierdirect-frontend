import React from 'react';

export const getQuoteStatusInfo = (row: any): { text: string; statusKey: string; isExpired: boolean } => {
    const raw = (row?.status_raw || row?.statusRaw || (typeof row?.status === 'string' ? row.status : '') || (typeof row === 'string' ? row : 'pending')).toLowerCase().trim();

    const expiryField = row?.valid_until || row?.expires_at || row?.expiry_date || row?.validity_date || row?.validity || row?.quote_request?.expires_at;
    let isDateExpired = false;
    if (expiryField) {
        const expiryTime = new Date(expiryField).getTime();
        if (!isNaN(expiryTime) && expiryTime < Date.now()) {
            isDateExpired = true;
        }
    }

    const reason = String(row?.reject_reason || row?.rejection_reason || row?.notes || '').toLowerCase();
    const reasonIndicatesExpiry = reason.includes('expired') || reason.includes('expiry') || reason.includes('validity') || reason.includes('time out') || reason.includes('timeout');

    if (raw === 'expired' || ((raw === 'pending' || raw === 'rejected' || raw === 'closed') && (isDateExpired || reasonIndicatesExpiry))) {
        return { text: 'Expired', statusKey: 'expired', isExpired: true };
    }

    if (row?.revision_status === 'pending' || row?.revisionStatus === 'pending' || row?.is_negotiating || row?.isNegotiating || row?.has_negotiation_messages || row?.hasNegotiationMessages) {
        return { text: 'Negotiating', statusKey: 'negotiating', isExpired: false };
    }

    const orderStatus = (row?.order_status || row?.orderStatus || row?.order?.status || '').toLowerCase().trim();
    if (orderStatus === 'completed' || raw === 'completed') {
        return { text: 'Completed', statusKey: 'completed', isExpired: false };
    }

    const isBooked = Boolean(
        raw === 'booked' ||
        ((raw === 'accepted' || raw === 'won') && (row?.is_paid || row?.isPaid || (orderStatus && !['cancelled', 'draft'].includes(orderStatus))))
    );

    if (isBooked) {
        return { text: 'Booked', statusKey: 'booked', isExpired: false };
    }

    if (raw === 'accepted' || raw === 'won') return { text: 'Accepted', statusKey: 'accepted', isExpired: false };
    if (raw === 'pending' || raw === 'submitted' || raw === 'new') return { text: 'New', statusKey: 'pending', isExpired: false };
    if (raw === 'negotiating' || raw.includes('counter')) return { text: 'Negotiating', statusKey: 'negotiating', isExpired: false };
    if (raw === 'rejected' || raw === 'declined') return { text: 'Rejected', statusKey: 'rejected', isExpired: false };
    if (raw === 'cancelled') return { text: 'Cancelled', statusKey: 'cancelled', isExpired: false };

    const statusStr = typeof row?.status === 'string' ? row.status : (typeof row === 'string' ? row : 'Pending');
    const capitalized = statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
    return { text: capitalized, statusKey: raw, isExpired: false };
};

export const QuotesReceivedStatusCell: React.FC<{ row?: any; status?: string }> = ({ row, status }) => {
    const { text, statusKey } = getQuoteStatusInfo(row || status || {});
    const s = statusKey.toLowerCase();
    const isCompleted = s === 'completed';
    const isBooked = s === 'accepted' || s === 'won' || s === 'booked' || s === 'paid';
    const isInProgress = s === 'negotiating' || s === 'active' || s.includes('counter');
    const isProcessing = s === 'pending' || s === 'pending review';
    const isCancelled = s === 'expired' || s === 'rejected' || s === 'cancelled' || s === 'declined';

    const badgeStyle = isCompleted
        ? 'bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60'
        : isBooked
            ? 'bg-[#eff6ff] dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-300 border border-[#bfdbfe] dark:border-blue-800/60'
            : isInProgress
                ? 'bg-[#eff6ff] dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-300 border border-[#bfdbfe] dark:border-blue-800/60'
            : isProcessing
                ? 'bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-300 border border-[#fde68a] dark:border-amber-800/60'
                : isCancelled
                    ? 'bg-[#fef2f2] dark:bg-rose-950/40 text-[#dc2626] dark:text-rose-300 border border-[#fecaca] dark:border-rose-800/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-[4px] font-bold whitespace-nowrap border ${badgeStyle}`}>
                {text}
            </span>
        </div>
    );
};

export const QuotesReceivedStatusBadgeCell = QuotesReceivedStatusCell;
