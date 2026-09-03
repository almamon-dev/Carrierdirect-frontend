import { ENDPOINTS } from '@/config/api';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuoteFormData } from '../../CreateRequest/types/formTypes';
import { INITIAL_QUOTE_FORM_DATA, buildUpdatePayload } from '../../CreateRequest/utils/editFormHelpers';
import { useCargoServices } from '@/hooks/useCargoServices';

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
                // Extract any boolean flags dynamically
                const dynamicFlags: Record<string, boolean> = {};
                Object.keys(q).forEach((key) => {
                    if (typeof q[key] === 'boolean' || q[key] === 1 || q[key] === 0 || q[key] === '1' || q[key] === '0') {
                        dynamicFlags[key] = Boolean(q[key] === true || q[key] === 1 || q[key] === '1');
                    }
                });

                const pickupCompany = q.pickup_company || q.pickup_company_name || q.pickup_location?.company_name || q.pickupCompany || '';
                const pickupContactName = q.pickup_contact_name || q.pickup_contact_person || q.pickup_location?.contact_person || q.pickupContactName || '';
                const pickupPhone = q.pickup_phone || q.pickup_contact_phone || q.pickup_location?.phone || q.pickupPhone || '';
                const pickupEmail = q.pickup_email || q.pickup_contact_email || q.pickup_location?.email || q.pickupEmail || '';
                const pickupAddress = q.pickup_address || q.pickup_location?.address || q.pickupAddress || '';
                const pickupCity = q.pickup_city || q.pickup_location?.city || q.pickupCity || '';
                const pickupState = q.pickup_state || q.pickup_location?.state || q.pickupState || '';
                const pickupCountry = q.pickup_country || q.pickup_location?.country || q.pickupCountry || 'Bangladesh';
                const pickupZip = q.pickup_zip || q.pickup_location?.zip || q.pickupZip || '';
                const pickupMapUrl = q.pickup_map_url || q.pickup_location?.map_url || q.pickupMapUrl || '';
                const pickupInstructions = q.pickup_instructions || q.pickup_location?.instructions || q.pickupInstructions || '';

                const deliveryCompany = q.delivery_company || q.delivery_company_name || q.delivery_location?.company_name || q.deliveryCompany || '';
                const deliveryContactName = q.delivery_contact_name || q.delivery_contact_person || q.delivery_location?.contact_person || q.deliveryContactName || '';
                const deliveryPhone = q.delivery_phone || q.delivery_contact_phone || q.delivery_location?.phone || q.deliveryPhone || '';
                const deliveryEmail = q.delivery_email || q.delivery_contact_email || q.delivery_location?.email || q.deliveryEmail || '';
                const deliveryAddress = q.delivery_address || q.delivery_location?.address || q.deliveryAddress || '';
                const deliveryCity = q.delivery_city || q.delivery_location?.city || q.deliveryCity || '';
                const deliveryState = q.delivery_state || q.delivery_location?.state || q.deliveryState || '';
                const deliveryCountry = q.delivery_country || q.delivery_location?.country || q.deliveryCountry || 'Bangladesh';
                const deliveryZip = q.delivery_zip || q.delivery_location?.zip || q.deliveryZip || '';
                const deliveryMapUrl = q.delivery_map_url || q.delivery_location?.map_url || q.deliveryMapUrl || '';
                const deliveryInstructions = q.delivery_instructions || q.delivery_location?.instructions || q.deliveryInstructions || '';

                setFormData({
                    ...INITIAL_QUOTE_FORM_DATA,
                    ...dynamicFlags,
                    requestTitle: q.request_title || q.title || `Quote Request REQ-${cleanId}`,
                    priority: q.priority || 'Normal',
                    shipmentType: q.shipment_type || q.shipmentType || 'One Way',
                    serviceType: q.service_type || q.serviceType || 'Standard',
                    pickupDate: q.pickup_date ? String(q.pickup_date).split('T')[0] : '',
                    pickupTime: q.pickup_time_from || q.pickup_time || q.pickupTime || '',
                    deliveryDate: q.delivery_date ? String(q.delivery_date).split('T')[0] : '',
                    deliveryTime: q.delivery_time_from || q.delivery_time || q.deliveryTime || '',
                    expectedTransitTime: q.expected_transit_time ? String(q.expected_transit_time) : '',

                    pickupCompany,
                    pickupContactName,
                    pickupPhone,
                    pickupEmail,
                    pickupCountry,
                    pickupState,
                    pickupCity,
                    pickupZip,
                    pickupAddress,
                    pickupMapUrl,
                    pickupInstructions,

                    deliveryCompany,
                    deliveryContactName,
                    deliveryPhone,
                    deliveryEmail,
                    deliveryCountry,
                    deliveryState,
                    deliveryCity,
                    deliveryZip,
                    deliveryAddress,
                    deliveryMapUrl,
                    deliveryInstructions,

                    vehicleType: q.vehicle_type || q.vehicleType || q.vehicle || '',
                    loadType: q.load_type || q.loadType || q.load || '',
                    itemsCount: q.items_count || q.itemsCount ? String(q.items_count || q.itemsCount) : '',
                    palletsCount: q.pallets_count || q.palletsCount ? String(q.pallets_count || q.palletsCount) : '',
                    weight: q.weight ? String(q.weight) : '',
                    volume: q.volume ? String(q.volume) : '',
                    dimensions: Array.isArray(q.items) && q.items.length > 0
                        ? q.items.map((it: any, idx: number) => ({
                            id: it.id || idx + 1,
                            length: it.length ? String(it.length) : '',
                            width: it.width ? String(it.width) : '',
                            height: it.height ? String(it.height) : '',
                            qty: it.quantity ? String(it.quantity) : '1',
                            unit: it.unit || 'CM'
                        }))
                        : [{ id: 1, length: '', width: '', height: '', qty: '1', unit: 'CM' }],

                    budget: q.budget || q.lowestBid ? String(q.budget || q.lowestBid) : '',
                    currency: q.currency || '€',
                    allowNegotiation: Boolean(q.allow_negotiation ?? q.allowNegotiation ?? true),
                    receiveMultiple: Boolean(q.receive_multiple ?? q.receiveMultiple ?? true),
                    autoExpire: q.auto_expire || q.autoExpire || '24 Hours',
                    customerNotes: q.customer_notes || q.customerNotes || q.additional_notes || '',
                    specialInstructions: q.special_instructions || q.specialInstructions || '',
                    internalReference: q.internal_reference || q.internalReference || '',
                    images: Array.isArray(q.images_urls) && q.images_urls.length > 0
                        ? q.images_urls.map((u: string, idx: number) => ({ name: `Photo_${idx + 1}`, url: u }))
                        : (Array.isArray(q.images) ? q.images : []),
                    packingList: q.packing_list_url || q.packing_list_path
                        ? { name: 'Packing_List.pdf', url: q.packing_list_url || q.packing_list_path }
                        : (q.packingList || q.packing_list || null),
                    invoice: q.invoice_url || q.invoice_path
                        ? { name: 'Commercial_Invoice.pdf', url: q.invoice_url || q.invoice_path }
                        : (q.invoice || null),
                });
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

    const handleFileUpload = (field: 'images' | 'packingList' | 'invoice', files: FileList | null) => {
        if (!files || files.length === 0) return;
        if (field === 'images') {
            const newFiles = Array.from(files);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
            showToast(`${newFiles.length} photo(s) selected`, 'success');
        } else {
            setFormData(prev => ({ ...prev, [field]: files[0] }));
            showToast(`${files[0].name} selected`, 'success');
        }
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
        if (formData.dimensions.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            dimensions: prev.dimensions.filter(d => d.id !== id)
        }));
    };

    const handleSaveUpdate = async () => {
        if (!formData.requestTitle) {
            showToast('Request Title is required!', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = buildUpdatePayload(formData);
            const hasNewFiles = (formData.images && formData.images.some(img => img instanceof File))
                || formData.packingList instanceof File
                || formData.invoice instanceof File;

            if (hasNewFiles) {
                const fd = new FormData();
                fd.append('_method', 'PUT');
                Object.entries(payload).forEach(([k, v]) => {
                    if (v !== undefined && v !== null) {
                        fd.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
                    }
                });
                if (Array.isArray(formData.images)) {
                    formData.images.forEach((img) => {
                        if (img instanceof File) fd.append('images[]', img);
                    });
                }
                if (formData.packingList instanceof File) fd.append('packing_list', formData.packingList);
                if (formData.invoice instanceof File) fd.append('invoice', formData.invoice);

                await apiClient.post(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${cleanId}`, fd);
            } else {
                await apiClient.put(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${cleanId}`, payload);
            }

            showToast('Quote request updated successfully!', 'success');
            navigate('/customer/quotes/create');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to update quote request';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const servicesCount = countSelected(formData);

    return {
        formData,
        isLoading,
        isSubmitting,
        servicesCount,
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
