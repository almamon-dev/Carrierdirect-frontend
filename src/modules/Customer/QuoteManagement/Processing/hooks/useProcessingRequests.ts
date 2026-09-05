import { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';

export function useProcessingRequests() {
    const showToast = useToastStore((state) => state.showToast);
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchProcessingRequests = async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const endpoint = ENDPOINTS.CUSTOMER.QUOTE_REQUESTS || '/customer/quote-requests';
            const res = await apiClient.get(endpoint, {
                params: { per_page: 50 }
            });
            const rawData = res.data?.data;
            const items = Array.isArray(rawData) ? rawData : (rawData?.data || res.data?.items || []);

            if (Array.isArray(items)) {
                const mapped = items.map((r: any) => {
                    const pickup = r.pickup_address || r.pickup_city || 'Dhaka';
                    const delivery = r.delivery_address || r.delivery_city || 'Chittagong';
                    const fromCity = r.pickup_city || pickup.split(',')[0]?.trim() || pickup;
                    const toCity = r.delivery_city || delivery.split(',')[0]?.trim() || delivery;
                    const bidsCount = Number(r.quotes_count ?? r.quotesCount ?? r.bids_count ?? (r.quotes?.length || 0));

                    return {
                        id: r.id,
                        rawId: r.id,
                        requestId: r.request_id || `REQ-${String(r.id).replace(/^QT-0+/, 'QT-')}`,
                        title: r.request_title || `REQ-${String(r.id).replace(/^QT-0+/, 'QT-')}`,
                        pickup,
                        delivery,
                        route: { from: fromCity, to: toCity, fullFrom: pickup, fullTo: delivery },
                        vehicleType: r.vehicle_type || 'Covered Van',
                        palletType: r.type_of_pallets || r.load_type || 'Standard Euro Pallets',
                        cargoWeight: r.weight ? `${r.weight} KG` : '2,500 KG',
                        itemsCount: r.items_count || r.items?.length || 1,
                        priority: r.priority || 'Medium',
                        status: r.status || 'Active',
                        rawStatus: (r.raw_status || r.status || 'active').toLowerCase(),
                        bidsCount,
                        pickupDate: r.pickup_date || 'Standard Pickup',
                        deliveryDate: r.delivery_date || 'Standard Delivery',
                        createdAt: r.created_at,
                        additionalNotes: r.additional_notes || '',
                        budget: r.budget ? `€ ${Number(r.budget).toLocaleString()}` : null,
                    };
                });

                setRequests(mapped);
                if (isManualRefresh) {
                    showToast(`Refreshed ${mapped.length} processing quote request(s).`, 'success');
                }
            } else {
                setRequests([]);
            }
        } catch (err: any) {
            console.error('Failed to load processing requests:', err);
            if (isManualRefresh) {
                showToast('Failed to refresh data from server.', 'error');
            }
        } finally {
            setIsLoading(false);
            if (isManualRefresh) {
                setTimeout(() => setIsRefreshing(false), 300);
            }
        }
    };

    useEffect(() => {
        fetchProcessingRequests();
    }, []);

    const stats = useMemo(() => {
        let totalQuotes = 0;
        let withQuotes = 0;
        let awaitingQuotes = 0;
        let highPriority = 0;

        requests.forEach((r) => {
            totalQuotes += r.bidsCount;
            if (r.bidsCount > 0) withQuotes++;
            else awaitingQuotes++;
            if (String(r.priority).toLowerCase() === 'high') highPriority++;
        });

        return {
            total: requests.length,
            totalQuotes,
            withQuotes,
            awaitingQuotes,
            highPriority
        };
    }, [requests]);

    return {
        requests,
        isLoading,
        isRefreshing,
        stats,
        fetchProcessingRequests,
    };
}
