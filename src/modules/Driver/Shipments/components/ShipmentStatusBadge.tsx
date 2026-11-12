import React from 'react';
import { ShipmentStatus } from '../../types';
import { STATUS_BADGE_BASE_CLASS, STATUS_CATEGORY_STYLES } from '@/components/common/StatusBadge';

interface Props {
    status: ShipmentStatus;
    className?: string;
    label?: string;
}

export const ShipmentStatusBadge: React.FC<Props> = ({ status, className = '', label }) => {
    switch (status) {
        case 'in_transit':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.in_progress.className} ${className}`}>
                    {label || 'In Transit'}
                </span>
            );
        case 'at_pickup':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.in_progress.className} ${className}`}>
                    {label || 'At Pickup'}
                </span>
            );
        case 'at_delivery':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.in_progress.className} ${className}`}>
                    {label || 'At Delivery'}
                </span>
            );
        case 'assigned':
        case 'accepted':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.in_progress.className} ${className}`}>
                    {label || 'Assigned'}
                </span>
            );
        case 'delivered':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.pending.className} ${className}`}>
                    {label || 'Awaiting Review'}
                </span>
            );
        case 'completed':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.success.className} ${className}`}>
                    {label || 'Completed'}
                </span>
            );
        case 'cancelled':
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.failed.className} ${className}`}>
                    {label || 'Cancelled'}
                </span>
            );
        default:
            return (
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.neutral.className} ${className} capitalize`}>
                    {label || String(status || 'Scheduled').replace(/_/g, ' ')}
                </span>
            );
    }
};

export default ShipmentStatusBadge;
