import React, { useState } from 'react';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';
import apiClient from '../../../../lib/axios';
import { ENDPOINTS } from '../../../../config/api';
import { TOKEN_CONFIG } from '../../../../config/auth';
import { useToastStore } from '../../../../stores/useToastStore';

export default function VerifyEmailNoticePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Read stored user email fallback
    const userStr = localStorage.getItem(TOKEN_CONFIG.userKey) || localStorage.getItem('carrierdirect_user_data') || localStorage.getItem('user');
    let storedEmail = '';
    try {
        const u = userStr ? JSON.parse(userStr) : null;
        storedEmail = u?.email || '';
    } catch { }

    const rawEmail = searchParams.get('email') || storedEmail || 'user@example.com';
    const [isResending, setIsResending] = useState(false);
    const [resentSuccess, setResentSuccess] = useState(false);

    // Mask email for privacy 
    const maskEmail = (emailStr: string) => {
        if (!emailStr || !emailStr.includes('@')) return emailStr;
        const [name, domain] = emailStr.split('@');
        if (name.length <= 4) {
            return `${name[0]}***@${domain}`;
        }
        const start = name.slice(0, 2);
        const end = name.slice(-2);
        return `${start}******${end}@${domain}`;
    };

    const displayEmail = maskEmail(rawEmail);

    const handleResendLink = async () => {
        if (!rawEmail || rawEmail === 'user@example.com') {
            useToastStore.getState().showToast('Email address is missing.', 'error');
            return;
        }

        setIsResending(true);
        try {
            const res = await apiClient.post(ENDPOINTS.AUTH.RESEND_OTP, { email: rawEmail });
            if (res && res.success !== false) {
                setResentSuccess(true);
                useToastStore.getState().showToast(res.message || 'Verification email resent successfully! Please check your inbox.', 'success');
            } else {
                useToastStore.getState().showToast(res?.message || 'Failed to resend verification email.', 'error');
            }
        } catch (err: any) {
            const msg = err.data?.message || err.response?.data?.message || err.message || 'Failed to resend verification email.';
            useToastStore.getState().showToast(msg, 'error');
        } finally {
            setIsResending(false);
        }
    };

    const handleBackToLogin = () => {
        localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
        localStorage.removeItem(TOKEN_CONFIG.userKey);
        localStorage.removeItem('carrierdirect_access_token');
        localStorage.removeItem('carrierdirect_user_data');
        localStorage.removeItem('erp_access_token');
        localStorage.removeItem('erp_user_data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/web/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative p-4 sm:p-6 font-sans">
            {/* Top-Left Back Link */}
            <button
                type="button"
                onClick={handleBackToLogin}
                className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ff4a1f] hover:underline transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4 text-[#ff4a1f]" />
                <span>Back to Login</span>
            </button>

            {/* Main Container Card — Standard Auth Split Layout */}
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden min-h-[520px] border border-slate-100">
                {/* Left Branding Panel */}
                <div className="hidden md:flex md:w-5/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 flex flex-col items-center w-full">
                        <Link to="/">
                            <img src={LogoBlack} alt="GetItMoving Logo" className="w-full max-w-[280px] object-contain dark:hidden" />
                            <img src={LogoWhite} alt="GetItMoving Logo" className="w-full max-w-[280px] object-contain hidden dark:block" />
                        </Link>
                        <h2 className="text-xl font-bold text-slate-800 mt-10 text-center tracking-tight">Account Activation</h2>
                        <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed">
                            Verify your email address to complete your account setup and unlock full portal access.
                        </p>
                    </div>
                </div>

                {/* Right Content Panel */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-orange-50 text-[#ff4a1f] rounded-full flex items-center justify-center mx-auto mb-5 border border-orange-100 animate-pulse">
                        <Mail className="w-8 h-8 text-[#ff4a1f]" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
                        Verify Your Email Address
                    </h2>

                    <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
                        We have sent a verification link to <span className="font-bold text-slate-900 tracking-tight">{displayEmail}</span>. Please check your inbox and click the verification link to activate your account.
                    </p>

                    <div className="space-y-3 max-w-md mx-auto w-full">
                        <button
                            type="button"
                            onClick={handleResendLink}
                            disabled={isResending}
                            className="w-full h-11 flex items-center justify-center gap-2 px-4 border border-transparent rounded-[3px] shadow-sm text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isResending ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Sending Verification Email...</span>
                                </>
                            ) : resentSuccess ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Resent Successfully!</span>
                                </>
                            ) : (
                                <>
                                    <Mail className="w-4 h-4" />
                                    <span>Resend Verification Link</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="w-full h-11 flex items-center justify-center gap-2 px-4 border border-slate-200 rounded-[3px] text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            <span>Back to Sign In</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
