import React from 'react';
import Badge from '@/components/ui/badge';
import { SupplierOrderItem } from '../types';

export const renderPaymentStatusBadge = (row: SupplierOrderItem) => {
    const cleanNum = String(row.id || row.rawId || '').replace(/^ORD-0*/i, '');
    const rawPayment = String(
        row.payment_status || row.payment_method || (row as any).payment_stage || (row as any).invoice_type || (cleanNum === '2' ? 'pay_later' : cleanNum === '3' ? 'paid' : 'in_escrow')
    ).toLowerCase().trim();

    const isPaid = (row.status === 'Completed' || (row.status_raw || '').toLowerCase() === 'completed') || rawPayment === 'paid' || (row as any).is_paid === true;
    const isPayLater = !isPaid && (
        rawPayment.includes('pay later') || rawPayment.includes('pay_later') || rawPayment.includes('net-30') || rawPayment.includes('credit') || Boolean((row as any).is_pay_later) || String((row as any).invoice_type || '').toLowerCase() === 'pay_later'
    );

    if (isPaid) {
        return (
            <div className="flex items-center justify-center min-h-[26px]">
                <Badge variant="success" showDot className="text-[10px] font-bold whitespace-nowrap">Paid</Badge>
            </div>
        );
    }
    if (isPayLater) {
        return (
            <div className="flex items-center justify-center min-h-[26px]">
                <Badge variant="warning" showDot className="text-[10px] font-bold whitespace-nowrap">Pay Later (Due)</Badge>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <Badge variant="info" className="text-[10px] font-semibold whitespace-nowrap">Pay Later</Badge>
        </div>
    );
};

export const renderPodBadge = (row: SupplierOrderItem) => {
    const tracking = (row as any).tracking || {};
    const pod = String(row.pod_status || tracking.pod_status || '').toLowerCase().trim();
    const rawStatus = String(row.status_raw || row.status || '').toLowerCase().trim();
    const hasPod = Boolean(
        row.pod_document_url ||
        row.pod_file_url ||
        row.proof_of_delivery ||
        tracking.proof ||
        tracking.signature ||
        (row as any).has_pod ||
        (row as any).signature
    );

    let variant: any = 'outline';
    let label = 'Not Uploaded';

    const isConfirmed =
        pod === 'confirmed' ||
        pod === 'approved' ||
        pod.includes('approv') ||
        pod.includes('accept') ||
        rawStatus === 'completed' ||
        rawStatus === 'pod accepted';

    const isRejected = !isConfirmed && (pod.includes('reject') || pod === 'rejected');

    const isInReview = !isConfirmed && !isRejected && (
        hasPod ||
        pod.includes('review') ||
        pod.includes('pending') ||
        pod.includes('upload') ||
        rawStatus === 'delivered' ||
        rawStatus === 'pod_uploaded'
    );

    if (isConfirmed) {
        variant = 'success';
        label = 'Approved';
    } else if (isRejected) {
        variant = 'critical';
        label = 'Rejected';
    } else if (isInReview) {
        variant = 'secondary';
        label = 'In Review';
    } else {
        variant = 'outline';
        label = 'Not Uploaded';
    }

    return (
        <div className="flex items-center min-h-[26px]">
            <Badge variant={variant} className="text-[10.5px] font-semibold whitespace-nowrap">{label}</Badge>
        </div>
    );
};

export const renderOrderStatusBadge = (row: SupplierOrderItem) => {
    const rawStatus = String(row.status_raw || row.status || 'confirmed').toLowerCase().trim();
    let displayStatus = 'Confirmed';
    let variant: any = 'info';

    if (rawStatus === 'completed' || rawStatus === 'pod accepted') {
        displayStatus = 'Completed';
        variant = 'success';
    } else if (rawStatus.includes('review') || rawStatus.includes('pod_uploaded') || rawStatus === 'delivered') {
        displayStatus = 'POD Review';
        variant = 'secondary';
    } else if (rawStatus.includes('cancel')) {
        displayStatus = 'Cancelled';
        variant = 'critical';
    } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way') {
        displayStatus = 'In Transit';
        variant = 'warning';
    } else if (rawStatus === 'picked_up' || rawStatus === 'in_progress') {
        displayStatus = 'Picked Up';
        variant = 'warning';
    } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'dispatched') {
        displayStatus = 'Driver Assigned';
        variant = 'info';
    } else {
        displayStatus = row.status || (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1));
        variant = 'secondary';
    }

    return (
        <div className="flex items-center min-h-[26px]">
            <Badge variant={variant} showDot className="text-[10.5px] font-bold whitespace-nowrap">
                {displayStatus}
            </Badge>
        </div>
    );
};
