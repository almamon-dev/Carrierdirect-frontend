export const buildOrderDetails = (id: string | undefined, foundOrder: any, isPodAccepted: boolean) => {
    const fromCity = foundOrder?.pickup_city || foundOrder?.route?.from || foundOrder?.from || 'Dhaka';
    const toCity = foundOrder?.delivery_city || foundOrder?.route?.to || foundOrder?.to || 'Chittagong';

    const totalAmount = Number(foundOrder?.total_amount_raw ?? foundOrder?.amount_raw ?? (foundOrder?.total_amount ? parseFloat(String(foundOrder.total_amount).replace(/[^0-9.]/g, '')) : (foundOrder?.amount ? parseFloat(String(foundOrder.amount).replace(/[^0-9.]/g, '')) : 1445))) || 1445;
    const baseRate = Math.round(totalAmount * 0.85);
    const loadingFee = Math.round(totalAmount * 0.10);
    const insuranceFee = Math.round(totalAmount - baseRate - loadingFee);
    const advancePaid = Math.round(totalAmount * 0.30);
    const balanceDue = totalAmount - advancePaid;

    return {
        id: id || foundOrder?.id || 'ORD-5591',
        status: isPodAccepted ? 'Payment Released (POD Accepted)' : (foundOrder?.status || 'In Transit (Pending POD)'),
        estArrival: foundOrder?.est_arrival || foundOrder?.estArrival || 'Jul 26, 2026 • 10:00 AM',
        from: fromCity.includes('(') ? fromCity : `${fromCity} (EPZ)`,
        to: toCity.includes('(') ? toCity : `${toCity} (Port)`,
        vehicle: {
            type: foundOrder?.vehicle_type || foundOrder?.vehicleType || foundOrder?.vehicle?.type || 'Covered Van (14ft)',
            number: foundOrder?.vehicle_plate || foundOrder?.vehicleNo || foundOrder?.vehicle?.number || 'DHA-11-2233',
            capacity: foundOrder?.cargoWeight || '1.5 Ton',
            goodsType: foundOrder?.goods_type || foundOrder?.goodsType || 'General Freight & Logistics'
        },
        supplier: {
            name: foundOrder?.supplier_name || foundOrder?.supplier || foundOrder?.supplier?.name || 'Global Transport Express',
            verified: true,
            rating: 4.8,
            reviews: 320,
            active: 'Active 5m ago',
            memberSince: '2023',
            completedOrders: 1540
        },
        pricing: {
            base: baseRate,
            loading: loadingFee,
            insurance: insuranceFee,
            total: totalAmount,
            advancePaid: advancePaid,
            due: balanceDue
        }
    };
};


export const buildOrderTimeline = (isPodAccepted: boolean, order?: any) => {
    const rawDate = order?.created_at || order?.pickup_date || order?.date || null;
    const baseDate = rawDate ? new Date(rawDate) : new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    
    const formatDate = (d: Date, hoursOffset = 0, minsOffset = 0) => {
        const target = new Date(d.getTime() + (hoursOffset * 60 + minsOffset) * 60 * 1000);
        return target.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const fromCity = order?.from || 'Dhaka';
    const toCity = order?.to || 'Chittagong';

    return [
        {
            status: 'Order Confirmed',
            time: formatDate(baseDate, 0, 0),
            completed: true,
            active: false
        },
        {
            status: 'Driver Assigned',
            time: formatDate(baseDate, 2, 30),
            completed: true,
            active: false
        },
        {
            status: 'Goods Picked Up',
            time: formatDate(baseDate, 18, 0),
            completed: true,
            active: false
        },
        {
            status: 'In Transit',
            time: formatDate(baseDate, 28, 15),
            completed: true,
            active: false,
            location: `Highway N1 Checkpoint (${fromCity} ➔ ${toCity})`
        },
        {
            status: 'Destination Delivery',
            time: formatDate(baseDate, 38, 45),
            completed: true,
            active: false,
            location: `${toCity} Unloading Bay`
        },
        {
            status: isPodAccepted ? 'POD Accepted' : 'Review & Accept POD',
            time: isPodAccepted ? formatDate(baseDate, 40, 0) : 'Action Required',
            completed: isPodAccepted,
            active: !isPodAccepted,
            location: isPodAccepted ? 'Receipt Verified & Confirmed' : 'Carrier submitted signed POD receipt'
        },
        {
            status: 'Order Completed',
            time: isPodAccepted ? 'Escrow Released' : 'Pending Confirmation',
            completed: isPodAccepted,
            active: false
        },
    ];
};
