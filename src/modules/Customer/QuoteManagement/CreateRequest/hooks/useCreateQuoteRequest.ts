import { ENDPOINTS } from '@/config/api';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { QuoteFormData } from '../types/formTypes';
import { INITIAL_QUOTE_FORM_DATA } from '../utils/editFormHelpers';
import { useCargoServices } from '@/hooks/useCargoServices';
import { buildQuoteRequestFormData } from '../utils/quoteRequestSubmitHelper';
import { useRepeatQuoteData } from './useRepeatQuoteData';

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

    const { isRepeatMode, setIsRepeatMode, repeatSource, setRepeatSource } = useRepeatQuoteData(repeatData, setFormData);

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
            const submitData = buildQuoteRequestFormData(formData, targetStatus, allServices);
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
        formData, activeTab, setActiveTab, isSubmitting, submittingStatus,
        isLockModalOpen, setIsLockModalOpen, isRepeatMode, repeatSource, servicesCount,
        resetForm, handleChange, handleSelectChange, handleCheckboxChange,
        handleFileUpload, addDimensionRow, updateDimension, removeDimension, handleSubmit,
    };
}
