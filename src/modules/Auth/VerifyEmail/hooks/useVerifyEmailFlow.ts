import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../../../lib/axios';
import { ENDPOINTS } from '../../../../config/api';
import { TOKEN_CONFIG } from '../../../../config/auth';
import { getRoleDashboardUrl } from '../../../../utils/roleDashboard';

export const useVerifyEmailFlow = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [nextRedirect, setNextRedirect] = useState<string>('/web/login');
    const [verifiedUser, setVerifiedUser] = useState<any>(null);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        async function verifyEmail() {
            const token = searchParams.get('token');
            const email = searchParams.get('email');

            if (!token || !email) {
                setStatus('error');
                return;
            }

            try {
                const res = await apiClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { token, email });
                const tokenData = res.access_token || res.data?.access_token || res.token;
                let userData = res.data?.user || res.user;

                if (tokenData && userData) {
                    localStorage.setItem(TOKEN_CONFIG.accessTokenKey, tokenData);
                    localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(userData));

                    if (userData.user_type === 'supplier') {
                        let isCompleted = Boolean(
                            userData.is_profile_completed ||
                            userData.is_profile_complete ||
                            (userData.country && userData.city && userData.zip_code)
                        );

                        if (!isCompleted) {
                            try {
                                const profRes = await apiClient.get('/supplier/profile');
                                const profData = profRes.data?.data || profRes.data;
                                if (profData && (profData.country && profData.city && profData.zip_code)) {
                                    isCompleted = true;
                                    userData = { ...userData, ...profData, is_profile_completed: true };
                                    localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(userData));
                                }
                            } catch {
                                // Profile is genuinely incomplete
                            }
                        }

                        setVerifiedUser(userData);
                        setNextRedirect(isCompleted ? '/supplier/dashboard' : '/supplier/complete-profile');
                    } else if (userData.user_type === 'admin') {
                        setVerifiedUser(userData);
                        setNextRedirect('/admin/dashboard');
                    } else {
                        setVerifiedUser(userData);
                        setNextRedirect(getRoleDashboardUrl(userData));
                    }
                }
                setStatus('success');
            } catch (err: any) {
                console.error('Email verification error:', err);
                setStatus('error');
            }
        }

        verifyEmail();
    }, [searchParams]);

    const handleProceed = async () => {
        setIsNavigating(true);

        try {
            const userStr = localStorage.getItem(TOKEN_CONFIG.userKey);
            const user = userStr ? JSON.parse(userStr) : verifiedUser;

            if (user?.user_type === 'supplier') {
                let isCompleted = Boolean(
                    user?.is_profile_completed ||
                    user?.is_profile_complete ||
                    (user?.country && user?.city && user?.zip_code)
                );

                if (!isCompleted) {
                    try {
                        const profRes = await apiClient.get('/supplier/profile');
                        const profData = profRes.data?.data || profRes.data;
                        if (profData && (profData.country && profData.city && profData.zip_code)) {
                            isCompleted = true;
                            const mergedUser = { ...user, ...profData, is_profile_completed: true };
                            localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(mergedUser));
                        }
                    } catch {
                        // ignore
                    }
                }

                await new Promise((resolve) => setTimeout(resolve, 300));
                navigate(isCompleted ? '/supplier/dashboard' : '/supplier/complete-profile');
            } else if (user?.user_type === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                navigate(getRoleDashboardUrl(user));
            }
        } catch {
            navigate(nextRedirect || '/web/login');
        } finally {
            setIsNavigating(false);
        }
    };

    return {
        status,
        nextRedirect,
        isNavigating,
        handleProceed,
        navigate,
    };
};
