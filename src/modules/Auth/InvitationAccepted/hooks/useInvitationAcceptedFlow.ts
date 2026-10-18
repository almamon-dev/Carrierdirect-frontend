import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../../../lib/axios';
import { TOKEN_CONFIG } from '../../../../config/auth';
import { getRoleDashboardUrl } from '../../../../utils/roleDashboard';

export const useInvitationAcceptedFlow = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || searchParams.get('invitation_token') || '';
    const emailParam = searchParams.get('email') || '';
    const passwordParam = searchParams.get('password') || searchParams.get('temp_pass') || searchParams.get('pass') || '';

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [userData, setUserData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (!token) {
            if (emailParam) {
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage('No invitation token provided. Please check your invitation email.');
            }
            return;
        }

        const acceptInvite = async () => {
            try {
                const response = await apiClient.post('/auth/accept-invitation', { token });
                const resData = response.data?.data || response.data;

                if (resData?.user) {
                    setUserData(resData.user);
                }

                if (response.data?.token || resData?.token) {
                    const authToken = response.data?.token || resData?.token;
                    localStorage.setItem(TOKEN_CONFIG.accessTokenKey, authToken);
                    if (resData?.user) {
                        localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(resData.user));
                    }
                }

                setStatus('success');
            } catch (err: any) {
                console.error('Accept invitation error:', err);
                const msg = err.response?.data?.message || err.response?.data?.error || err.message;

                if (msg && (msg.toLowerCase().includes('already accepted') || msg.toLowerCase().includes('active'))) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setErrorMessage(msg || 'This invitation link is invalid or has expired.');
                }
            }
        };

        acceptInvite();
    }, [token, emailParam]);

    const handleContinue = () => {
        setIsNavigating(true);
        const storedUser = localStorage.getItem(TOKEN_CONFIG.userKey);
        const storedToken = localStorage.getItem(TOKEN_CONFIG.accessTokenKey);

        if (storedToken && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                navigate(getRoleDashboardUrl(user));
                return;
            } catch {
                // fall through
            }
        }

        const queryParams = new URLSearchParams();
        if (emailParam || userData?.email) queryParams.set('email', emailParam || userData?.email);
        if (passwordParam) queryParams.set('password', passwordParam);
        navigate(`/web/login?${queryParams.toString()}`);
    };

    const handleCopyPassword = () => {
        if (!passwordParam) return;
        navigator.clipboard.writeText(passwordParam);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return {
        status,
        emailParam,
        passwordParam,
        errorMessage,
        isNavigating,
        copied,
        handleContinue,
        handleCopyPassword,
    };
};
