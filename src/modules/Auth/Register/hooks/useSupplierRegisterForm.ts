import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../../../lib/axios';
import { ENDPOINTS } from '../../../../config/api';
import { useToastStore } from '../../../../stores/useToastStore';
import { useDropdownOptions } from '../../../../hooks/useDropdownOptions';
import {
    SupplierFormData,
    isPolicyDateValid,
    getRegisterSessionId,
    validateStep1,
    validateStep2
} from './supplierRegisterUtils';

export function useSupplierRegisterForm() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { getOptions } = useDropdownOptions();
    const [step, setStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isStep1Loading, setIsStep1Loading] = useState(false);
    const [formData, setFormData] = useState<SupplierFormData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        insuranceType: '',
        customInsuranceType: '',
        insuranceProviderName: '',
        policyNumber: '',
        policyExpiryDate: '',
        insuranceDocument: null,
        licenses: null
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const customInsuranceInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const selectedSlug = step === 1 ? 'account-info' : (formData.insuranceType || 'compliance-documents');
        const sid = searchParams.get('session_id') || getRegisterSessionId();
        setSearchParams({ slug: selectedSlug, session_id: sid }, { replace: true });
    }, [step, formData.insuranceType]);

    const isOtherInsurance = formData.insuranceType.toLowerCase() === 'other' || formData.insuranceType.toLowerCase() === 'others';

    useEffect(() => {
        if (isOtherInsurance) {
            const timer = setTimeout(() => {
                customInsuranceInputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isOtherInsurance]);

    const handleInputChange = (field: string, value: string | File) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'policyExpiryDate' && typeof value === 'string') {
            if (!value) {
                setErrors(prev => ({ ...prev, policyExpiryDate: 'Policy Expiry Date is required' }));
            } else if (!isPolicyDateValid(value)) {
                setErrors(prev => ({ ...prev, policyExpiryDate: 'Expiry date must be today or a future date' }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.policyExpiryDate;
                    return newErrors;
                });
            }
        } else if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleAgreedChange = (checked: boolean) => {
        setAgreed(checked);
        if (errors.agreed) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.agreed;
                return newErrors;
            });
        }
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateStep1(formData);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setIsStep1Loading(true);
            setTimeout(() => {
                setIsStep1Loading(false);
                setStep(2);
            }, 750);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateStep2(formData, isOtherInsurance, agreed);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                const finalInsuranceType = isOtherInsurance ? formData.customInsuranceType.trim() : formData.insuranceType;
                const registerPayload = new FormData();
                registerPayload.append('user_type', 'supplier');
                registerPayload.append('company_name', formData.fullName);
                registerPayload.append('name', formData.fullName);
                registerPayload.append('email', formData.email);
                registerPayload.append('password', formData.password);
                registerPayload.append('password_confirmation', formData.confirmPassword);
                registerPayload.append('insurance_type', finalInsuranceType);
                registerPayload.append('insurance_provider_name', formData.insuranceProviderName);
                registerPayload.append('policy_number', formData.policyNumber);
                registerPayload.append('policy_expiry_date', formData.policyExpiryDate);
                if (formData.insuranceDocument instanceof File) registerPayload.append('insurance_document', formData.insuranceDocument);
                if (formData.licenses instanceof File) registerPayload.append('license_document', formData.licenses);

                await apiClient.post(ENDPOINTS.AUTH.REGISTER, registerPayload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                navigate(`/web/verify-email-notice?email=${encodeURIComponent(formData.email)}`);
            } catch (err: any) {
                console.error('Supplier registration error:', err);
                const msg = err.data?.message || err.response?.data?.message || err.message || 'Registration failed. Please try again.';
                useToastStore.getState().showToast(msg, 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const rawInsuranceOptions = getOptions('insurance_type', [
        { id: 'Basic Goods Coverage', name: 'Basic Goods Coverage' },
        { id: 'All-Risk Transit Insurance', name: 'All-Risk Transit Insurance' },
        { id: 'Standard Liability', name: 'Standard Liability' },
        { id: 'Comprehensive Cargo Insurance', name: 'Comprehensive Cargo Insurance' }
    ]);

    const insuranceOptions = useMemo(() => {
        const hasOther = rawInsuranceOptions.some(opt => 
            opt.id.toString().toLowerCase() === 'other' || 
            opt.id.toString().toLowerCase() === 'others' || 
            opt.name.toLowerCase() === 'other' || 
            opt.name.toLowerCase() === 'others'
        );
        return hasOther ? rawInsuranceOptions : [...rawInsuranceOptions, { id: 'Other', name: 'Other' }];
    }, [rawInsuranceOptions]);

    return {
        step,
        setStep,
        agreed,
        handleAgreedChange,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        isLoading,
        isStep1Loading,
        formData,
        errors,
        handleInputChange,
        handleContinue,
        handleSubmit,
        isOtherInsurance,
        customInsuranceInputRef,
        insuranceOptions,
        navigate
    };
}
