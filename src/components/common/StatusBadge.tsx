import { cn } from '@/lib/utils';
import React from 'react';

/**
 * Universal Status Badge Design System for CarrierDirect
 * Specifications:
 * - Border radius: exactly 4px
 * - Font size: 12px
 * - Font weight: 600 (semibold)
 * - Padding: 4px 10px
 * - Solid, professional background colors
 * - High contrast dark readable text
 * - No gradients, unnecessary borders, shadows, or decorative icons
 */

export type StatusCategory =
    | 'success'
    | 'pending'
    | 'in_progress'
    | 'failed'
    | 'neutral'
    | 'financial_hold'
    | 'action_required';

export const STATUS_CATEGORY_STYLES: Record<StatusCategory, { bg: string; text: string; className: string }> = {
    success: {
        bg: '#BBEBD0',
        text: '#166534',
        className: 'bg-[#BBEBD0] text-[#166534]',
    },
    pending: {
        bg: '#F5E3A3',
        text: '#805B10',
        className: 'bg-[#F5E3A3] text-[#805B10]',
    },
    in_progress: {
        bg: '#BBD8F7',
        text: '#1E40AF',
        className: 'bg-[#BBD8F7] text-[#1E40AF]',
    },
    failed: {
        bg: '#F4C2C2',
        text: '#991B1B',
        className: 'bg-[#F4C2C2] text-[#991B1B]',
    },
    neutral: {
        bg: '#D8DCE3',
        text: '#374151',
        className: 'bg-[#D8DCE3] text-[#374151]',
    },
    financial_hold: {
        bg: '#D9CCF5',
        text: '#5B3A91',
        className: 'bg-[#D9CCF5] text-[#5B3A91]',
    },
    action_required: {
        bg: '#F5D0AD',
        text: '#8A4210',
        className: 'bg-[#F5D0AD] text-[#8A4210]',
    },
};

export const STATUS_BADGE_BASE_CLASS =
    'inline-flex items-center justify-center px-[10px] py-[4px] text-[12px] font-semibold leading-none rounded-[2px] whitespace-nowrap shrink-0 border-0 select-none';

/**
 * Maps any raw status string or enum value across CarrierDirect to its official semantic category.
 */
export function resolveStatusCategory(rawStatus?: string | null, context?: string): StatusCategory {
    if (!rawStatus) return 'neutral';
    const s = String(rawStatus).toLowerCase().trim();

    // 1. Financial Hold
    if (
        s === 'in_escrow' ||
        s === 'in escrow' ||
        s === 'escrow' ||
        s === 'escrow held' ||
        s === 'held' ||
        s === 'payment on hold' ||
        s === 'pay later' ||
        s === 'pay_later' ||
        s === 'net-30' ||
        s === 'net-30 pay later' ||
        s === 'net 30' ||
        s === 'credit'
    ) {
        return 'financial_hold';
    }

    // 2. Action Required
    if (
        s === 'overdue' ||
        s === 'late' ||
        s === 'pod pending' ||
        s === 'pod_pending' ||
        s === 'pod review' ||
        s === 'pod_review' ||
        s === 'pod uploaded' ||
        s === 'pod_uploaded' ||
        s === 'counter received' ||
        s === 'counter offer received' ||
        s === 'action required' ||
        s === 'action_required' ||
        s === 'urgent' ||
        s === 'high' ||
        s === 'unread'
    ) {
        return 'action_required';
    }

    // 3. Failed / Rejected
    if (
        s === 'failed' ||
        s === 'rejected' ||
        s === 'declined' ||
        s === 'cancelled' ||
        s === 'canceled' ||
        s === 'void' ||
        s === 'suspended' ||
        s === 'blocked' ||
        s === 'lost' ||
        s === 'critical' ||
        s === 'error' ||
        s === 'destructive'
    ) {
        return 'failed';
    }

    // 4. Success
    if (
        s === 'paid' ||
        s === 'settled' ||
        s === 'cleared' ||
        s === 'succeeded' ||
        s === 'approved' ||
        s === 'completed' ||
        s === 'delivered' ||
        s === 'agreed' ||
        s === 'pod accepted' ||
        s === 'pod approved' ||
        s === 'won' ||
        s === 'accepted' ||
        s === 'booked' ||
        s === 'order booked' ||
        s === 'confirmed' ||
        s === 'awarded' ||
        s === 'verified' ||
        s === 'verified active' ||
        s === 'optimal'
    ) {
        return 'success';
    }

    // Active exception: Active negotiation is In Progress, otherwise Active subscription/account/driver is Success
    if (s === 'active negotiation') {
        return 'in_progress';
    }
    if (s === 'active' || s === 'available') {
        return context === 'quote' ? 'in_progress' : 'success';
    }

    // 5. In Progress
    if (
        s === 'processing' ||
        s === 'in transit' ||
        s === 'in_transit' ||
        s === 'assigned' ||
        s === 'driver assigned' ||
        s === 'driver_assigned' ||
        s === 'dispatched' ||
        s === 'booking in progress' ||
        s === 'active negotiation' ||
        s === 'negotiating' ||
        s === 'negotiation' ||
        s === 'in discussion' ||
        s === 'discussion' ||
        s === 'bidding active' ||
        s === 'picked up' ||
        s === 'picked_up' ||
        s === 'goods picked up' ||
        s === 'cargo loaded' ||
        s === 'at pickup' ||
        s === 'at_pickup' ||
        s === 'at delivery' ||
        s === 'at_delivery' ||
        s === 'arrived at consignee' ||
        s === 'on the way' ||
        s === 'on_the_way' ||
        s === 'en route' ||
        s === 'quoted' ||
        s === 'counter offer sent' ||
        s === 'counter sent' ||
        s === 'in progress' ||
        s === 'in_progress' ||
        s === 'open'
    ) {
        return 'in_progress';
    }

    // 6. Pending / Waiting
    if (
        s === 'pending' ||
        s === 'waiting' ||
        s === 'waiting for you' ||
        s === 'waiting for customer' ||
        s === 'waiting for supplier' ||
        s === 'under review' ||
        s === 'in review' ||
        s === 'pending review' ||
        s === 'pending verification' ||
        s === 'awaiting' ||
        s === 'awaiting review' ||
        s === 'awaiting payment' || s === 'awaiting_payment' || s.replace(/_/g, ' ') === 'awaiting payment' ||
        s === 'due' ||
        s === 'unpaid' ||
        s === 'scheduled' ||
        s === 'upcoming' ||
        s === 'on leave' ||
        s === 'on_leave' ||
        s === 'unavailable' ||
        s === 'invited' ||
        s === 'pending setup' ||
        s === 'unassigned' ||
        s === 'new'
    ) {
        return 'pending';
    }

    // 7. Neutral / Closed (Draft, Closed, Expired, Inactive, Viewed, Read)
    if (
        s === 'draft' ||
        s === 'closed' ||
        s === 'expired' ||
        s === 'inactive' ||
        s === 'viewed' ||
        s === 'read' ||
        s === 'not uploaded' ||
        s === 'standard' ||
        s === 'disabled' ||
        s === 'staff role' ||
        s === 'refunded' ||
        s === 'partially_refunded'
    ) {
        return 'neutral';
    }

    // Safe neutral fallback
    return 'neutral';
}

/**
 * Returns the exact CSS classes for a given status or semantic category.
 */
export function getStatusBadgeStyles(statusOrCategory?: string | null, context?: string): string {
    const isCategory = statusOrCategory && statusOrCategory in STATUS_CATEGORY_STYLES;
    const cat = isCategory
        ? (statusOrCategory as StatusCategory)
        : resolveStatusCategory(statusOrCategory, context);
    return cn(STATUS_BADGE_BASE_CLASS, STATUS_CATEGORY_STYLES[cat].className);
}

/**
 * Returns just the category color class (bg & text) without base layout classes.
 */
export function getStatusColorClass(statusOrCategory?: string | null, context?: string): string {
    const isCategory = statusOrCategory && statusOrCategory in STATUS_CATEGORY_STYLES;
    const cat = isCategory
        ? (statusOrCategory as StatusCategory)
        : resolveStatusCategory(statusOrCategory, context);
    return STATUS_CATEGORY_STYLES[cat].className;
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    status?: string | null;
    category?: StatusCategory;
    label?: React.ReactNode;
    context?: string;
    children?: React.ReactNode;
    className?: string;
}

/**
 * Standard CarrierDirect StatusBadge component.
 * Ensures consistent 4px radius, 12px font, 4px 10px padding, solid color tokens.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    category,
    label,
    context,
    children,
    className,
    ...props
}) => {
    const rawVal = label ?? children ?? status;
    const cleanLabel = typeof rawVal === 'string' 
        ? rawVal.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : rawVal;
    const resolvedCat = category || resolveStatusCategory(status || (typeof children === 'string' ? children : undefined), context);
    const catStyles = STATUS_CATEGORY_STYLES[resolvedCat].className;

    return (
        <span
            className={cn(STATUS_BADGE_BASE_CLASS, catStyles, className)}
            {...props}
        >
            {cleanLabel}
        </span>
    );
};

export default StatusBadge;
