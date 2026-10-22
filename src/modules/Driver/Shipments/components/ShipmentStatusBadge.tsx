import React from 'react';
import { ShipmentStatus } from '../../types';
import { STATUS_BADGE_BASE_CLASS, STATUS_CATEGORY_STYLES } from '@/components/common/StatusBadge';

interface Props {
    status: ShipmentStatus;
    className?: string;
}

export const ShipmentStatusBadge: React.FC<Props> = ({ status, className = '' }) => {
    switch (status) {
        case 'in_transit':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.in_progress.className} ${className}`}>
                    In Transit
                </span>
            );
        case 'at_pickup':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.in_progress.className} ${className}`}>
                    At Pickup
                </span>
            );
        case 'at_delivery':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.in_progress.className} ${className}`}>
                    At Delivery
                </span>
            );
        case 'assigned':
        case 'accepted':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.in_progress.className} ${className}`}>
                    Assigned
                </span>
            );
        case 'delivered':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.pending.className} ${className}`}>
                    Awaiting Review
                </span>
            );
        case 'completed':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.success.className} ${className}`}>
                    Completed
                </span>
            );
        case 'cancelled':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.failed.className} ${className}`}>
                    Cancelled
                </span>
            );
        default:
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.neutral.className} ${className} capitalize`}>
                    {String(status || 'Scheduled').replace(/_/g, ' ')}
                </span>
            );
    }
};

export default ShipmentStatusBadge;
