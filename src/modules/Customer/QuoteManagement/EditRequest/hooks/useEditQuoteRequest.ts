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
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';

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
        handleLocationSelect,
        addDimension,
        removeDimension,
        updateDimension,
    } = useEditQuoteFormHandlers(formData, setFormData);

    const handleSubmit = async (e?: React.FormEvent | React.SyntheticEvent | any) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        if (!cleanId) return;

        const todayStr = new Date().toISOString().split("T")[0];
        if (formData.pickupDate && formData.pickupDate < todayStr) {
            showToast("Pickup date cannot be in the past.", "error");
            return;
        }
        if (formData.deliveryDate && formData.pickupDate && formData.deliveryDate < formData.pickupDate) {
            showToast("Delivery date must be on or after the pickup date.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const hasNewFiles = (formData.packingList instanceof File) ||
                (formData.invoice instanceof File) ||
                (Array.isArray(formData.images) && formData.images.some(img => img instanceof File));

            if (hasNewFiles) {
                const submitData = new FormData();
                submitData.append('_method', 'PUT');
                const rawPayload = buildUpdatePayload(formData, cleanId);

                Object.keys(rawPayload).forEach((key) => {
                    if (key === 'items' && Array.isArray(rawPayload.items)) {
                        rawPayload.items.forEach((item: any, idx: number) => {
                            Object.keys(item).forEach((itemKey) => {
                                if (item[itemKey] !== null && item[itemKey] !== undefined) {
                                    submitData.append(`items[${idx}][${itemKey}]`, String(item[itemKey]));
                                }
                            });
                        });
                    } else if (rawPayload[key] !== null && rawPayload[key] !== undefined) {
                        submitData.append(key, typeof rawPayload[key] === 'boolean' ? (rawPayload[key] ? '1' : '0') : String(rawPayload[key]));
                    }
                });

                if (formData.packingList instanceof File) {
                    submitData.append('packing_list', formData.packingList);
                }
                if (formData.invoice instanceof File) {
                    submitData.append('invoice', formData.invoice);
                }
                if (Array.isArray(formData.images)) {
                    formData.images.forEach((img) => {
                        if (img instanceof File) {
                            submitData.append('images[]', img);
                        }
                    });
                }

                await apiClient.post(ENDPOINTS.CUSTOMER.QUOTE_REQUEST_DETAIL(cleanId), submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                const payload = buildUpdatePayload(formData, cleanId);
                await apiClient.put(ENDPOINTS.CUSTOMER.QUOTE_REQUEST_DETAIL(cleanId), payload);
            }

            showToast('Quote request updated successfully!', 'success');
            navigate(buildSecureQuoteUrl('view', cleanId, 'general'));
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
        handleLocationSelect,
        addDimension,
        removeDimension,
        updateDimension,
        handleSubmit,
        navigate,
    };
}
