import { ENDPOINTS } from '@/config/api';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { QuoteFormData } from '../types/formTypes';
import { INITIAL_QUOTE_FORM_DATA } from '../utils/editFormHelpers';
import { useCargoServices, isServiceChecked } from '@/hooks/useCargoServices';

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
            const randHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
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
    const [isRepeatMode, setIsRepeatMode] = useState(false);
    const [repeatSource, setRepeatSource] = useState('');

    const [formData, setFormData] = useState<QuoteFormData>(INITIAL_QUOTE_FORM_DATA);

    useEffect(() => {
        if (repeatData) {
            setIsRepeatMode(true);
            const sourceId = repeatData.id || repeatData.requestId || 'Previous Order';
            setRepeatSource(sourceId);

            const pickupCityName = repeatData.pickup?.city || repeatData.pickupCity || (typeof repeatData.pickup === 'string' ? repeatData.pickup : '') || (repeatData.route ? repeatData.route.split('→')[0]?.trim() : '') || 'Dhaka';
            const deliveryCityName = repeatData.delivery?.city || repeatData.deliveryCity || (typeof repeatData.delivery === 'string' ? repeatData.delivery : '') || (repeatData.route ? repeatData.route.split('→')[1]?.trim() : '') || 'Chittagong';

            const rawBudget = repeatData.pricing?.total ? String(repeatData.pricing.total) : (repeatData.amount ? String(repeatData.amount).replace(/[^0-9.]/g, '') : (repeatData.lowestBid ? String(repeatData.lowestBid) : ''));

            setFormData(prev => ({
                ...prev,
                requestTitle: repeatData.requestTitle || (repeatData.route ? `Repeat Shipment: ${repeatData.route}` : `Repeat Order Request (${sourceId})`),
                priority: repeatData.priority || 'Normal',
                shipmentType: repeatData.shipmentType || 'One Way',
                serviceType: repeatData.serviceType || 'Standard',

                pickupDate: repeatData.pickupDate || repeatData.logistics?.pickupDate || '',
                pickupTime: repeatData.pickupTime || '09:00',
                deliveryDate: repeatData.deliveryDate || repeatData.logistics?.deliveryDate || '',
                deliveryTime: repeatData.deliveryTime || '17:00',
                expectedTransitTime: repeatData.expectedTransitTime || repeatData.logistics?.transitTime || '',

                pickupCompany: repeatData.pickup?.company || repeatData.pickupCompany || '',
                pickupContactName: repeatData.pickup?.contact || repeatData.pickupContactName || '',
                pickupPhone: repeatData.pickupPhone || '',
                pickupEmail: repeatData.pickupEmail || '',
                pickupCountry: repeatData.pickupCountry || 'Bangladesh',
                pickupState: repeatData.pickupState || '',
                pickupCity: pickupCityName,

                deliveryCompany: repeatData.delivery?.company || repeatData.deliveryCompany || '',
                deliveryContactName: repeatData.delivery?.contact || repeatData.deliveryContactName || '',
                deliveryPhone: repeatData.deliveryPhone || '',
                deliveryEmail: repeatData.deliveryEmail || '',
                deliveryCountry: repeatData.deliveryCountry || 'Bangladesh',
                deliveryState: repeatData.deliveryState || '',
                deliveryCity: deliveryCityName,

                vehicleType: repeatData.vehicle || repeatData.logistics?.vehicleType || '',
                loadType: repeatData.load || '',
                weight: repeatData.weight ? String(repeatData.weight).replace(/[^0-9.]/g, '') : '',
                volume: repeatData.volume ? String(repeatData.volume).replace(/[^0-9.]/g, '') : '',

                budget: rawBudget,
                customerNotes: repeatData.notes || repeatData.customerNotes || '',
                internalReference: repeatData.internalReference || `REPEAT-${sourceId}`,
            }));
        }
    }, [repeatData]);

    const resetForm = () => {
        setFormData(INITIAL_QUOTE_FORM_DATA);
        setIsRepeatMode(false);
        setRepeatSource('');
        showToast('Form reset to blank state', 'info');
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
        if (!formData.requestTitle) {
            showToast('Request Title is required!', 'error');
            setActiveTab('general');
            return;
        }

        setIsSubmitting(true);
        setSubmittingStatus(targetStatus);

        try {
            const submitData = new FormData();
            submitData.append('request_title', formData.requestTitle);
            submitData.append('priority', formData.priority || 'Normal');
            submitData.append('shipment_type', formData.shipmentType || 'One Way');
            submitData.append('service_type', formData.serviceType || 'Standard');
            submitData.append('status', targetStatus);

            if (formData.pickupDate) submitData.append('pickup_date', formData.pickupDate);
            if (formData.pickupTime) submitData.append('pickup_time_from', formData.pickupTime);
            if (formData.pickupCompany) submitData.append('pickup_company', formData.pickupCompany);
            if (formData.pickupContactName) submitData.append('pickup_contact_name', formData.pickupContactName);
            if (formData.pickupPhone) submitData.append('pickup_phone', formData.pickupPhone);
            if (formData.pickupEmail) submitData.append('pickup_email', formData.pickupEmail);
            if (formData.pickupAddress) submitData.append('pickup_address', formData.pickupAddress);
            if (formData.pickupCity) submitData.append('pickup_city', formData.pickupCity);
            if (formData.pickupState) submitData.append('pickup_state', formData.pickupState);
            if (formData.pickupCountry) submitData.append('pickup_country', formData.pickupCountry);
            if (formData.pickupZip) submitData.append('pickup_zip', formData.pickupZip);

            if (formData.deliveryDate) submitData.append('delivery_date', formData.deliveryDate);
            if (formData.deliveryTime) submitData.append('delivery_time_from', formData.deliveryTime);
            if (formData.deliveryCompany) submitData.append('delivery_company', formData.deliveryCompany);
            if (formData.deliveryContactName) submitData.append('delivery_contact_name', formData.deliveryContactName);
            if (formData.deliveryPhone) submitData.append('delivery_phone', formData.deliveryPhone);
            if (formData.deliveryEmail) submitData.append('delivery_email', formData.deliveryEmail);
            if (formData.deliveryAddress) submitData.append('delivery_address', formData.deliveryAddress);
            if (formData.deliveryCity) submitData.append('delivery_city', formData.deliveryCity);
            if (formData.deliveryState) submitData.append('delivery_state', formData.deliveryState);
            if (formData.deliveryCountry) submitData.append('delivery_country', formData.deliveryCountry);
            if (formData.deliveryZip) submitData.append('delivery_zip', formData.deliveryZip);

            if (formData.vehicleType) submitData.append('vehicle_type', formData.vehicleType);
            if (formData.loadType) submitData.append('load_type', formData.loadType);
            if (formData.budget) submitData.append('budget', formData.budget.replace(/[^0-9.]/g, ''));
            if (formData.currency) submitData.append('currency', formData.currency);
            if (formData.customerNotes) submitData.append('customer_notes', formData.customerNotes);

            // Append all database cargo service flags
            allServices.forEach(srv => {
                if (isServiceChecked(formData, srv.key)) {
                    submitData.append(srv.key, '1');
                }
            });

            await apiClient.post(ENDPOINTS.CUSTOMER.QUOTE_REQUESTS, submitData);
            showToast(targetStatus === 'pending' ? 'Quote request saved as draft!' : 'Quote request posted successfully!', 'success');
            navigate('/customer/quotes/create');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to submit quote request';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
            setSubmittingStatus(null);
        }
    };

    const servicesCount = countSelected(formData);

    return {
        formData,
        activeTab,
        setActiveTab,
        isSubmitting,
        submittingStatus,
        isLockModalOpen,
        setIsLockModalOpen,
        isRepeatMode,
        repeatSource,
        servicesCount,
        resetForm,
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleFileUpload,
        addDimensionRow,
        updateDimension,
        removeDimension,
        handleSubmit,
    };
}
