import { SupplierOrder, OrderStatus } from '../types/order.types';

export function mapApiOrderToSupplierOrder(o: any): SupplierOrder {
    const rawStatus = (o?.status || 'Scheduled').toLowerCase();
    let status: OrderStatus = 'Scheduled';
    if (rawStatus.includes('transit') || rawStatus === 'in_progress' || rawStatus === 'picked_up') {
        status = 'In Transit';
    } else if (rawStatus.includes('deliver') || rawStatus === 'completed') {
        status = 'Delivered';
    } else if (rawStatus.includes('dispatch')) {
        status = 'Dispatched';
    } else if (rawStatus.includes('arrive')) {
        status = 'Arrived';
    } else if (rawStatus.includes('cancel')) {
        status = 'Cancelled';
    } else if (rawStatus === 'confirmed' || rawStatus === 'pending') {
        status = 'Scheduled';
    }

    let podStatus: 'Pending Review' | 'Approved' | 'Rejected' | 'Not Uploaded' = 'Not Uploaded';
    const rawPod = (o?.pod_status || o?.podStatus || o?.tracking?.pod_status || '').toLowerCase();
    if (rawPod.includes('approve')) podStatus = 'Approved';
    else if (rawPod.includes('reject')) podStatus = 'Rejected';
    else if (rawPod.includes('review') || rawPod.includes('pending') || rawPod === 'awaiting') podStatus = 'Pending Review';

    const clientObj = o?.client || {};
    const shippingObj = o?.shipping || {};
    const paymentObj = o?.payment || {};
    const shipmentObj = o?.shipment || {};
    const trackingObj = o?.tracking || {};

    const pickupAddress = shippingObj.from || o?.pickup_address || o?.pickup_full_address || [o?.pickup_city, o?.pickup_country].filter(Boolean).join(', ') || 'Origin Address';
    const deliveryAddress = shippingObj.to || o?.delivery_address || o?.delivery_full_address || [o?.delivery_city, o?.delivery_country].filter(Boolean).join(', ') || 'Destination Address';
    const customerName = clientObj.name || o?.customer?.name || o?.client_name || o?.user?.name || o?.customer_name || 'Verified Customer';

    const rawTotal = paymentObj.total ?? o?.total_amount ?? o?.total ?? o?.amount ?? o?.agreed_price;
    const formattedTotal = paymentObj.formatted || (rawTotal ? (String(rawTotal).includes('€') ? String(rawTotal) : `€${Number(rawTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}`) : '€0.00');

    const rawWeight = shipmentObj.total_weight || (o?.weight ? `${o.weight} kg` : null);
    const weight = rawWeight && !String(rawWeight).toUpperCase().includes('N/A') ? (String(rawWeight).toLowerCase().includes('kg') ? String(rawWeight) : `${rawWeight} kg`) : '1,500 kg';

    const rawLoadType = shipmentObj.description || o?.load_type || shippingObj.service || o?.pallet_type;
    const loadType = rawLoadType && rawLoadType !== '0 Items' && !String(rawLoadType).toUpperCase().includes('N/A') ? rawLoadType : 'Pallet Transport';

    const isPayLater = Boolean(
        o?.is_pay_later || 
        o?.payment?.is_pay_later ||
        paymentObj.is_pay_later ||
        paymentObj.invoice_type === 'pay_later' || 
        o?.invoice_type === 'pay_later' || 
        o?.payment_method === 'pay_later' || 
        o?.payment_type === 'pay_later' ||
        paymentObj.payment_method === 'pay_later' ||
        o?.payment_status?.toLowerCase().includes('pay later') ||
        paymentObj.status?.toLowerCase().includes('pay later')
    );
    const isPaid = Boolean(
        !isPayLater && (
            o?.is_paid || 
            paymentObj.is_paid || 
            o?.payment_status?.toLowerCase() === 'paid' || 
            paymentObj.status?.toLowerCase() === 'paid' ||
            status === 'Delivered'
        )
    );
    const paymentStatus = o?.payment_status || paymentObj.status || (isPayLater ? 'Pay Later (Net-30)' : (isPaid ? 'Paid' : 'In Escrow'));

    return {
        id: o?.order_no || o?.order_number || (o?.id ? `ORD-${o.id}` : `ORD-${o?.slug || '0000'}`),
        slug: String(o?.id || o?.slug || ''),
        customer: customerName,
        customerPhone: o?.customer?.phone || o?.client_phone || o?.customer_phone || '+44 7700 900077',
        customerEmail: o?.customer?.email || o?.client_email || o?.customer_email || 'client@example.com',
        pickup: pickupAddress,
        pickupFullAddress: pickupAddress,
        pickupDate: shippingObj.pickup_at || (o?.pickup_date ? new Date(o.pickup_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'),
        pickupTimeWindow: o?.pickup_time_window || '08:00 – 12:00',
        delivery: deliveryAddress,
        deliveryFullAddress: deliveryAddress,
        deliveryDate: o?.delivery_date ? new Date(o.delivery_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Tomorrow',
        deliveryTimeWindow: o?.delivery_time_window || '14:00 – 18:00',
        distance: o?.est_distance || o?.distance_miles ? `${o.est_distance || o.distance_miles} km` : (shippingObj.route ? `${shippingObj.route}` : '450 km'),
        estimatedDuration: o?.duration || o?.estimated_duration || 'Scheduled',
        driver: o?.driver?.name || o?.driver_name || '',
        driverPhone: o?.driver?.phone || o?.driver_phone || '',
        vehicle: shippingObj.service || o?.pallet_type || o?.vehicle?.name || o?.vehicle_name || 'Pallet Transport',
        vehiclePlate: o?.vehicle?.plate || o?.vehicle_plate || 'GB-24-TRK',
        status,
        loadType,
        weight,
        volume: o?.volume ? `${o.volume} m³` : '12 m³',
        agreedPrice: formattedTotal,
        platformFee: o?.platform_fee ? `€${Number(o.platform_fee).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '€0.00',
        netPayout: formattedTotal,
        podStatus,
        podFileUrl: trackingObj.proof || o?.pod_document_url || o?.pod_url || o?.pod_file_url || '',
        podUploadDate: o?.pod_uploaded_at ? new Date(o.pod_uploaded_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : undefined,
        cargoItemsCount: shipmentObj.items_count || o?.items_count || (Array.isArray(o?.items) ? o.items.length : 1),
        payment_status: paymentStatus,
        payout_status: paymentStatus,
        payment_method: o?.payment_method || paymentObj.payment_method || (isPayLater ? 'pay_later' : undefined),
        invoice_type: o?.invoice_type || paymentObj.invoice_type || (isPayLater ? 'pay_later' : undefined),
        is_pay_later: isPayLater,
        is_paid: isPaid,
        is_escrow: !isPayLater && !isPaid,
        payment: paymentObj,
        timeline: trackingObj.history || o?.timeline || [
            { title: 'Order Booked', description: 'Shipper confirmed quote and booked order.', timestamp: '10:00 AM', completed: true },
            { title: 'In Transit', description: 'Cargo picked up and in transit.', timestamp: '01:00 PM', completed: ['In Transit', 'Arrived', 'Delivered'].includes(status), current: status === 'In Transit' },
            { title: 'Delivered', description: 'Delivered to destination.', timestamp: '04:30 PM', completed: status === 'Delivered', current: status === 'Delivered' },
        ]
    };
}
