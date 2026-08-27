import { SupplierOrder, OrderStatus } from '../types/order.types';

export function mapApiOrderToSupplierOrder(o: any): SupplierOrder {
    const rawStatus = (o?.status || 'Scheduled').toLowerCase();
    let status: OrderStatus = 'Scheduled';
    if (rawStatus.includes('transit')) status = 'In Transit';
    else if (rawStatus.includes('deliver')) status = 'Delivered';
    else if (rawStatus.includes('dispatch')) status = 'Dispatched';
    else if (rawStatus.includes('arrive')) status = 'Arrived';
    else if (rawStatus.includes('cancel')) status = 'Cancelled';

    let podStatus: 'Pending Review' | 'Approved' | 'Rejected' | 'Not Uploaded' = 'Not Uploaded';
    const rawPod = (o?.pod_status || o?.podStatus || '').toLowerCase();
    if (rawPod.includes('approve')) podStatus = 'Approved';
    else if (rawPod.includes('reject')) podStatus = 'Rejected';
    else if (rawPod.includes('review') || rawPod.includes('pending')) podStatus = 'Pending Review';

    return {
        id: o?.order_number || (o?.id ? `ORD-${o.id}` : `ORD-${o?.slug || '0000'}`),
        slug: String(o?.id || o?.slug || ''),
        customer: o?.client_name || o?.user?.name || o?.customer_name || 'Verified Customer',
        customerPhone: o?.client_phone || o?.customer_phone || '+44 7700 900077',
        customerEmail: o?.client_email || o?.customer_email || 'client@example.com',
        pickup: [o?.pickup_city, o?.pickup_country].filter(Boolean).join(', ') || o?.pickup_address || 'London',
        pickupFullAddress: o?.pickup_address || o?.pickup_full_address || [o?.pickup_city, o?.pickup_country].filter(Boolean).join(', ') || 'London, UK',
        pickupDate: o?.pickup_date ? new Date(o.pickup_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
        pickupTimeWindow: o?.pickup_time_window || '08:00 – 12:00',
        delivery: [o?.delivery_city, o?.delivery_country].filter(Boolean).join(', ') || o?.delivery_address || 'Manchester',
        deliveryFullAddress: o?.delivery_address || o?.delivery_full_address || [o?.delivery_city, o?.delivery_country].filter(Boolean).join(', ') || 'Manchester, UK',
        deliveryDate: o?.delivery_date ? new Date(o.delivery_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Tomorrow',
        deliveryTimeWindow: o?.delivery_time_window || '14:00 – 18:00',
        distance: o?.est_distance || o?.distance_miles ? `${o.est_distance || o.distance_miles} km` : '210 km',
        estimatedDuration: o?.duration || o?.estimated_duration || '3h 30m',
        driver: o?.driver?.name || o?.driver_name || 'Assigned Driver',
        driverPhone: o?.driver?.phone || o?.driver_phone || '+44 7700 900888',
        vehicle: o?.vehicle?.name || o?.vehicle_name || 'Curtainside Van',
        vehiclePlate: o?.vehicle?.plate || o?.vehicle_plate || 'GB-24-TRK',
        status,
        loadType: o?.load_type || 'General Cargo',
        weight: o?.weight ? `${o.weight} kg` : '1500 kg',
        volume: o?.volume ? `${o.volume} m³` : '12 m³',
        agreedPrice: o?.agreed_price || o?.total ? `€${Number(o.agreed_price || o.total).toLocaleString()}` : '€500',
        platformFee: o?.platform_fee ? `€${Number(o.platform_fee).toLocaleString()}` : '€50',
        netPayout: o?.net_payout || o?.amount || o?.total ? `€${Number(o.net_payout || o.amount || o.total).toLocaleString()}` : '€450',
        podStatus,
        podFileUrl: o?.pod_document_url || o?.pod_url || o?.pod_file_url || '',
        podUploadDate: o?.pod_uploaded_at ? new Date(o.pod_uploaded_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : undefined,
        cargoItemsCount: o?.items_count || (Array.isArray(o?.items) ? o.items.length : 1),
        timeline: o?.timeline || [
            { title: 'Order Booked', description: 'Shipper confirmed quote and booked order.', timestamp: '10:00 AM', completed: true },
            { title: 'Dispatched', description: 'Driver assigned and dispatched to pickup.', timestamp: '11:30 AM', completed: status !== 'Scheduled', current: status === 'Dispatched' },
            { title: 'In Transit', description: 'Cargo picked up and in transit.', timestamp: '01:00 PM', completed: ['In Transit', 'Arrived', 'Delivered'].includes(status), current: status === 'In Transit' },
            { title: 'Delivered', description: 'Delivered to destination.', timestamp: '04:30 PM', completed: status === 'Delivered', current: status === 'Delivered' },
        ]
    };
}
