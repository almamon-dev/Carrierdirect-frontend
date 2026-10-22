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

    const isAwaitingPayment = Boolean(
        row?.is_awaiting_payment ||
        row?.isAwaitingPayment ||
        raw === 'awaiting_payment' ||
        raw === 'awaiting payment' ||
        ((raw === 'accepted' || raw === 'won') && !isBooked)
    );

    if (isAwaitingPayment) {
        return { text: 'Awaiting Payment', statusKey: 'awaiting_payment', isExpired: false };
    }

    if (raw === 'expired' || ((raw === 'pending' || raw === 'rejected' || raw === 'closed') && (isDateExpired || reasonIndicatesExpiry))) {
        return { text: 'Expired', statusKey: 'expired', isExpired: true };
    }

    if (raw === 'rejected' || raw === 'declined') return { text: 'Rejected', statusKey: 'rejected', isExpired: false };
    if (raw === 'cancelled') return { text: 'Cancelled', statusKey: 'cancelled', isExpired: false };

    if (row?.revision_status === 'pending' || row?.revisionStatus === 'pending' || row?.is_negotiating || row?.isNegotiating || row?.has_negotiation_messages || row?.hasNegotiationMessages || raw === 'negotiating' || raw.includes('counter')) {
        return { text: 'Negotiating', statusKey: 'negotiating', isExpired: false };
    }

    if (raw === 'accepted' || raw === 'won') return { text: 'Accepted', statusKey: 'accepted', isExpired: false };
    if (raw === 'pending' || raw === 'submitted' || raw === 'new') return { text: 'New', statusKey: 'pending', isExpired: false };

    const statusStr = typeof row?.status === 'string' ? row.status : (typeof row === 'string' ? row : 'Pending');
    const capitalized = statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
    return { text: capitalized, statusKey: raw, isExpired: false };
};

import { StatusBadge, resolveStatusCategory } from '@/components/common/StatusBadge';

export const QuotesReceivedStatusCell: React.FC<{ row?: any; status?: string }> = ({ row, status }) => {
    const { text, statusKey } = getQuoteStatusInfo(row || status || {});
    const category = resolveStatusCategory(statusKey, 'quote');

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <StatusBadge category={category} label={text} />
        </div>
    );
};

export const QuotesReceivedStatusBadgeCell = QuotesReceivedStatusCell;
