export function resolveCustomerOrderStatus(
    rawStatus: string,
    isPodAccepted: boolean
): { displayStatus: string; isPodAccepted: boolean } {
    const st = (rawStatus || 'confirmed').toLowerCase().trim();
    const podAccepted = isPodAccepted || st === 'completed' || st === 'pod accepted';

    if (st === 'completed' || st === 'pod accepted' || podAccepted) {
        return { displayStatus: 'Completed', isPodAccepted: true };
    }
    if (st.includes('cancel')) return { displayStatus: 'Cancelled', isPodAccepted: false };
    if (st.includes('review') || st.includes('pod_uploaded') || st === 'delivered') {
        return { displayStatus: 'Review & Accept POD', isPodAccepted: false };
    }
    if (st === 'arrived' || st === 'destination_reached') {
        return { displayStatus: 'Arrived at Destination', isPodAccepted: false };
    }
    if (st === 'in_transit' || st === 'on_the_way') {
        return { displayStatus: 'In Transit', isPodAccepted: false };
    }
    if (st === 'picked_up' || st === 'in_progress') {
        return { displayStatus: 'Goods Picked Up', isPodAccepted: false };
    }
    if (st === 'driver_assigned' || st === 'assigned' || st === 'dispatched') {
        return { displayStatus: 'Driver Assigned', isPodAccepted: false };
    }
    if (st === 'confirmed' || st === 'scheduled' || st === 'new') {
        return { displayStatus: 'Confirmed', isPodAccepted: false };
    }

    return {
        displayStatus: st.charAt(0).toUpperCase() + st.slice(1),
        isPodAccepted: false,
    };
}

export function resolveCustomerPaymentStatus(
    foundOrder: any,
    cleanNumericId: string,
    isPaidOverride?: boolean
): { paymentStatus: string; isPaid: boolean; isEscrow: boolean; isPayLater: boolean } {
    const rawPayment = String(
        foundOrder?.payment_status ||
        foundOrder?.paymentStatus ||
        foundOrder?.payment_term ||
        foundOrder?.payment_method ||
        (cleanNumericId === '2' ? 'pay_later' : cleanNumericId === '3' ? 'paid' : 'In Escrow')
    ).trim();

    const isPaid = isPaidOverride || rawPayment.toLowerCase() === 'paid' || foundOrder?.is_paid === true || foundOrder?.isPaid === true;

    const isPayLater = !isPaid && (
        rawPayment.toLowerCase().includes('pay later') ||
        rawPayment.toLowerCase().includes('pay_later') ||
        rawPayment.toLowerCase().includes('net-30') ||
        rawPayment.toLowerCase().includes('credit') ||
        String(foundOrder?.payment_option || '').toLowerCase() === 'pay_later'
    );

    const isEscrow = !isPaid && !isPayLater;
    const paymentStatus = isPaid ? 'Paid' : isPayLater ? 'Pay Later (Net-30)' : isEscrow ? 'In Escrow' : rawPayment;

    return { paymentStatus, isPaid, isEscrow, isPayLater };
}
