import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { decryptId } from '@/lib/encryption';
import { markRequestAsViewed } from '../../utils/requestStatusTracker';
import { mapSubmitQuoteDetail } from '../utils/detailMapper';

const getInitialEmptyDetails = (id: string): QuoteRequest => ({
    id: id ? `REQ-${id}` : '',
    slug: id || '',
    requestDate: '',
    customer: '',
    pickup: '',
    delivery: '',
    distance: '',
    budget: '—',
    status: 'New',
    priority: 'Normal',
    dimensions: [],
    cargoItems: [],
    documents: []
} as unknown as QuoteRequest);

export function useSubmitQuoteDetails(slug?: string) {
    const rawCleanId = slug ? decryptId(slug).replace('REQ-', '').trim() : '';
    const [requestDetails, setRequestDetails] = useState<QuoteRequest>(() => getInitialEmptyDetails(rawCleanId));
    const [loading, setLoading] = useState<boolean>(true);
    const [apiData, setApiData] = useState<Record<string, any>>({});

    useEffect(() => {
        let isMounted = true;
        const cleanId = slug ? decryptId(slug).replace('REQ-', '').trim() : '';
        
        if (!cleanId) { 
            setLoading(false); 
            return; 
        }

        markRequestAsViewed(cleanId);
        setLoading(true);

        apiClient.get(ENDPOINTS.SUPPLIER.REQUEST_DETAIL(cleanId))
            .then(res => {
                if (!isMounted) return;
                const raw = res.data?.data || res.data || res;
                const { requestDetails: mapped, apiData: mappedApi } = mapSubmitQuoteDetail(raw, cleanId);
                setApiData(mappedApi);
                setRequestDetails(mapped);
            })
            .catch(err => {
                console.error('Failed to load supplier request detail', err);
            })
            .finally(() => { 
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, [slug]);

    return {
        loading,
        requestDetails,
        apiData,
        rawId: rawCleanId,
    };
}
