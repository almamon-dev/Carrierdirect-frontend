import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TOKEN_CONFIG } from '@/config/auth';
import { getRoleDashboardUrl, isDriverUser } from '@/utils/roleDashboard';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AuthCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            setStatus('error');
            const cleanError = decodeURIComponent(error);
            setErrorMessage(cleanError);
            toast({
                title: 'Authentication Failed',
                description: cleanError,
                variant: 'destructive',
            });
            return;
        }

        const token = searchParams.get('token');
        const role = searchParams.get('role') || 'customer';
        const isProfileCompleted = searchParams.get('is_profile_completed') === '1';
        const userParam = searchParams.get('user');

        if (!token) {
            setStatus('error');
            setErrorMessage('No authentication token received from Google.');
            toast({
                title: 'Authentication Failed',
                description: 'Missing authentication token from Google.',
                variant: 'destructive',
            });
            return;
        }

        try {
            let userData: any = null;
            if (userParam) {
                try {
                    userData = JSON.parse(decodeURIComponent(userParam));
                } catch {
                    userData = { user_type: role };
                }
            } else {
                userData = { user_type: role };
            }

            // 1. Save Token to localStorage (matching app's auth standard)
            localStorage.setItem(TOKEN_CONFIG.accessTokenKey, token);
            localStorage.setItem('carrierdirect_access_token', token);
            localStorage.setItem('access_token', token);
            localStorage.setItem('token', token);

            // 2. Save User Data
            if (userData) {
                localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(userData));
                localStorage.setItem('user', JSON.stringify(userData));
            }

            setStatus('success');
            toast({
                title: 'Signed in with Google',
                description: `Welcome${userData?.name ? ', ' + userData.name : ''}!`,
            });

            // 3. Smart role-based redirection
            const userType = userData?.user_type || role;
            const isDriver = isDriverUser(userData);

            setTimeout(() => {
                if (userType === 'admin') {
                    window.location.href = '/admin/dashboard';
                    return;
                }

                if (isDriver) {
                    navigate('/driver/dashboard', { replace: true });
                    return;
                }

                if (userType === 'customer') {
                    navigate('/customer/dashboard', { replace: true });
                    return;
                }

                if (userType === 'supplier') {
                    if (isProfileCompleted) {
                        navigate(getRoleDashboardUrl(userData), { replace: true });
                    } else {
                        navigate('/supplier/complete-profile', { replace: true });
                    }
                    return;
                }

                navigate(getRoleDashboardUrl(userData) || '/customer/dashboard', { replace: true });
            }, 800);
        } catch (err: any) {
            console.error('Google Auth callback processing failed:', err);
            setStatus('error');
            setErrorMessage('Failed to process login credentials.');
            toast({
                title: 'Authentication Error',
                description: 'Failed to process login credentials. Please try logging in again.',
                variant: 'destructive',
            });
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0e1117] p-4 font-sans">
            <div className="w-full max-w-md bg-white dark:bg-[#181a20] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center space-y-5">
                {status === 'loading' && (
                    <div className="space-y-4">
                        <div className="w-14 h-14 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center">
                            <Loader2 className="w-7 h-7 animate-spin" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Authenticating with Google...
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Please wait while we verify your account and prepare your dashboard.
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Authentication Successful
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Redirecting you to your workspace...
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
                            <AlertCircle className="w-7 h-7" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Authentication Failed
                        </h2>
                        <p className="text-xs text-red-600 dark:text-red-400">
                            {errorMessage || 'Unable to sign in with Google.'}
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/web/login', { replace: true })}
                            className="mt-3 inline-flex items-center justify-center px-4 py-2 bg-[#FF4A1F] text-white text-xs font-bold rounded-lg hover:bg-[#E03D14] transition-colors cursor-pointer"
                        >
                            Return to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthCallbackPage;

