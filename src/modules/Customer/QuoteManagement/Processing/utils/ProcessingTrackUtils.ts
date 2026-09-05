export const buildOrderDetails = (id: string | undefined, foundOrder: any, isPodAccepted: boolean) => {
    const fromCity = foundOrder?.pickup_city || foundOrder?.route?.from || foundOrder?.from || 'Dhaka';
    const toCity = foundOrder?.delivery_city || foundOrder?.route?.to || foundOrder?.to || 'Chittagong';

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
            base: 1250,
            loading: 150,
            insurance: 45,
            total: foundOrder?.total_amount || (foundOrder?.amount ? (typeof foundOrder.amount === 'number' ? foundOrder.amount : parseInt(String(foundOrder.amount).replace(/[^0-9]/g, '')) || 1445) : 1445),
            advancePaid: 445,
            due: 1000
        }
    };
};

export const buildOrderTimeline = (isPodAccepted: boolean) => [
    { status: 'Order Confirmed', time: 'Jul 24, 09:00 AM', completed: true, active: false },
    { status: 'Driver Assigned', time: 'Jul 24, 11:30 AM', completed: true, active: false },
    { status: 'Goods Picked Up', time: 'Jul 25, 08:15 AM', completed: true, active: false },
    { status: 'In Transit', time: 'Jul 26, 09:30 AM', completed: true, active: true, location: 'Highway N1, Comilla Checkpoint' },
    { status: 'Destination Delivery', time: 'Jul 26, 11:45 AM', completed: isPodAccepted, active: false },
    {
        status: isPodAccepted ? 'POD Accepted' : 'Waiting for POD',
        time: isPodAccepted ? 'Just now' : 'Action Required',
        completed: isPodAccepted,
        active: false
    },
    {
        status: 'Order Completed',
        time: isPodAccepted ? 'Finished' : 'Pending',
        completed: isPodAccepted,
        active: false
    },
];
