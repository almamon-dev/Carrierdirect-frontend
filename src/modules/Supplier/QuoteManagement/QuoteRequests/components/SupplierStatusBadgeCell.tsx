import React from 'react';

export const SupplierStatusBadgeCell: React.FC<{ status: string }> = ({ status }) => {
    const s = (status || '').toLowerCase().trim();
    const isCompleted = s === 'completed' || s === 'finished';
    const isBooked = s === 'booked' || s === 'won';
    const isConfirmed = s === 'confirmed' || s === 'confirm' || s === 'accepted' || s === 'awarded' || s === 'succeeded' || s === 'paid';
    const isDriverAssigned = s === 'driver assigned' || s === 'driver_assigned' || s === 'assigned';
    const isInTransit = s === 'in transit' || s === 'in_transit' || s === 'in progress' || s === 'in_progress' || s === 'picked up' || s === 'picked_up' || s === 'active';
    const isDelivered = s === 'delivered';
    const isPodPending = s === 'pod pending' || s === 'pod_pending' || s === 'pod review' || s === 'pod_review' || s === 'pod uploaded' || s === 'pod_uploaded';
    const isQuoted = s === 'quoted' || s === 'bidding active' || s === 'negotiating';
    const isViewed = s === 'viewed';
    const isNew = s === 'new' || s === 'pending';
    const isCancelled = s === 'cancelled' || s === 'expired' || s === 'closed' || s === 'rejected' || s === 'failed' || s === 'lost' || s === 'declined';

    let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    let dotStyle = 'bg-slate-400 dark:bg-slate-500';
    let label = status || 'New';

    if (isCompleted) {
        badgeStyle = 'bg-[#f0fdf4] dark:bg-emerald-950/50 text-[#16a34a] dark:text-emerald-300 border-[#bbf7d0] dark:border-emerald-800/70';
        dotStyle = 'bg-[#22c55e]';
        label = 'Completed';
    } else if (isBooked) {
        badgeStyle = 'bg-[#eff6ff] dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-300 border-[#bfdbfe] dark:border-blue-800/60';
        dotStyle = 'bg-[#3b82f6]';
        label = 'Booked';
    } else if (isConfirmed) {
        badgeStyle = 'bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border-[#a7f3d0] dark:border-emerald-800/60';
        dotStyle = 'bg-[#10b981]';
        label = status || 'Confirmed';
    } else if (isDriverAssigned) {
        badgeStyle = 'bg-[#f5f3ff] dark:bg-purple-950/40 text-[#7c3aed] dark:text-purple-300 border-[#ddd6fe] dark:border-purple-800/60';
        dotStyle = 'bg-[#8b5cf6]';
        label = 'Driver Assigned';
    } else if (isInTransit) {
        badgeStyle = 'bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-300 border-[#fde68a] dark:border-amber-800/60';
        dotStyle = 'bg-[#f59e0b]';
        label = s === 'picked up' || s === 'picked_up' ? 'Picked Up' : 'In Transit';
    } else if (isDelivered) {
        badgeStyle = 'bg-[#f0fdfa] dark:bg-teal-950/40 text-[#0d9488] dark:text-teal-300 border-[#99f6e4] dark:border-teal-800/60';
        dotStyle = 'bg-[#14b8a6]';
        label = 'Delivered';
    } else if (isPodPending) {
        badgeStyle = 'bg-[#fff7ed] dark:bg-orange-950/40 text-[#ea580c] dark:text-orange-300 border-[#fed7aa] dark:border-orange-800/60';
        dotStyle = 'bg-[#f97316]';
        label = 'POD Pending';
    } else if (isQuoted) {
        badgeStyle = 'bg-[#eff6ff] dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-300 border-[#bfdbfe] dark:border-blue-800/60';
        dotStyle = 'bg-[#3b82f6]';
        label = s === 'quoted' ? 'Quoted' : status;
    } else if (isViewed) {
        badgeStyle = 'bg-[#faf5ff] dark:bg-purple-950/40 text-[#9333ea] dark:text-purple-300 border-[#e9d5ff] dark:border-purple-800/60';
        dotStyle = 'bg-[#a855f7]';
        label = 'Viewed';
    } else if (isNew) {
        badgeStyle = 'bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-300 border-[#fde68a] dark:border-amber-800/60';
        dotStyle = 'bg-[#f59e0b]';
        label = status || 'New';
    } else if (isCancelled) {
        badgeStyle = 'bg-[#fef2f2] dark:bg-rose-950/40 text-[#dc2626] dark:text-rose-300 border-[#fecaca] dark:border-rose-800/60';
        dotStyle = 'bg-[#ef4444]';
        label = status || 'Cancelled';
    }

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-[4px] font-bold whitespace-nowrap border ${badgeStyle}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotStyle} shrink-0`} />
                <span>{label}</span>
            </span>
        </div>
    );
};
