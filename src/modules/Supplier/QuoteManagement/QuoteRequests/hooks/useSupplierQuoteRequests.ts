import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { STATUS_CHANGE_EVENT } from '../../utils/requestStatusTracker';
import { mapRawQuoteRequest } from '../utils/requestMapper';

export interface SupplierTabStats {
    total: number;
    all: number;
    today: number;
    upcoming: number;
    urgent: number;
}

export function useSupplierQuoteRequests() {
    const [requests, setRequests] = useState<QuoteRequest[]>([]);
    const [stats, setStats] = useState<SupplierTabStats>({
        total: 0,
        all: 0,
        today: 0,
        upcoming: 0,
        urgent: 0,
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchRequests = useCallback(async (showSkeleton = true, params?: Record<string, any>) => {
        if (showSkeleton) setIsLoading(true);
        try {
            const res = await apiClient.get(ENDPOINTS.SUPPLIER.AVAILABLE_REQUESTS, { params });
            const responseData = res.data?.data || res.data;

            const backendStats = res.data?.stats || responseData?.stats;
            if (backendStats) {
                setStats({
                    total: backendStats.total ?? backendStats.all ?? 0,
                    all: backendStats.all ?? backendStats.total ?? 0,
                    today: backendStats.today ?? 0,
                    upcoming: backendStats.upcoming ?? 0,
                    urgent: backendStats.urgent ?? 0,
                });
            }

            const rawItems = 
                (Array.isArray(responseData?.requests?.data) && responseData.requests.data) ||
                (Array.isArray(responseData?.requests) && responseData.requests) ||
                (Array.isArray(responseData?.quote_requests?.data) && responseData.quote_requests.data) ||
                (Array.isArray(responseData?.quote_requests) && responseData.quote_requests) ||
                (Array.isArray(responseData?.available_requests?.data) && responseData.available_requests.data) ||
                (Array.isArray(responseData?.available_requests) && responseData.available_requests) ||
                (Array.isArray(res.data?.quote_requests) && res.data.quote_requests) ||
                (Array.isArray(res.data?.requests) && res.data.requests) ||
                (Array.isArray(responseData) && responseData) ||
                (Array.isArray(res.data) && res.data) ||
                [];

            const mapped: QuoteRequest[] = rawItems.map(mapRawQuoteRequest);
            setRequests(mapped);

            if (!backendStats) {
                setStats({
                    total: mapped.length,
                    all: mapped.length,
                    today: mapped.filter(item => item.isToday).length,
                    upcoming: mapped.filter(item => item.isUpcoming).length,
                    urgent: mapped.filter(item => item.isUrgent).length,
                });
            }
        } catch {
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    useEffect(() => {
        const handleStatusChange = (e: any) => {
            const { id, status } = e.detail || {};
            if (!id || !status) return;

            setRequests(prev => prev.map(r => {
                const cleanRId = String(r.rawId || r.slug || r.id).replace('REQ-', '').trim();
                const cleanTargetId = String(id).replace('REQ-', '').trim();
                if (cleanRId === cleanTargetId) {
                    return { ...r, status };
                }
                return r;
            }));
        };

        window.addEventListener(STATUS_CHANGE_EVENT, handleStatusChange);
        return () => window.removeEventListener(STATUS_CHANGE_EVENT, handleStatusChange);
    }, []);

    return {
        requests,
        setRequests,
        stats,
        isLoading,
        fetchRequests,
    };
}
