import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Truck, Zap, ShieldCheck, Key, Loader2 } from 'lucide-react';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';
import Input from '../../../../components/ui/input';
import Button from '../../../../components/ui/button';
import Modal from '../../../../components/modals/modal';
import authService from '../../../../services/authService';
import { TOKEN_CONFIG } from '../../../../config/auth';

// ─── Full-screen processing overlay ─────────────────────────────────────────
function ProcessingOverlay({ userType }: { userType: string | null }) {
    const label =
        userType === 'supplier'
            ? 'Redirecting to Supplier Dashboard…'
            : userType === 'admin'
                ? 'Redirecting to Admin Panel…'
                : 'Redirecting to Customer Dashboard…';

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
            {/* Animated ring */}
            <div className="relative flex items-center justify-center mb-8">
                {/* Outer slow pulse ring */}
                <span className="absolute inline-flex h-24 w-24 rounded-full bg-[#FF4A1F] opacity-10 animate-ping" />
                {/* Spinner ring */}
                <svg
                    className="animate-spin h-16 w-16 text-[#FF4A1F]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-20"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="3"
                    />
                    <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
                {/* Center logo dot */}
                <span className="absolute h-8 w-8 rounded-full bg-[#FF4A1F] flex items-center justify-center shadow-lg">
                    <span className="h-3 w-3 rounded-full bg-white" />
                </span>
            </div>

            <h2 className="text-slate-800 text-lg font-bold tracking-tight mb-1">
                Login Successful!
            </h2>
            <p className="text-sm text-slate-500 font-medium animate-pulse">
                {label}
            </p>

            {/* Progress bar */}
            <div className="mt-8 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF4A1F] rounded-full animate-[progress_1.2s_ease-in-out_forwards]" />
            </div>

            <style>{`
                @keyframes progress {
                    from { width: 0% }
                    to   { width: 100% }
                }
            `}</style>
        </div>
    );
}

// ─── Login Page ──────────────────────────────────────────────────────────────
export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [redirectUserType, setRedirectUserType] = useState<string | null>(null);

    // 2FA Verification Modal State
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [isVerifying2FA, setIsVerifying2FA] = useState(false);
    const [otpError, setOtpError] = useState('');
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
                const isIncomplete = !user?.country || !user?.city || !user?.zip_code;
                if (isIncomplete) {
                    navigate('/supplier/complete-profile', { replace: true });
                } else {
                    navigate('/supplier/dashboard', { replace: true });
                }
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

    const completeLoginRedirect = (res: any) => {
        const userType = res.user?.user_type || 'customer';
        setRedirectUserType(userType);
        setProcessing(true);

        setTimeout(() => {
            if (userType === 'admin') {
                window.location.href = '/admin/dashboard';
            } else if (userType === 'supplier') {
                const userObj = res.user;
                const isIncomplete = !userObj?.country || !userObj?.city || !userObj?.zip_code;
                if (isIncomplete) {
                    navigate('/supplier/complete-profile');
                } else {
                    navigate('/supplier/dashboard');
                }
            } else {
                navigate('/customer/dashboard');
            }
        }, 1400);
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

    const handleVerify2FA = (e: React.FormEvent) => {
        e.preventDefault();
        if (otpInput.length < 6) {
            setOtpError('Please enter a valid 6-digit verification code.');
            return;
        }

        setIsVerifying2FA(true);
        setOtpError('');

        setTimeout(() => {
            setIsVerifying2FA(false);
            setIs2FAModalOpen(false);
            if (pendingLoginRes) {
                completeLoginRedirect(pendingLoginRes);
            }
        }, 600);
    };

    if (processing) {
        return <ProcessingOverlay userType={redirectUserType} />;
    }

    return (
        <>
            <div className="min-h-screen bg-slate-50 dark:bg-[#12161c] flex items-center justify-center p-3 sm:p-4 font-sans text-slate-900">
                <div className="w-full max-w-md">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-4 transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>

                    <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-xl border border-gray-200 dark:border-[#2b313a] p-5 sm:p-7">

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-block mb-3">
                                <img src={LogoBlack} alt="CarrierDirect" className="h-9 dark:hidden mx-auto" />
                                <img src={LogoWhite} alt="CarrierDirect" className="h-9 hidden dark:block mx-auto" />
                            </div>
                            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Welcome Back</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to manage your shipments and capacity</p>
                        </div>

                        {/* Error Alert */}
                        {errors.general && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-md text-xs font-medium text-red-600 dark:text-red-400 text-center">
                                {errors.general}
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Email Address *"
                                type="email"
                                icon={<Mail className="w-4 h-4 text-slate-400" />}
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="name@company.com"
                                error={errors.email}
                                required
                            />

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Password *
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-[11px] font-bold text-[#FF4A1F] hover:underline"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        icon={<Lock className="w-4 h-4 text-slate-400" />}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="••••••••"
                                        error={errors.password}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-10 text-xs font-bold bg-[#FF4A1F] hover:bg-[#e03e15] text-white shadow-md cursor-pointer mt-2"
                            >
                                {isLoading ? 'Signing In…' : 'Sign In'}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-[#2b313a]" />
                            </div>
                            <div className="relative flex justify-center text-[11px] uppercase">
                                <span className="bg-white dark:bg-[#181a20] px-2 text-gray-400 dark:text-slate-400 font-semibold">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign-In */}
                        <button
                            type="button"
                            onClick={() => window.location.href = '/auth/google'}
                            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-[#2b313a] hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 font-bold text-xs rounded-md transition-all shadow-2xs cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.27v3.13C3.26 21.3 7.31 24 12 24z" />
                                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.63H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.37l4.01-3.13z" />
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.63l4.01 3.13c.95-2.85 3.6-4.96 6.72-4.96z" />
                            </svg>
                            <span>Sign in with Google</span>
                        </button>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2b313a]">
                            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
                                <span>Don't have an account?</span>
                                <Link to="/select-role" className="font-bold text-[#FF4A1F] hover:underline">
                                    Create Account
                                </Link>
                            </div>
                        </div>

                        {/* Demo / Test Credentials Cards */}
                        <div className="mt-3 pt-2.5 border-t border-dashed border-gray-200 dark:border-[#2b313a]">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <Zap size={11} className="text-amber-500 fill-amber-500" /> Demo Credentials
                                </span>
                                <span className="text-[10px] text-gray-400 dark:text-slate-500">Click to fill</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {/* Customer Test Account */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ email: 'customer@gmail.com', password: 'password' });
                                        setErrors({});
                                    }}
                                    className="flex items-center justify-between p-2.5 bg-blue-50/60 hover:bg-blue-100/60 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 border border-blue-100 hover:border-blue-300 dark:border-blue-800/60 rounded-lg transition-all text-left group cursor-pointer"
                                    title="customer@gmail.com • password"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center shrink-0">
                                            <User size={13} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">Customer</div>
                                            <div className="text-[10px] text-blue-700 dark:text-blue-300 font-mono leading-tight truncate">customer@gmail.com</div>
                                            <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">pass: password</div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 shrink-0 group-hover:translate-x-0.5 transition-transform">
                                        Fill →
                                    </span>
                                </button>

                                {/* Supplier Test Account */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ email: 'supplier@gmail.com', password: 'password' });
                                        setErrors({});
                                    }}
                                    className="flex items-center justify-between p-2.5 bg-amber-50/60 hover:bg-amber-100/60 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border border-amber-100 hover:border-amber-300 dark:border-amber-800/60 rounded-lg transition-all text-left group cursor-pointer"
                                    title="supplier@gmail.com • password"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-6 h-6 rounded bg-amber-500 text-white flex items-center justify-center shrink-0">
                                            <Truck size={13} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">Supplier</div>
                                            <div className="text-[10px] text-amber-700 dark:text-amber-300 font-mono leading-tight truncate">supplier@gmail.com</div>
                                            <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">pass: password</div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform">
                                        Fill →
                                    </span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* 2FA Verification Modal during Sign-In */}
            <Modal
                isOpen={is2FAModalOpen}
                onClose={() => setIs2FAModalOpen(false)}
                size="md"
                title={
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Two-Factor Authentication</h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Enter 6-digit verification code from your Authenticator app</p>
                        </div>
                    </div>
                }
            >
                <form onSubmit={handleVerify2FA} className="space-y-4 font-sans">
                    {otpError && (
                        <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-medium text-red-600 dark:text-red-400 rounded-lg text-center">
                            {otpError}
                        </div>
                    )}

                    <div className="bg-slate-50 dark:bg-[#1e2329] p-3 rounded-md border border-slate-200 dark:border-slate-700 text-center space-y-2">
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                            Enter the 6-digit TOTP code generated by <strong className="text-slate-900 dark:text-white">Google Authenticator</strong> or <strong className="text-slate-900 dark:text-white">Authy</strong>.
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            6-Digit Verification Code *
                        </label>
                        <Input
                            type="text"
                            maxLength={6}
                            value={otpInput}
                            onChange={(e) => {
                                setOtpInput(e.target.value.replace(/\D/g, ''));
                                setOtpError('');
                            }}
                            placeholder="e.g. 492018"
                            className="text-center font-mono tracking-widest text-base font-bold h-10"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isVerifying2FA || otpInput.length < 6}
                        className="w-full h-10 text-xs font-bold bg-[#FF4A1F] hover:bg-[#e03e15] text-white shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                        {isVerifying2FA ? <Loader2 size={16} className="animate-spin" /> : <Key size={15} />}
                        <span>{isVerifying2FA ? 'Verifying Code…' : 'Verify & Complete Sign In'}</span>
                    </Button>
                </form>
            </Modal>
        </>
    );
}
