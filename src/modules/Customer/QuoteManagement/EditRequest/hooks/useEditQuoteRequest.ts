import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '@/config/api';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { QuoteFormData } from '../../CreateRequest/types/formTypes';
import { INITIAL_QUOTE_FORM_DATA, buildUpdatePayload } from '../../CreateRequest/utils/editFormHelpers';
import { useCargoServices } from '@/hooks/useCargoServices';
import { mapQuoteToEditFormData } from '../utils/mapQuoteToEditFormData';
import { useEditQuoteFormHandlers } from './useEditQuoteFormHandlers';

export function useEditQuoteRequest(cleanId?: string) {
    const navigate = useNavigate();
    const showToast = useToastStore(state => state.showToast);
    const { countSelected } = useCargoServices();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<QuoteFormData>(INITIAL_QUOTE_FORM_DATA);

    const fetchQuoteDetails = useCallback(async () => {
        if (!cleanId) return;
        setIsLoading(true);
        try {
            const res = await apiClient.get(ENDPOINTS.CUSTOMER.QUOTE_REQUEST_DETAIL(cleanId));
            const raw = res.data?.data || res.data;
            const q = raw?.quote_request || raw?.quote || raw?.request || raw;

            if (q) {
                setFormData(mapQuoteToEditFormData(q, cleanId));
            }
        } catch (err) {
            console.error('Failed to load quote details', err);
            showToast('Unable to load quote request details', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [cleanId, showToast]);

    useEffect(() => {
        fetchQuoteDetails();
    }, [fetchQuoteDetails]);

    const {
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        addDimension,
        removeDimension,
        updateDimension,
    } = useEditQuoteFormHandlers(formData, setFormData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cleanId) return;

        setIsSubmitting(true);
        try {
            const payload = buildUpdatePayload(formData);
            await apiClient.put(ENDPOINTS.CUSTOMER.QUOTE_REQUEST_DETAIL(cleanId), payload);
            showToast('Quote request updated successfully!', 'success');
            navigate(`/customer/quotes/create/view/${cleanId}`);
        } catch (err: any) {
            console.error('Failed to update quote request', err);
            const msg = err.response?.data?.message || err.message || 'Failed to update quote request';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const servicesCount = countSelected(formData);

    return {
        isLoading,
        isSubmitting,
        formData,
        setFormData,
        servicesCount,
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        addDimension,
        removeDimension,
        updateDimension,
        handleSubmit,
        navigate,
    };
}
