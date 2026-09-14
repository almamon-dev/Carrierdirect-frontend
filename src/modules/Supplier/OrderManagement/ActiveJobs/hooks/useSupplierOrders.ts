import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { SupplierOrderItem } from '../types';

export const useSupplierOrders = () => {
    const [orders, setOrders] = useState<SupplierOrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [ratingTarget, setRatingTarget] = useState<any>(null);

    const fetchOrders = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const response = await apiClient.get('/supplier/orders');
            const data = response?.data?.data || response?.data || [];

            if (Array.isArray(data)) {
                const normalized: SupplierOrderItem[] = data.map((o: any) => {
                    const shippingObj = o?.shipping || {};
                    const trackingObj = o?.tracking || {};
                    const clientObj = o?.client || o?.customer || {};
                    const paymentObj = o?.payment || {};

                    const customerName = clientObj.name || o?.customer_name || 'Customer';
                    const customerAvatar = clientObj.avatar || o?.customer_avatar || o?.customer_profile_picture;
                    const pickupFull = shippingObj.from || o?.pickup_address || o?.pickup_city || 'Dhaka';
                    const deliveryFull = shippingObj.to || o?.delivery_address || o?.delivery_city || 'Chittagong';

                    const pickupCity = (pickupFull.split(',')[0] || pickupFull).trim();
                    const deliveryCity = (deliveryFull.split(',')[0] || deliveryFull).trim();
                    const routeDisplay = `${pickupCity} → ${deliveryCity}`;

                    const vehicle = shippingObj.service || o?.vehicle || o?.vehicle_type || o?.truck_type || 'Pallets';
                    
                    const shipmentObj = o?.shipment || {};
                    const rawWeight = shipmentObj.total_weight || o?.total_weight || o?.weight || o?.cargo_weight;
                    let weightVal = '1,500 KG';
                    if (rawWeight && !String(rawWeight).toUpperCase().includes('N/A') && rawWeight !== '0 kg' && rawWeight !== 0) {
                        weightVal = String(rawWeight).toUpperCase().includes('KG') ? String(rawWeight).toUpperCase() : `${rawWeight} KG`;
                    }

                    const palletsVal = shipmentObj.description || o?.type_of_pallets || o?.pallets || o?.load_type || '1 Pallets';

                    let formattedAmt = '€ 0,00';
                    const rawTotal = paymentObj.total ?? o?.total_amount ?? o?.amount ?? o?.net_payout;
                    if (paymentObj.formatted) {
                        formattedAmt = paymentObj.formatted;
                    } else if (typeof rawTotal === 'number') {
                        formattedAmt = `€ ${rawTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;
                    } else if (typeof rawTotal === 'string' && rawTotal) {
                        formattedAmt = rawTotal.startsWith('€') || rawTotal.startsWith('$') ? rawTotal : `€ ${rawTotal}`;
                    }

                    const rawStatus = (o?.status_raw || o?.status || 'confirmed').toLowerCase().trim();
                    let displayStatus = 'Confirmed';

                    if (rawStatus === 'completed' || rawStatus === 'pod accepted') {
                        displayStatus = 'Completed';
                    } else if (rawStatus.includes('cancel')) {
                        displayStatus = 'Cancelled';
                    } else if (rawStatus.includes('review') || rawStatus.includes('pod_uploaded')) {
                        displayStatus = 'POD Review';
                    } else if (rawStatus === 'delivered') {
                        displayStatus = 'Delivered';
                    } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way') {
                        displayStatus = 'In Transit';
                    } else if (rawStatus === 'picked_up' || rawStatus === 'in_progress') {
                        displayStatus = 'Picked Up';
                    } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'dispatched') {
                        displayStatus = 'Driver Assigned';
                    } else if (rawStatus === 'confirmed' || rawStatus === 'scheduled' || rawStatus === 'pending') {
                        displayStatus = 'Confirmed';
                    } else {
                        displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
                    }

                    const podDocUrl = trackingObj.proof || o?.proof_of_delivery || o?.pod_document_url || o?.pod_file_url || o?.pod_url || '';
                    const rawPod = String(trackingObj.pod_status || o?.pod_status || o?.podStatus || '').toLowerCase();
                    
                    let podStatus = 'Not Uploaded';
                    if (!podDocUrl || rawPod === 'not_uploaded' || rawPod === 'awaiting' || rawPod === 'none' || rawPod === '') {
                        podStatus = 'Not Uploaded';
                    } else if (rawPod.includes('approv') || rawPod.includes('accept') || rawPod === 'confirmed') {
                        podStatus = 'Approved';
                    } else if (rawPod.includes('reject')) {
                        podStatus = 'Rejected';
                    } else {
                        podStatus = 'Pending Review';
                    }

                    const deliveryEtaDate = shippingObj.delivery_at || o?.delivery_date || o?.estimated_delivery || o?.eta || '';

                    return {
                        id: o?.id || '1',
                        rawId: o?.id,
                        slug: String(o?.slug || o?.id || ''),
                        order_id: o?.order_no || o?.order_number || (o?.id ? `ORD-${String(o.id).padStart(4, '0')}` : 'ORD-0001'),
                        order_no: o?.order_no || o?.order_number,
                        order_number: o?.order_number || o?.order_no,
                        quote_id: o?.quote_id,
                        quote_request_id: o?.quote_request_id,
                        customer_name: customerName,
                        customer_avatar: customerAvatar,
                        customer_phone: o?.customer?.phone || o?.client_phone || o?.customer_phone || '+880 1712 345678',
                        customer_email: o?.customer?.email || o?.client_email || o?.customer_email || 'shipper@example.com',
                        customer_rating: o?.customer?.rating || o?.rating || '4.9',
                        customer_verified: o?.customer?.is_verified ?? true,
                        customer: o?.customer || {
                            name: customerName,
                            avatar: customerAvatar,
                            rating: o?.rating || '4.9',
                            is_verified: true,
                            completed_orders: '120+ shipments',
                        },
                        pickup_city: pickupCity,
                        pickup_address: pickupFull,
                        pickup_full_address: pickupFull,
                        delivery_city: deliveryCity,
                        delivery_address: deliveryFull,
                        delivery_full_address: deliveryFull,
                        route: routeDisplay,
                        vehicle,
                        vehicle_type: vehicle,
                        vehicle_plate: o?.vehicle?.plate || o?.vehicle_plate || 'DE-TR-8821',
                        driver: o?.driver?.name || o?.driver_name || 'Assigned Driver',
                        driver_name: o?.driver?.name || o?.driver_name || 'Assigned Driver',
                        driver_phone: o?.driver?.phone || o?.driver_phone || '',
                        weight: weightVal,
                        cargo_weight: weightVal,
                        pallets: palletsVal,
                        type_of_pallets: palletsVal,
                        load_type: palletsVal,
                        pickup_date: shippingObj.pickup_at || o?.pickup_date || o?.created_at || '',
                        pickup_time_window: o?.pickup_time_window || '08:00 – 12:00',
                        delivery_date: deliveryEtaDate,
                        delivery_time_window: o?.delivery_time_window || '14:00 – 18:00',
                        estimated_delivery: deliveryEtaDate,
                        eta: deliveryEtaDate,
                        amount: formattedAmt,
                        total_amount: formattedAmt,
                        amount_raw: typeof rawTotal === 'number' ? rawTotal : parseFloat(String(rawTotal || '0')),
                        agreed_price: formattedAmt,
                        net_payout: formattedAmt,
                        payment_status: paymentObj.status || o?.payment_status || (paymentObj.is_paid ? 'Paid' : 'In Escrow'),
                        status: displayStatus,
                        status_raw: rawStatus,
                        pod_status: podStatus,
                        pod_document_url: podDocUrl,
                        pod_file_url: podDocUrl,
                        created_at: o?.created_at || o?.date || '',
                        date: o?.created_at || o?.date || '',
                        order_date: o?.created_at || o?.date || '',
                        is_rated: Boolean(o?.is_rated),
                        timeline: trackingObj.history || o?.timeline || [],
                    };
                });
                setOrders(normalized);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Failed to fetch supplier orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleRatingSubmit = async (data: any) => {
        if (!ratingTarget) return;
        try {
            await apiClient.post('/supplier/reviews', data);
            setOrders(prev => prev.map(o => String(o.id) === String(ratingTarget.id) ? { ...o, is_rated: true } : o));
            setRatingTarget(null);
        } catch (err) {
            console.error('Failed to submit review:', err);
            setOrders(prev => prev.map(o => String(o.id) === String(ratingTarget.id) ? { ...o, is_rated: true } : o));
            setRatingTarget(null);
        }
    };

    return {
        orders,
        isLoading,
        isRefreshing,
        ratingTarget,
        setRatingTarget,
        fetchOrders,
        handleRatingSubmit,
    };
};

export default useSupplierOrders;
