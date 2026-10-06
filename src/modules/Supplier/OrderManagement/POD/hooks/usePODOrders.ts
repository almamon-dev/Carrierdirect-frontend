import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { PODOrderItem } from '../types';

export const usePODOrders = () => {
    const [orders, setOrders] = useState<PODOrderItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const fetchOrders = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const res = await apiClient.get('/supplier/orders');
            const rawList =
                (Array.isArray(res?.data?.data?.data) && res.data.data.data) ||
                (Array.isArray(res?.data?.data) && res.data.data) ||
                (Array.isArray(res?.data?.orders?.data) && res.data.orders.data) ||
                (Array.isArray(res?.data?.orders) && res.data.orders) ||
                (Array.isArray(res?.data) && res.data) ||
                (Array.isArray(res) && res) ||
                [];

            if (Array.isArray(rawList) && rawList.length > 0) {
                const normalized: PODOrderItem[] = rawList.map((o: any) => {
                    const clientObj = o?.client || {};
                    const shippingObj = o?.shipping || {};
                    const paymentObj = o?.payment || {};
                    const shipmentObj = o?.shipment || {};
                    const trackingObj = o?.tracking || {};

                    const customerName =
                        clientObj.name ||
                        o?.customer?.name ||
                        o?.customer_name ||
                        o?.client_name ||
                        o?.user?.name ||
                        'Verified Shipper';

                    const customerAvatar =
                        clientObj.avatar ||
                        o?.customer?.profile_picture ||
                        o?.customer?.avatar ||
                        o?.customer_avatar ||
                        '';

                    const pickupFull =
                        shippingObj.from ||
                        o?.pickup_address ||
                        o?.pickup_full_address ||
                        [o?.pickup_city, o?.pickup_country].filter(Boolean).join(', ') ||
                        '';
                    const deliveryFull =
                        shippingObj.to ||
                        o?.delivery_address ||
                        o?.delivery_full_address ||
                        [o?.delivery_city, o?.delivery_country].filter(Boolean).join(', ') ||
                        '';

                    const pickupCity =
                        o?.pickup_city ||
                        (pickupFull ? pickupFull.split(',')[0]?.trim() : '') ||
                        '';
                    const deliveryCity =
                        o?.delivery_city ||
                        (deliveryFull ? deliveryFull.split(',')[0]?.trim() : '') ||
                        '';

                    const routeDisplay =
                        shippingObj.route ||
                        (pickupCity && deliveryCity ? `${pickupCity} → ${deliveryCity}` : pickupFull && deliveryFull ? `${pickupFull} → ${deliveryFull}` : '');

                    const vehicle =
                        shippingObj.service ||
                        o?.vehicle ||
                        o?.vehicle_type ||
                        o?.truck_type ||
                        o?.pallet_type ||
                        'Covered Van (20ft)';

                    const rawWeight =
                        shipmentObj.total_weight ||
                        o?.weight ||
                        o?.cargo_weight;
                    let weightVal = '1,500 KG';
                    if (rawWeight && !String(rawWeight).toUpperCase().includes('N/A') && rawWeight !== '0 kg' && rawWeight !== 0) {
                        weightVal = String(rawWeight).toUpperCase().includes('KG') ? String(rawWeight).toUpperCase() : `${rawWeight} KG`;
                    }

                    const rawPallets =
                        shipmentObj.description ||
                        o?.load_type ||
                        o?.type_of_pallets ||
                        o?.pallets ||
                        o?.pallet_type;
                    let palletsVal = 'Pallets';
                    if (rawPallets && rawPallets !== '0 Items' && !String(rawPallets).toUpperCase().includes('N/A') && rawPallets !== '0') {
                        palletsVal = rawPallets;
                    }

                    const podDocUrl = trackingObj.proof || o?.proof_of_delivery || o?.pod_document_url || o?.pod_file_url || o?.file_url || o?.pod_url || '';
                    const hasPod = Boolean(podDocUrl);

                    const rawPod = String(trackingObj.pod_status || o?.pod_status || o?.podStatus || o?.status || '').toLowerCase();
                    let podStatus: 'Not Uploaded' | 'Pending Review' | 'Approved' | 'Rejected' = 'Not Uploaded';

                    if (!hasPod || rawPod === 'not_uploaded' || rawPod === 'awaiting' || rawPod === 'none' || rawPod.includes('not')) {
                        podStatus = 'Not Uploaded';
                    } else if (rawPod.includes('approv') || rawPod.includes('accept') || rawPod === 'confirmed') {
                        podStatus = 'Approved';
                    } else if (rawPod.includes('reject')) {
                        podStatus = 'Rejected';
                    } else {
                        podStatus = 'Pending Review';
                    }

                    const rawTotal =
                        paymentObj.total ??
                        o?.total_amount ??
                        o?.amount ??
                        o?.agreed_price ??
                        o?.total;
                    let formattedAmt = '—';
                    if (paymentObj.formatted) {
                        formattedAmt = paymentObj.formatted;
                    } else if (typeof rawTotal === 'number') {
                        formattedAmt = `€ ${rawTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                    } else if (typeof rawTotal === 'string' && rawTotal) {
                        formattedAmt = rawTotal.startsWith('€') || rawTotal.startsWith('$') ? rawTotal : `€ ${rawTotal}`;
                    }

                    return {
                        id: o?.id || '1',
                        rawId: o?.id,
                        slug: String(o?.slug || o?.id || ''),
                        order_id: o?.order_no || o?.order_number || (o?.id ? `ORD-${String(o.id).padStart(4, '0')}` : 'ORD-0001'),
                        order_no: o?.order_no || o?.order_number,
                        order_number: o?.order_number || o?.order_no,
                        customer_name: customerName,
                        customer_avatar: customerAvatar,
                        customer_phone: o?.customer?.phone || o?.client_phone || o?.customer_phone || '+44 7700 900077',
                        customer_email: o?.customer?.email || o?.client_email || o?.customer_email || 'shipper@example.com',
                        customer_rating: o?.customer?.rating || o?.rating || '4.9',
                        customer_verified: o?.customer?.is_verified ?? true,
                        customer: o?.customer || {
                            name: customerName,
                            avatar: customerAvatar,
                            rating: o?.rating || '4.9',
                            is_verified: true,
                        },
                        pickup_city: pickupCity,
                        pickup_address: pickupFull,
                        delivery_city: deliveryCity,
                        delivery_address: deliveryFull,
                        route: routeDisplay,
                        vehicle,
                        vehicle_type: vehicle,
                        vehicle_plate: o?.vehicle?.plate || o?.vehicle_plate || 'GB-24-TRK',
                        driver: o?.driver?.name || o?.driver_name || 'Assigned Driver',
                        driver_name: o?.driver?.name || o?.driver_name || 'Assigned Driver',
                        driver_phone: o?.driver?.phone || o?.driver_phone || '',
                        weight: weightVal,
                        cargo_weight: weightVal,
                        pallets: palletsVal,
                        type_of_pallets: palletsVal,
                        load_type: palletsVal,
                        pickup_date: shippingObj.pickup_at || o?.pickup_date || o?.created_at || '',
                        delivery_date: o?.delivery_date || o?.estimated_delivery || o?.eta || shippingObj.pickup_at || '',
                        amount: formattedAmt,
                        total_amount: formattedAmt,
                        amount_raw: typeof rawTotal === 'number' ? rawTotal : parseFloat(String(rawTotal || '0')),
                        status: o?.status || 'In Transit',
                        status_raw: String(o?.status || '').toLowerCase(),
                        pod_status: podStatus,
                        pod_status_raw: rawPod,
                        pod_document_url: podDocUrl,
                        pod_file_url: podDocUrl,
                        pod_file_name: podDocUrl ? (podDocUrl.split('/').pop() || `Signed_POD_ORD-${o?.id}.pdf`) : `Signed_POD_ORD-${o?.id}.pdf`,
                        has_pod: hasPod,
                    };
                });
                setOrders(normalized);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Failed to fetch POD orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const uploadPOD = async (orderId: string | number, file: File): Promise<boolean> => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('proof', file);

            const cleanId = String(orderId).replace('ORD-', '');
            await apiClient.post(`/supplier/orders/${cleanId}/pod-reupload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            await fetchOrders(true);
            return true;
        } catch (error) {
            console.error('Failed to upload POD:', error);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        orders,
        isLoading,
        isRefreshing,
        isSubmitting,
        fetchOrders,
        uploadPOD,
    };
};

export default usePODOrders;
