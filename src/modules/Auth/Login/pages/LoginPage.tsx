import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';
import Input from '../../../../components/ui/input';
import Button from '../../../../components/ui/button';
import apiClient from '../../../../lib/axios';
import authService from '../../../../services/authService';
import { TOKEN_CONFIG } from '../../../../config/auth';
import ProcessingOverlay from '../components/ProcessingOverlay';
import TwoFactorModal from '../components/TwoFactorModal';
import DemoCredentials from '../components/DemoCredentials';

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [redirectUserType, setRedirectUserType] = useState<string | null>(null);

    // 2FA state
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [pendingLoginRes, setPendingLoginRes] = useState<any>(null);

    // ── Guard: redirect already-authenticated users ───────────────────────────
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_CONFIG.accessTokenKey);
        const userStr = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (!token || !userStr) return;

        try {
            const user = JSON.parse(userStr);
            const role = user?.user_type;
            if (role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else if (role === 'supplier') {
                const isProfileCompleted = Boolean(
                    user?.is_profile_completed ||
                    user?.is_profile_complete ||
                    (user?.country && user?.city && user?.zip_code)
                );
                navigate(isProfileCompleted ? '/supplier/dashboard' : '/supplier/complete-profile', { replace: true });
            } else if (role === 'customer') {
                navigate('/customer/dashboard', { replace: true });
            }
        } catch {
            localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
            localStorage.removeItem(TOKEN_CONFIG.userKey);
        }
    }, [navigate]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field] || errors.general) {
            setErrors(prev => {
                const e = { ...prev };
                delete e[field];
                delete e.general;
                return e;
            });
        }
    };

    const completeLoginRedirect = async (res: any) => {
        const userType = res.user?.user_type || 'customer';
        setRedirectUserType(userType);
        setProcessing(true);

        if (userType === 'admin') {
            setTimeout(() => {
                window.location.href = '/admin/dashboard';
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

            // Live verify with backend in case user object in login response is missing location fields
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
                    // Profile is genuinely incomplete
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
            });

            if (res.requiresPayment && res.checkoutUrl) {
                window.location.href = res.checkoutUrl;
                return;
            }

            // Check if 2FA is required for login
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

    if (processing) {
        return <ProcessingOverlay userType={redirectUserType} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0e1117] relative p-4 font-sans">
            {/* Top Left Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <Link to="/" className="flex items-center text-sm font-medium text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </div>

            {/* The Main Centered Split Card */}
            <div className="main-auth-card flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-[#181a20] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border-2 border-gray-200 dark:border-[#384150] overflow-hidden min-h-[520px]">

                {/* Left Side - Logo & Branding */}
                <div className="hidden md:flex md:w-1/2 bg-[#f8fafc] dark:bg-[#12161c] flex-col items-center justify-center p-12 relative border-r border-gray-100 dark:border-[#384150]">
                    <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    <div className="relative z-10 flex flex-col items-center w-full">
                        <Link to="/">
                            <img src={LogoBlack} alt="CarrierDirect Logo" className="w-full max-w-[300px] md:max-w-[340px] object-contain scale-110 dark:hidden" />
                            <img src={LogoWhite} alt="CarrierDirect Logo" className="w-full max-w-[300px] md:max-w-[340px] object-contain scale-110 hidden dark:block" />
                        </Link>
                        <h2 className="text-[15px] font-bold text-slate-800 dark:text-white mt-10 text-center tracking-tight">Direct Carrier Marketplace</h2>
                        <p className="mt-3 text-sm text-gray-500 dark:text-slate-400 text-center leading-relaxed max-w-xs">
                            Connecting shippers and verified carriers directly with real-time tracking.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#181a20]">
                    {/* Mobile Logo */}
                    <div className="md:hidden flex justify-center mb-6">
                        <Link to="/">
                            <img src={LogoBlack} alt="CarrierDirect Logo" className="h-8 dark:hidden object-contain" />
                            <img src={LogoWhite} alt="CarrierDirect Logo" className="h-8 hidden dark:block object-contain" />
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Error Alert */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-md text-xs font-medium text-red-600 dark:text-red-400 text-center">
                            {errors.general}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300 mb-1">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute top-0 left-0 h-[36px] pl-3 flex items-center pointer-events-none z-10">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    type="email"
                                    className="pl-9 bg-white dark:bg-[#1e2329]"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    error={errors.email}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-[13px] font-bold text-gray-700 dark:text-slate-300">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <Link
                                    to="/web/forgot-password"
                                    className="text-xs font-semibold text-[#FF4A1F] hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute top-0 left-0 h-[36px] pl-3 flex items-center pointer-events-none z-10">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    className="pl-9 pr-10 bg-white dark:bg-[#1e2329]"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    error={errors.password}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-0 h-[36px] flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 cursor-pointer z-10"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            isLoading={isLoading}
                            variant="primary"
                            className="w-full h-11 text-sm font-semibold bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-md shadow-2xs flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                            {isLoading ? 'Signing In…' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-[#384150]" />
                        </div>
                        <div className="relative flex justify-center text-[11px] uppercase">
                            <span className="bg-white dark:bg-[#181a20] px-3 text-gray-400 dark:text-slate-400 font-semibold tracking-wider">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign-In */}
                    <button
                        type="button"
                        onClick={() => window.location.href = '/auth/google'}
                        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-[#384150] hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 font-semibold text-xs rounded-md transition-all shadow-2xs cursor-pointer"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.27v3.13C3.26 21.3 7.31 24 12 24z" />
                            <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.63H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.37l4.01-3.13z" />
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.63l4.01 3.13c.95-2.85 3.6-4.96 6.72-4.96z" />
                        </svg>
                        <span>Sign in with Google</span>
                    </button>

                    {/* Demo Credentials */}
                    <DemoCredentials
                        onSelect={(email, password) => {
                            setFormData({ email, password });
                            setErrors({});
                        }}
                    />

                    {/* Footer Register Link */}
                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/web/register" className="font-semibold text-[#FF4A1F] hover:underline transition-colors">
                            Register
                        </Link>
                    </p>
                </div>
            </div>

            {/* Modular 2FA Verification Modal */}
            <TwoFactorModal
                isOpen={is2FAModalOpen}
                onClose={() => setIs2FAModalOpen(false)}
                onSuccess={() => {
                    if (pendingLoginRes) {
                        completeLoginRedirect(pendingLoginRes);
                    }
                }}
            />
        </div>
    );
}
