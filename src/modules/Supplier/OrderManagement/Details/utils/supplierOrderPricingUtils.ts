export const resolveSupplierOrderStatus = (
    rawStatus: string,
    isPodAccepted: boolean
): string => {
    const s = rawStatus.toLowerCase().trim().replace(/_/g, ' ');
    if (s === 'completed' || s === 'pod accepted' || isPodAccepted) return 'Completed';
    if (s.includes('cancel')) return 'Cancelled';
    if (s.includes('review') || s.includes('pod uploaded') || s === 'delivered') return 'POD Review';
    if (s === 'arrived' || s === 'destination reached') return 'Arrived';
    if (s === 'in transit' || s === 'on the way' || s === 'in progress') return 'In Transit';
    if (s === 'picked up' || s === 'goods picked up' || s === 'cargo loaded') return 'Picked Up';
    if (s === 'driver assigned' || s === 'assigned' || s === 'dispatched') return 'Driver Assigned';
    if (s === 'confirmed' || s === 'scheduled' || s === 'order confirmed') return 'Confirmed';
    if (s === 'pending') return 'Pending';
    return rawStatus ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1) : 'Confirmed';
};

export const resolveSupplierPaymentInfo = (foundOrder: any, rawStatus: string, cleanNum: string) => {
    const rawPayment = String(
        foundOrder?.payment_status ||
        foundOrder?.paymentStatus ||
        foundOrder?.payment?.status ||
        foundOrder?.payment?.payment_status ||
        foundOrder?.invoice?.status ||
        foundOrder?.invoice_type ||
        foundOrder?.payment_method ||
        (cleanNum === '2' ? 'pay_later' : cleanNum === '3' ? 'paid' : 'in_escrow')
    ).toLowerCase().trim();

    const isPaid = (rawStatus === 'completed') ||
        rawPayment === 'paid' ||
        foundOrder?.payment?.is_paid === true ||
        foundOrder?.is_paid === true;

    const isPayLater = !isPaid && (
        rawPayment.includes('pay later') ||
        rawPayment.includes('pay_later') ||
        rawPayment.includes('net-30') ||
        rawPayment.includes('credit') ||
        Boolean(foundOrder?.is_pay_later) ||
        Boolean(foundOrder?.payment?.is_pay_later) ||
        String(foundOrder?.invoice_type || '').toLowerCase() === 'pay_later' ||
        String(foundOrder?.payment_option || '').toLowerCase() === 'pay_later' ||
        String(foundOrder?.invoice?.invoice_type || '').toLowerCase() === 'pay_later'
    );

    const isEscrow = !isPaid && !isPayLater;

    let paymentStatusLabel = 'In Escrow';
    if (isPaid) {
        paymentStatusLabel = 'Paid';
    } else if (isPayLater) {
        paymentStatusLabel = 'Pay Later (Net-30)';
    } else if (rawStatus === 'delivered' || rawStatus === 'pod_uploaded') {
        paymentStatusLabel = 'POD Under Review';
    }

    return {
        isPaid,
        isPayLater,
        isEscrow,
        paymentStatusLabel,
    };
};
