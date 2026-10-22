import { cn } from '@/lib/utils';
import React from 'react';

export type StatusCategory =
    | 'success'
    | 'pending'
    | 'in_progress'
    | 'failed'
    | 'neutral'
    | 'financial_hold'
    | 'action_required';

export const STATUS_CATEGORY_STYLES: Record<
    StatusCategory,
    { bg: string; text: string; className: string }
> = {
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

const normalizeStatus = (status: string): string =>
    status
        .trim()
        .toLowerCase()
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .replace(/_+/g, '_');

const SUCCESS_STATUSES = new Set([
    'success',
    'successful',
    'active',
    'approved',
    'accepted',
    'paid',
    'completed',
    'complete',
    'delivered',
    'agreed',
    'confirmed',
    'verified',
    'settled',
    'resolved',
    'published',
    'enabled',
    'assigned_and_accepted',
]);

const PENDING_STATUSES = new Set([
    'pending',
    'awaiting',
    'waiting',
    'waiting_for_you',
    'waiting_for_customer',
    'waiting_for_supplier',
    'pending_approval',
    'pending_review',
    'under_review',
    'awaiting_approval',
    'awaiting_payment',
    'quote_pending',
    'payment_pending',
    'requested',
    'submitted',
]);

const IN_PROGRESS_STATUSES = new Set([
    'in_progress',
    'in_transit',
    'processing',
    'assigned',
    'active_negotiation',
    'negotiating',
    'ongoing',
    'started',
    'picked_up',
    'out_for_delivery',
    'partially_completed',
    'dispatched',
    'shipping',
]);

const FAILED_STATUSES = new Set([
    'failed',
    'failure',
    'rejected',
    'declined',
    'cancelled',
    'canceled',
    'denied',
    'payment_failed',
    'delivery_failed',
    'unsuccessful',
    'terminated',
]);

const FINANCIAL_HOLD_STATUSES = new Set([
    'financial_hold',
    'escrow',
    'escrow_held',
    'held',
    'payment_on_hold',
    'on_hold',
    'funds_held',
    'payout_on_hold',
]);

const ACTION_REQUIRED_STATUSES = new Set([
    'action_required',
    'pod_pending',
    'awaiting_pod',
    'pod_approval_pending',
    'overdue',
    'requires_action',
    'needs_attention',
    'payment_overdue',
    'document_required',
    'verification_required',
]);

const NEUTRAL_STATUSES = new Set([
    'default',
    'secondary',
    'outline',
    'neutral',
    'draft',
    'closed',
    'expired',
    'inactive',
    'archived',
    'disabled',
    'unknown',
    'not_started',
    'unassigned',
]);

export function resolveStatusCategory(
    status: string
): StatusCategory {
    const value = normalizeStatus(status);

    if (!value) {
        return 'neutral';
    }

    // Specific statuses must be checked before generic statuses.
    if (FINANCIAL_HOLD_STATUSES.has(value)) {
        return 'financial_hold';
    }

    if (ACTION_REQUIRED_STATUSES.has(value)) {
        return 'action_required';
    }

    if (FAILED_STATUSES.has(value)) {
        return 'failed';
    }

    if (IN_PROGRESS_STATUSES.has(value)) {
        return 'in_progress';
    }

    if (PENDING_STATUSES.has(value)) {
        return 'pending';
    }

    if (SUCCESS_STATUSES.has(value)) {
        return 'success';
    }

    if (NEUTRAL_STATUSES.has(value)) {
        return 'neutral';
    }

    // Conservative fallback for statuses not explicitly mapped.
    return 'neutral';
}

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement> {
    variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'critical'
    | 'info'
    | 'secondary'
    | 'primary'
    | 'destructive'
    | 'outline'
    | 'error'
    | 'failed'
    | 'pending'
    | string;
    showDot?: boolean;
    children: React.ReactNode;
}

export default function Badge({
    variant = 'default',
    showDot = false,
    className,
    children,
    ...props
}: BadgeProps) {
    // Kept for backward compatibility.
    // Status badges intentionally render without decorative dots.
    void showDot;

    const normalizedVariant = normalizeStatus(variant);

    const categoryAliases: Record<string, StatusCategory> = {
        primary: 'in_progress',
        info: 'in_progress',
        warning: 'pending',
        critical: 'failed',
        error: 'failed',
        destructive: 'failed',
        secondary: 'neutral',
        outline: 'neutral',
        default: 'neutral',
    };

    const category =
        categoryAliases[normalizedVariant] ??
        resolveStatusCategory(normalizedVariant);

    return (
        <span
            className={cn(
                STATUS_BADGE_BASE_CLASS,
                STATUS_CATEGORY_STYLES[category].className,
                className
            )}
            {...props}
        >
            <span className="inline-flex items-center whitespace-nowrap">
                {children}
            </span>
        </span>
    );
}
