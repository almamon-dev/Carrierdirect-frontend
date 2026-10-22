import React from 'react';
import { StatusBadge, resolveStatusCategory } from '@/components/common/StatusBadge';

export const SupplierStatusBadgeCell: React.FC<{ status: string }> = ({ status }) => {
    const s = (status || '').toLowerCase().trim();
    let displayLabel = status || 'New';

    if (s === 'completed' || s === 'finished') {
        displayLabel = 'Completed';
    } else if (s === 'booked' || s === 'won') {
        displayLabel = 'Booked';
    } else if (s === 'confirmed' || s === 'accepted' || s === 'awarded' || s === 'succeeded' || s === 'paid') {
        displayLabel = status || 'Confirmed';
    } else if (s === 'driver assigned' || s === 'driver_assigned' || s === 'assigned') {
        displayLabel = 'Driver Assigned';
    } else if (s === 'in transit' || s === 'in_transit' || s === 'in progress' || s === 'in_progress' || s === 'active') {
        displayLabel = 'In Transit';
    } else if (s === 'picked up' || s === 'picked_up') {
        displayLabel = 'Picked Up';
    } else if (s === 'delivered') {
        displayLabel = 'Delivered';
    } else if (s === 'pod pending' || s === 'pod_pending' || s === 'pod review' || s === 'pod_review' || s === 'pod uploaded' || s === 'pod_uploaded') {
        displayLabel = 'POD Pending';
    } else if (s === 'quoted' || s === 'bidding active' || s === 'negotiating') {
        displayLabel = s === 'quoted' ? 'Quoted' : status;
    } else if (s === 'viewed') {
        displayLabel = 'Viewed';
    } else if (s === 'new' || s === 'pending') {
        displayLabel = status || 'New';
    } else if (s === 'cancelled' || s === 'expired' || s === 'closed' || s === 'rejected' || s === 'failed' || s === 'lost' || s === 'declined') {
        displayLabel = status || 'Cancelled';
    }

    const category = resolveStatusCategory(s, 'quote');

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <StatusBadge category={category} label={displayLabel} />
        </div>
    );
};

export default SupplierStatusBadgeCell;
