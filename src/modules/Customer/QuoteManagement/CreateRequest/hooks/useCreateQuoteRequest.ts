import { ENDPOINTS } from '@/config/api';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { QuoteFormData } from '../types/formTypes';
import { INITIAL_QUOTE_FORM_DATA } from '../utils/editFormHelpers';
import { useCargoServices } from '@/hooks/useCargoServices';
import { buildQuoteRequestFormData } from '../utils/quoteRequestSubmitHelper';
import { useRepeatQuoteData } from './useRepeatQuoteData';
import { calculateAirDistanceKm } from '@/utils/geoDistance';

export function useCreateQuoteRequest() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const showToast = useToastStore((state) => state.showToast);
    const { countSelected, allServices } = useCargoServices();
    const repeatData = location.state?.repeatData || location.state?.initialData;

    const getQuoteSessionId = (): string => {
        let sid = sessionStorage.getItem('quote_request_session_id');
        if (!sid) {
            const randHex = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
            sid = `sess_${randHex}_${Date.now()}`;
            sessionStorage.setItem('quote_request_session_id', sid);
        }
        return sid;
    };

    const activeTab = searchParams.get('tab') || searchParams.get('slug') || 'general';

    const setActiveTab = (tab: string) => {
        const sid = searchParams.get('session_id') || getQuoteSessionId();
        setSearchParams({ tab, slug: tab, session_id: sid }, { replace: true });
    };

    useEffect(() => {
        if (!searchParams.get('session_id') || !searchParams.get('tab')) {
            const sid = getQuoteSessionId();
            setSearchParams({ tab: activeTab, slug: activeTab, session_id: sid }, { replace: true });
        }
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingStatus, setSubmittingStatus] = useState<'active' | 'pending' | null>(null);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [formData, setFormData] = useState<QuoteFormData>(INITIAL_QUOTE_FORM_DATA);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const { isRepeatMode, setIsRepeatMode, repeatSource, setRepeatSource } = useRepeatQuoteData(repeatData, setFormData);

    // Real-time Field Error Evaluation
    const errors = useMemo(() => {
        const errs: Record<string, string> = {};

        // 1. General Info
        if (!formData.requestTitle?.trim()) {
            errs.requestTitle = 'Request title is required.';
        }
        if (!formData.priority) {
            errs.priority = 'Priority is required.';
        }
        if (!formData.shipmentType) {
            errs.shipmentType = 'Shipment type is required.';
        }
        if (!formData.serviceType) {
            errs.serviceType = 'Service type is required.';
        }
        const todayStr = new Date().toISOString().split("T")[0];
        if (!formData.pickupDate) {
            errs.pickupDate = 'Pickup date is required.';
        } else if (formData.pickupDate < todayStr) {
            errs.pickupDate = 'Pickup date cannot be in the past.';
        }
        if (!formData.pickupTime) {
            errs.pickupTime = 'Pickup time is required.';
        }
        if (!formData.deliveryDate) {
            errs.deliveryDate = 'Delivery date is required.';
        } else if (formData.deliveryDate < todayStr) {
            errs.deliveryDate = 'Delivery date cannot be in the past.';
        } else if (formData.pickupDate && formData.deliveryDate < formData.pickupDate) {
            errs.deliveryDate = 'Delivery date must be on or after the pickup date.';
        }

        // 2. Locations Info
        if (!formData.pickupContactName?.trim()) {
            errs.pickupContactName = 'Contact person name is required.';
        }
        if (!formData.pickupPhone?.trim()) {
            errs.pickupPhone = 'Phone number is required.';
        }
        if (!formData.pickupCountry?.trim()) {
            errs.pickupCountry = 'Country is required.';
        }
        if (!formData.pickupCity?.trim()) {
            errs.pickupCity = 'City is required.';
        }
        if (!formData.pickupAddress?.trim()) {
            errs.pickupAddress = 'Full pickup address is required.';
        }

        if (!formData.deliveryContactName?.trim()) {
            errs.deliveryContactName = 'Contact person name is required.';
        }
        if (!formData.deliveryPhone?.trim()) {
            errs.deliveryPhone = 'Phone number is required.';
        }
        if (!formData.deliveryCountry?.trim()) {
            errs.deliveryCountry = 'Country is required.';
        }
        if (!formData.deliveryCity?.trim()) {
            errs.deliveryCity = 'City is required.';
        }
        if (!formData.deliveryAddress?.trim()) {
            errs.deliveryAddress = 'Full delivery address is required.';
        }

        // 3. Load & Specs
        if (!formData.vehicleType?.trim()) {
            errs.vehicleType = 'Vehicle type is required.';
        }
        if (!formData.loadType?.trim()) {
            errs.loadType = 'Load type is required.';
        }
        if (!formData.weight || isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
            errs.weight = 'Weight is required and must be greater than 0.';
        }

        const hasValidDimension = Array.isArray(formData.dimensions) && formData.dimensions.some(dim => 
            Number(dim.length) > 0 && Number(dim.width) > 0 && Number(dim.height) > 0 && Number(dim.qty) > 0
        );
        if (!hasValidDimension) {
            errs.dimensions = 'At least one complete cargo dimension (Length, Width, Height, and Qty) is required.';
        }

        return errs;
    }, [formData]);

    const markTouched = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const markAllTouched = () => {
        const all: Record<string, boolean> = {};
        [
            'requestTitle', 'priority', 'shipmentType', 'serviceType', 'pickupDate', 'pickupTime', 'deliveryDate',
            'pickupContactName', 'pickupPhone', 'pickupCountry', 'pickupCity', 'pickupAddress',
            'deliveryContactName', 'deliveryPhone', 'deliveryCountry', 'deliveryCity', 'deliveryAddress',
            'vehicleType', 'loadType', 'weight', 'dimensions'
        ].forEach(f => { all[f] = true; });
        setTouched(all);
    };

    const getFieldError = (field: string): string | undefined => {
        return touched[field] ? errors[field] : undefined;
    };

    const resetForm = () => {
        setFormData(INITIAL_QUOTE_FORM_DATA);
        setTouched({});
        setIsRepeatMode(false);
        setRepeatSource('');
        showToast('Form reset to blank state', 'info');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        markTouched(name);
    };

    const handleSelectChange = (name: keyof QuoteFormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        markTouched(name as string);
    };

    const handleCheckboxChange = (name: keyof QuoteFormData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleLocationSelect = (prefix: 'pickup' | 'delivery', locData: any) => {
        setFormData(prev => {
            const next: QuoteFormData = {
                ...prev,
                [`${prefix}Address`]: locData.address || (prev as any)[`${prefix}Address`],
                [`${prefix}Lat`]: locData.lat !== undefined ? locData.lat : (prev as any)[`${prefix}Lat`],
                [`${prefix}Lng`]: locData.lng !== undefined ? locData.lng : (prev as any)[`${prefix}Lng`],
                [`${prefix}City`]: locData.city || (prev as any)[`${prefix}City`],
                [`${prefix}State`]: locData.state || (prev as any)[`${prefix}State`],
                [`${prefix}Country`]: locData.country || (prev as any)[`${prefix}Country`],
                [`${prefix}Zip`]: locData.zip || (prev as any)[`${prefix}Zip`],
            };

            const pLat = prefix === 'pickup' ? locData.lat : prev.pickupLat;
            const pLng = prefix === 'pickup' ? locData.lng : prev.pickupLng;
            const dLat = prefix === 'delivery' ? locData.lat : prev.deliveryLat;
            const dLng = prefix === 'delivery' ? locData.lng : prev.deliveryLng;

            if (pLat && pLng && dLat && dLng) {
                const airKm = calculateAirDistanceKm(pLat, pLng, dLat, dLng);
                if (airKm && airKm > 0) {
                    next.distanceKm = airKm;
                }
            }

            return next;
        });

        markTouched(`${prefix}Address`);
        markTouched(`${prefix}City`);
        markTouched(`${prefix}Country`);
    };

    const handleFileUpload = (field: 'images' | 'packingList' | 'invoice', files: FileList | null) => {
        if (!files || files.length === 0) return;
        if (field === 'images') {
            const newFiles = Array.from(files);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
            showToast(`${newFiles.length} cargo photo(s) attached`, 'success');
        } else {
            setFormData(prev => ({ ...prev, [field]: files[0] }));
            showToast(`${files[0].name} attached`, 'success');
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

    const handleSubmit = async (targetStatus: 'active' | 'pending' = 'active') => {
        if (Object.keys(errors).length > 0) {
            markAllTouched();

            // Find first tab with error to direct the user seamlessly
            if (errors.requestTitle || errors.priority || errors.shipmentType || errors.serviceType || errors.pickupDate || errors.pickupTime || errors.deliveryDate) {
                setActiveTab('general');
            } else if (errors.pickupContactName || errors.pickupPhone || errors.pickupCountry || errors.pickupCity || errors.pickupAddress ||
                       errors.deliveryContactName || errors.deliveryPhone || errors.deliveryCountry || errors.deliveryCity || errors.deliveryAddress) {
                setActiveTab('locations');
            } else if (errors.vehicleType || errors.loadType || errors.weight || errors.dimensions) {
                setActiveTab('load');
            }

            showToast('Please fill in all required fields marked in red.', 'error');
            return;
        }

        setIsSubmitting(true);
        setSubmittingStatus(targetStatus);

        try {
            const submitData = buildQuoteRequestFormData(formData, targetStatus, allServices);
            await apiClient.post(ENDPOINTS.CUSTOMER.QUOTE_REQUESTS, submitData);
            showToast(targetStatus === 'pending' ? 'Quote request saved as draft!' : 'Quote request posted successfully!', 'success');
            navigate('/customer/quotes/create');
        } catch (err: any) {
            const status = err?.status || err?.response?.status;
            const data = err?.data || err?.response?.data;
            const msg = data?.message || err?.message || 'Failed to submit quote request';

            if (
                status === 403 ||
                data?.upgrade_required ||
                data?.reason === 'trial_limit_reached' ||
                data?.reason === 'subscription_expired' ||
                msg.toLowerCase().includes('trial limit') ||
                msg.toLowerCase().includes('free trial') ||
                msg.toLowerCase().includes('upgrade')
            ) {
                setIsLockModalOpen(true);
            } else {
                showToast(msg, 'error');
            }
        } finally {
            setIsSubmitting(false);
            setSubmittingStatus(null);
        }
    };

    const servicesCount = countSelected(formData);

    return {
        formData, activeTab, setActiveTab, isSubmitting, submittingStatus,
        isLockModalOpen, setIsLockModalOpen, isRepeatMode, repeatSource, servicesCount,
        errors, touched, getFieldError, markTouched, markAllTouched,
        resetForm, handleChange, handleSelectChange, handleCheckboxChange, handleLocationSelect,
        handleFileUpload, addDimensionRow, updateDimension, removeDimension, handleSubmit,
    };
}
