import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/button';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';
import apiClient from '../../../../lib/axios';
import { ENDPOINTS } from '../../../../config/api';
import { TOKEN_CONFIG } from '../../../../config/auth';

export default function VerifyEmailPage() {
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

                        // If not clear from the auth payload, do a live check right on this page
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
                        setNextRedirect('/customer/dashboard');
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

                // Quick live verify on click before navigating anywhere
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

                await new Promise(resolve => setTimeout(resolve, 300));
                navigate(isCompleted ? '/supplier/dashboard' : '/supplier/complete-profile');
            } else if (user?.user_type === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                navigate('/customer/dashboard');
            }
        } catch {
            navigate(nextRedirect || '/web/login');
        } finally {
            setIsNavigating(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative p-4 sm:p-6 font-sans antialiased">
            {/* Top-Left Screen Corner Link */}
            <Link 
                to="/web/login" 
                className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ff4a1f] hover:underline transition-colors"
            >
                <ArrowLeft className="w-4 h-4 text-[#ff4a1f]" />
                Back to Login
            </Link>

            {/* Main Card Container */}
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden min-h-[520px] border border-slate-100">

                {/* Left Side - Logo & Background */}
                <div className="hidden md:flex md:w-5/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 flex flex-col items-center w-full">
                        <Link to="/">
                            <img src={LogoBlack} alt="GetItMoving Logo" className="w-full max-w-[280px] object-contain dark:hidden" />
                            <img src={LogoWhite} alt="GetItMoving Logo" className="w-full max-w-[280px] object-contain hidden dark:block" />
                        </Link>
                        <h2 className="text-xl font-bold text-slate-800 mt-10 text-center tracking-tight">Email Verification</h2>
                        <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed">
                            Confirming your account details to keep your portal secure and active.
                        </p>
                    </div>
                </div>

                {/* Right Side - Status Content */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center text-center">

                    {/* State 1: Verifying Spinner */}
                    {status === 'verifying' && (
                        <div className="py-6">
                            <div className="w-16 h-16 bg-orange-50 text-[#ff4a1f] rounded-full flex items-center justify-center mx-auto mb-5 border border-orange-100 animate-pulse">
                                <RefreshCw className="w-8 h-8 animate-spin" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
                                Verifying Your Email...
                            </h2>
                            
                            <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                                Please wait a moment while we validate your verification token and activate your account.
                            </p>
                        </div>
                    )}

                    {/* State 2: Verification Success */}
                    {status === 'success' && (
                        <div className="py-2">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
                                Email Verified Successfully!
                            </h2>
                            
                            <p className="text-sm text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
                                Thank you for verifying your email address. Your account is now fully active and ready to use.
                            </p>

                            <div className="space-y-3 max-w-md mx-auto w-full">
                                <Button
                                    onClick={handleProceed}
                                    isLoading={isNavigating}
                                    disabled={isNavigating}
                                    variant="primary"
                                    className="w-full h-11 text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] rounded-lg shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>{nextRedirect.includes('complete-profile') ? 'Complete Your Profile' : 'Continue to Dashboard'}</span>
                                    {!isNavigating && <ArrowRight className="w-4 h-4" />}
                                </Button>

                                <Link
                                    to="/"
                                    className="w-full h-11 flex items-center justify-center gap-2 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <span>Return to Home Page</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* State 3: Verification Error */}
                    {status === 'error' && (
                        <div className="py-2">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-100">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
                                Link Expired or Invalid
                            </h2>
                            
                            <p className="text-sm text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
                                The verification link is invalid or has expired. Please request a new verification link.
                            </p>

                            <div className="space-y-3 max-w-md mx-auto w-full">
                                <Button
                                    onClick={() => navigate('/web/verify-email-notice')}
                                    isLoading={isNavigating}
                                    disabled={isNavigating}
                                    variant="primary"
                                    className="w-full h-11 text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] rounded-lg shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {!isNavigating && <Mail className="w-4 h-4" />}
                                    <span>Resend Verification Link</span>
                                </Button>

                                <Link
                                    to="/web/login"
                                    className="w-full h-11 flex items-center justify-center gap-2 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <span>Back to Sign In</span>
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
