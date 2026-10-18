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
import { validateCreateQuoteForm, MANDATORY_FORM_FIELDS } from '../utils/quoteRequestValidation';
import { useQuoteFormHandlers } from './useQuoteFormHandlers';

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
        .map((b) => b.toString(16).padStart(2, '0'))
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
  const [formData, setFormData] = useState<QuoteFormData>(INITIAL_QUOTE_FORM_DATA);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { isRepeatMode, setIsRepeatMode, repeatSource, setRepeatSource } = useRepeatQuoteData(
    repeatData,
    setFormData
  );

  const errors = useMemo(() => validateCreateQuoteForm(formData), [formData]);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const markAllTouched = () => {
    const all: Record<string, boolean> = {};
    MANDATORY_FORM_FIELDS.forEach((f) => {
      all[f] = true;
    });
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

  const handlers = useQuoteFormHandlers({
    formData,
    setFormData,
    markTouched,
    showToast,
  });

  const handleSubmit = async (targetStatus: 'active' | 'pending' = 'active') => {
    if (Object.keys(errors).length > 0) {
      markAllTouched();
      if (
        errors.requestTitle || errors.priority || errors.shipmentType ||
        errors.serviceType || errors.pickupDate || errors.pickupTime || errors.deliveryDate
      ) {
        setActiveTab('general');
      } else if (
        errors.pickupContactName || errors.pickupPhone || errors.pickupCountry ||
        errors.pickupCity || errors.pickupAddress || errors.deliveryContactName ||
        errors.deliveryPhone || errors.deliveryCountry || errors.deliveryCity || errors.deliveryAddress
      ) {
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
      showToast(
        targetStatus === 'pending'
          ? 'Quote request saved as draft!'
          : 'Quote request posted successfully!',
        'success'
      );
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
    resetForm, ...handlers, handleSubmit,
  };
}
