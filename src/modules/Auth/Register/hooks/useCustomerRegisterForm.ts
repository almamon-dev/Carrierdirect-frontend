import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../../../lib/axios';
import { ENDPOINTS } from '../../../../config/api';
import { useToastStore } from '../../../../stores/useToastStore';

export const useCustomerRegisterForm = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [agreed, setAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const getRegisterSessionId = (): string => {
        let sid = sessionStorage.getItem('customer_register_session_id');
        if (!sid) {
            const randHex = crypto.randomUUID();
            sid = `sess_${randHex}_${Date.now()}`;
            sessionStorage.setItem('customer_register_session_id', sid);
        }
        return sid;
    };

    useEffect(() => {
        const activeSlug = searchParams.get('slug') || 'customer-register';
        const sid = searchParams.get('session_id') || getRegisterSessionId();
        setSearchParams({ slug: activeSlug, session_id: sid }, { replace: true });
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleAgreedChange = (checked: boolean) => {
        setAgreed(checked);
        if (errors.agreed) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.agreed;
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email Address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreed) newErrors.agreed = 'You must agree to the Terms & Privacy Policy';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
                    user_type: 'customer',
                    name: formData.fullName,
                    company_name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword,
                });

                navigate(`/web/verify-email-notice?email=${encodeURIComponent(formData.email)}`);
            } catch (err: any) {
                console.error('Customer registration error:', err);
                const msg = err.data?.message || err.response?.data?.message || err.message || 'Registration failed. Please try again.';
                useToastStore.getState().showToast(msg, 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return {
        formData,
        agreed,
        errors,
        isLoading,
        handleInputChange,
        handleAgreedChange,
        handleSubmit,
    };
};
