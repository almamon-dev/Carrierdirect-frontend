import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ENDPOINTS } from '@/config/api';
import apiClient from '@/lib/axios';
import { buildSecureQuoteUrl, decryptQuoteId } from '@/utils/urlSecurity';
import { useCargoServices } from '@/hooks/useCargoServices';
import { mapQuoteToFormData } from '../utils/mapQuoteToFormData';

export function useViewQuoteRequest() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { countSelected } = useCargoServices();
    const cleanId = decryptQuoteId(id);
    const activeTab = searchParams.get('tab') || 'general';

    useEffect(() => {
        if (cleanId) {
            const isUnencrypted = id && !id.startsWith('q_');
            const hasSession = searchParams.has('session_key') || searchParams.has('sk');
            const hasEnc = searchParams.has('enc_key') || searchParams.has('ek');
            if (isUnencrypted || !hasSession || !hasEnc) {
                navigate(buildSecureQuoteUrl('view', cleanId, activeTab), { replace: true });
            }
        }
    }, [cleanId, id, searchParams, navigate, activeTab]);

    const setActiveTab = (tab: string) => {
        navigate(buildSecureQuoteUrl('view', cleanId, tab), { replace: true });
    };

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<any>({
        requestTitle: '',
        priority: 'Normal',
        shipmentType: 'One Way',
        serviceType: 'Standard',
        dimensions: [{ id: 1, length: '', width: '', height: '', qty: '1', unit: 'CM' }],
        images: [] as any[],
        packingList: null as any,
        invoice: null as any,
    });

    useEffect(() => {
        async function fetchQuoteDetails() {
            if (!cleanId) return;
            try {
                let q: any = null;
                try {
                    const res = await apiClient.get(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${cleanId}`);
                    q = res.data?.data || res.data;
                } catch {
                    try {
                        const res = await apiClient.get(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${cleanId}/edit`);
                        q = res.data?.data || res.data;
                    } catch {}
                }

                if (q) {
                    setFormData(mapQuoteToFormData(q, cleanId));
                }
            } catch (err) {
                console.error('Failed to load quote details', err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchQuoteDetails();
    }, [cleanId]);

    const servicesCount = countSelected(formData);

    return {
        cleanId,
        activeTab,
        setActiveTab,
        isLoading,
        formData,
        servicesCount,
        navigate,
    };
}
