/**
 * useEditQuoteRequest Hook
 * Manages fetching existing quote request details, form data mutations, and sending updates (PUT/POST FormData).
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';
import { QuoteFormData } from '../types/formTypes';
import { INITIAL_QUOTE_FORM_DATA, getSampleFormData, buildUpdatePayload } from '../utils/editFormHelpers';

export function useEditQuoteRequest(cleanId?: string) {
    const navigate = useNavigate();
    const showToast = useToastStore(state => state.showToast);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<QuoteFormData>(INITIAL_QUOTE_FORM_DATA);

    // Fetch existing request data
    const fetchQuoteDetails = useCallback(async () => {
        if (!cleanId) return;
        setIsLoading(true);
        try {
            let q: any = null;
            try {
                const res = await apiClient.get(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${cleanId}/edit`);
                q = res.data?.data || res.data;
            } catch {
                try {
                    const res = await apiClient.get(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${cleanId}`);
                    q = res.data?.data || res.data;
                } catch {
                    const cached = localStorage.getItem('customer_quote_requests_cache');
                    if (cached) {
                        const items = JSON.parse(cached);
                        q = items.find((i: any) => String(i.id) === String(cleanId) || String(i.id) === `REQ-${cleanId}`);
                    }
                }
            }

            if (q) {
                setFormData(prev => ({
                    ...prev,
                    requestTitle: q.request_title || q.requestTitle || q.title || `Quote Request REQ-${q.id || cleanId}`,
                    priority: q.priority || 'Normal',
                    shipmentType: q.shipment_type || q.shipmentType || q.type || 'One Way',
                    serviceType: q.service_type || q.serviceType || 'Standard',
                    pickupDate: q.pickup_date || q.pickupDate || q.date || '',
                    pickupTime: q.pickup_time_from || q.pickupTime || '',
                    deliveryDate: q.delivery_date || q.deliveryDate || '',
                    deliveryTime: q.delivery_time_from || q.deliveryTime || '',
                    expectedTransitTime: q.expected_transit_time || q.expectedTransitTime || '2 Days',

                    pickupCompany: q.pickup_company || q.pickupCompany || '',
                    pickupContactName: q.pickup_contact_name || q.pickupContactName || '',
                    pickupPhone: q.pickup_phone || q.pickupPhone || '',
                    pickupEmail: q.pickup_email || q.pickupEmail || '',
                    pickupCountry: q.pickup_country || q.pickupCountry || 'Bangladesh',
                    pickupState: q.pickup_state || q.pickupState || '',
                    pickupCity: q.pickup_city || q.pickupCity || '',
                    pickupZip: q.pickup_zip || q.pickupZip || '',
                    pickupAddress: q.pickup_address || q.pickupAddress || q.pickup || '',
                    pickupMapUrl: q.pickup_map_url || q.pickupMapUrl || '',
                    pickupInstructions: q.pickup_instructions || q.pickupInstructions || '',

                    deliveryCompany: q.delivery_company || q.deliveryCompany || '',
                    deliveryContactName: q.delivery_contact_name || q.deliveryContactName || '',
                    deliveryPhone: q.delivery_phone || q.deliveryPhone || '',
                    deliveryEmail: q.delivery_email || q.deliveryEmail || '',
                    deliveryCountry: q.delivery_country || q.deliveryCountry || 'Bangladesh',
                    deliveryState: q.delivery_state || q.deliveryState || '',
                    deliveryCity: q.delivery_city || q.deliveryCity || '',
                    deliveryZip: q.delivery_zip || q.deliveryZip || '',
                    deliveryAddress: q.delivery_address || q.deliveryAddress || q.delivery || '',
                    deliveryMapUrl: q.delivery_map_url || q.deliveryMapUrl || '',
                    deliveryInstructions: q.delivery_instructions || q.deliveryInstructions || '',

                    vehicleType: q.vehicle_type || q.vehicleType || q.vehicle || 'Covered Van (20ft)',
                    loadType: q.load_type || q.loadType || q.load || 'Pallets',
                    itemsCount: String(q.items_count || q.itemsCount || '1'),
                    palletsCount: String(q.pallets_count || q.palletsCount || '1'),
                    weight: String(q.weight || ''),
                    volume: String(q.volume || ''),
                    dimensions: (Array.isArray(q.items) && q.items.length > 0)
                        ? q.items.map((it: any, idx: number) => ({
                            id: it.id || idx + 1,
                            length: String(it.length || ''),
                            width: String(it.width || ''),
                            height: String(it.height || ''),
                            qty: String(it.quantity || '1'),
                            unit: 'CM'
                        }))
                        : [{ id: 1, length: '', width: '', height: '', qty: '1', unit: 'CM' }],

                    stackable: Boolean(q.stackable),
                    fragile: Boolean(q.fragile),
                    hazardous: Boolean(q.hazardous),
                    tempControlled: Boolean(q.temp_controlled),
                    oversized: Boolean(q.oversized),
                    perishable: Boolean(q.perishable),
                    loadingRequired: Boolean(q.loading_required ?? true),
                    unloadingRequired: Boolean(q.unloading_required ?? true),
                    packaging: Boolean(q.packaging),
                    insurance: Boolean(q.insurance ?? true),
                    liftGate: Boolean(q.lift_gate),
                    whiteGlove: Boolean(q.white_glove),
                    assembly: Boolean(q.assembly),
                    insideDelivery: Boolean(q.inside_delivery),
                    storage: Boolean(q.storage),

                    budget: String(q.budget || '').replace(/[^0-9.]/g, ''),
                    currency: q.currency || '€',
                    allowNegotiation: Boolean(q.allow_negotiation ?? true),
                    receiveMultiple: Boolean(q.receive_multiple ?? true),
                    autoExpire: q.auto_expire || '48 Hours',

                    customerNotes: q.customer_notes || q.notes || '',
                    specialInstructions: q.special_instructions || '',
                    internalReference: q.internal_reference || `REQ-${cleanId}`,
                }));
            }
        } catch {
            showToast('Unable to load latest quote details.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [cleanId, showToast]);

    useEffect(() => {
        fetchQuoteDetails();
    }, [fetchQuoteDetails]);

    const fillSampleData = () => {
        setFormData(prev => ({
            ...prev,
            ...getSampleFormData(cleanId)
        }));
        showToast('Sample data populated into form.', 'info');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof QuoteFormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: keyof QuoteFormData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleFileUpload = (field: 'packingList' | 'invoice', file: File | null) => {
        setFormData(prev => ({ ...prev, [field]: file }));
    };

    const addDimensionRow = () => {
        setFormData(prev => ({
            ...prev,
            dimensions: [...prev.dimensions, { id: Date.now(), length: '', width: '', height: '', qty: '1', unit: 'CM' }]
        }));
    };

    const updateDimension = (id: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            dimensions: prev.dimensions.map(d => d.id === id ? { ...d, [field]: value } : d)
        }));
    };

    const removeDimension = (id: number) => {
        setFormData(prev => ({
            ...prev,
            dimensions: prev.dimensions.filter(d => d.id !== id)
        }));
    };

    const handleSaveUpdate = async () => {
        setIsSubmitting(true);
        try {
            const payload = buildUpdatePayload(formData, cleanId);
            const hasNewFiles = Boolean((formData.packingList instanceof File) || (formData.invoice instanceof File));

            if (hasNewFiles) {
                const fd = new FormData();
                Object.entries(payload).forEach(([key, val]) => {
                    if (key === 'items' && Array.isArray(val)) {
                        val.forEach((item: any, idx: number) => {
                            Object.entries(item).forEach(([k, v]) => {
                                if (v !== null && v !== undefined) fd.append(`items[${idx}][${k}]`, String(v));
                            });
                        });
                    } else if (val !== null && val !== undefined) {
                        fd.append(key, typeof val === 'boolean' ? (val ? '1' : '0') : String(val));
                    }
                });
                if (formData.packingList instanceof File) fd.append('packing_list', formData.packingList);
                if (formData.invoice instanceof File) fd.append('invoice', formData.invoice);
                fd.append('_method', 'PUT');
                await apiClient.post(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${cleanId}`, fd);
            } else {
                await apiClient.put(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${cleanId}`, payload);
            }

            showToast('Quote request updated successfully!', 'success');
            navigate('/customer/quotes/create');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to update quote request.';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const servicesCount = [
        formData.stackable, formData.fragile, formData.hazardous, formData.tempControlled, formData.oversized, formData.perishable,
        formData.loadingRequired, formData.unloadingRequired, formData.packaging, formData.insurance,
        formData.liftGate, formData.whiteGlove, formData.assembly, formData.insideDelivery, formData.storage
    ].filter(Boolean).length;

    return {
        formData,
        isLoading,
        isSubmitting,
        servicesCount,
        fillSampleData,
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleFileUpload,
        addDimensionRow,
        updateDimension,
        removeDimension,
        handleSaveUpdate,
    };
}
