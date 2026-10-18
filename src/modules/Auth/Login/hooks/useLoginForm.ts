import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../../../lib/axios';
import authService from '../../../../services/authService';
import { TOKEN_CONFIG } from '../../../../config/auth';
import { getRoleDashboardUrl, isDriverUser } from '../../../../utils/roleDashboard';
import { useAuthRedirectGuard } from './useAuthRedirectGuard';

export const useLoginForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emailParam = searchParams.get('email') || '';
    const passwordParam = searchParams.get('password') || searchParams.get('temp_pass') || searchParams.get('pass') || '';
    const invitationToken = searchParams.get('invitation_token') || searchParams.get('token') || '';

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [redirectUserType, setRedirectUserType] = useState<string | null>(null);

    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [pendingLoginRes, setPendingLoginRes] = useState<any>(null);
    const [invitationAccepted, setInvitationAccepted] = useState(false);

    useAuthRedirectGuard();

    useEffect(() => {
        if (invitationToken) {
            apiClient
                .post('/auth/accept-invitation', { token: invitationToken })
                .then(() => setInvitationAccepted(true))
                .catch((err) => {
                    console.log('Invitation token status:', err?.response?.data?.message || err.message);
                });
        }
    }, [invitationToken]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            email: emailParam || prev.email,
            password: passwordParam || prev.password,
        }));
    }, [emailParam, passwordParam]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field] || errors.general) {
            setErrors((prev) => {
                const e = { ...prev };
                delete e[field];
                delete e.general;
                return e;
            });
        }
    };

    const completeLoginRedirect = async (res: any) => {
        const user = res.user;
        const userType = user?.user_type || 'customer';
        const isDriver = isDriverUser(user);
        setRedirectUserType(isDriver ? 'driver' : userType);
        setProcessing(true);

        if (userType === 'admin') {
            setTimeout(() => {
                window.location.href = '/admin/dashboard';
            }, 1200);
            return;
        }

        if (isDriver) {
            setTimeout(() => {
                navigate('/driver/dashboard');
            }, 1200);
            return;
        }

        if (userType === 'supplier_employee') {
            setTimeout(() => {
                navigate(getRoleDashboardUrl(user));
            }, 1200);
            return;
        }

        if (userType === 'supplier') {
            let userObj = res.user;
            let isProfileCompleted = Boolean(
                userObj?.is_profile_completed ||
                userObj?.is_profile_complete ||
                (userObj?.country && userObj?.city && userObj?.zip_code)
            );

            if (!isProfileCompleted) {
                try {
                    const profRes = await apiClient.get('/supplier/profile');
                    const profData = profRes.data?.data || profRes.data;
                    if (profData && (profData.country && profData.city && profData.zip_code)) {
                        isProfileCompleted = true;
                        userObj = { ...userObj, ...profData, is_profile_completed: true };
                        localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(userObj));
                    }
                } catch {
                    // Profile is incomplete
                }
            }

            setTimeout(() => {
                navigate(isProfileCompleted ? '/supplier/dashboard' : '/supplier/complete-profile');
            }, 1200);
            return;
        }

        setTimeout(() => {
            navigate('/customer/dashboard');
        }, 1200);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email Address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsLoading(true);
        try {
            const res = await authService.login({
                email: formData.email,
                password: formData.password,
                invitation_token: invitationToken || undefined,
            } as any);

            if (res.requiresPayment && res.checkoutUrl) {
                window.location.href = res.checkoutUrl;
                return;
            }

            if ((res as any)?.requires_2fa || (res as any)?.user?.two_factor_enabled) {
                setPendingLoginRes(res);
                setIs2FAModalOpen(true);
                setIsLoading(false);
                return;
            }

            completeLoginRedirect(res);
        } catch (error: any) {
            console.error('Login error:', error);
            let apiMsg =
                error.data?.message ||
                error.data?.error ||
                (error.data?.errors ? Object.values(error.data.errors).flat().join(' ') : '') ||
                error.message;

            if (apiMsg && (apiMsg.includes('Invalid credentials') || apiMsg.includes('unauthenticated'))) {
                setErrors({ general: 'Invalid email or password. Please try again.' });
            } else {
                setErrors({ general: apiMsg || 'Login failed. Please check your network and credentials.' });
            }
            setIsLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        isLoading,
        processing,
        redirectUserType,
        is2FAModalOpen,
        setIs2FAModalOpen,
        pendingLoginRes,
        invitationToken,
        invitationAccepted,
        handleInputChange,
        handleSubmit,
        completeLoginRedirect,
    };
};
