import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Logo from '../../../../assets/Images/LogoBlack.png';
import Input from '../../../../components/ui/input';
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
    const [showPassword, setShowPassword]         = useState(false);
    const [formData, setFormData]                 = useState({ email: '', password: '' });
    const [errors, setErrors]                     = useState<Record<string, string>>({});
    const [isLoading, setIsLoading]               = useState(false);
    const [processing, setProcessing]             = useState(false);
    const [redirectUserType, setRedirectUserType] = useState<string | null>(null);

    // ── Guard: redirect already-authenticated users ───────────────────────────
    useEffect(() => {
        const token   = localStorage.getItem(TOKEN_CONFIG.accessTokenKey);
        const userStr = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (!token || !userStr) return;

        try {
            const user = JSON.parse(userStr);
            const role = user?.user_type;
            if (role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else if (role === 'supplier') {
                navigate('/supplier/dashboard', { replace: true });
            } else if (role === 'customer') {
                navigate('/customer/dashboard', { replace: true });
            }
        } catch {
            // Corrupt data — clear and stay on login
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
                email:    formData.email,
                password: formData.password,
            });

            if (res.requiresPayment && res.checkoutUrl) {
                window.location.href = res.checkoutUrl;
                return;
            }

            const userType = res.user?.user_type || 'customer';

            // Show processing overlay, then redirect
            setRedirectUserType(userType);
            setProcessing(true);

            setTimeout(() => {
                if (userType === 'admin') {
                    // Admin dashboard is at Laravel Inertia, open in same tab
                    window.location.href = '/admin/dashboard';
                } else if (userType === 'supplier') {
                    navigate('/supplier/dashboard');
                } else {
                    navigate('/customer/dashboard');
                }
            }, 1400);

        } catch (error: any) {
            console.error('Login error:', error);
            const apiMsg =
                error.data?.message  ||
                error.data?.error    ||
                error.message        ||
                'Invalid email or password. Please try again.';
            setErrors({ general: apiMsg });
            setIsLoading(false);
        }
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* Processing overlay */}
            {processing && <ProcessingOverlay userType={redirectUserType} />}

            <div className="min-h-screen flex items-center justify-center bg-gray-50 relative p-4 font-sans">

                {/* Back button */}
                <div className="absolute top-6 left-6 z-20">
                    <Link to="/" className="flex items-center text-sm font-medium text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[520px]">

                    {/* Left panel */}
                    <div className="md:w-1/2 bg-[#f8fafc] flex flex-col items-center justify-center p-12 relative border-r border-gray-100">
                        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        <div className="relative z-10 flex flex-col items-center w-full">
                            <Link to="/">
                                <img src={Logo} alt="GetItMoving Logo" className="w-full max-w-[320px] md:max-w-[380px] object-contain scale-110" />
                            </Link>
                        </div>
                    </div>

                    {/* Right panel — Form */}
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">

                        <div className="mb-6">
                            <h2 className="text-[15px] font-bold text-slate-800">Log In to Your Account</h2>
                            <p className="mt-1 text-sm text-gray-500">Welcome back! Please enter your details to continue.</p>
                        </div>

                        {/* General error */}
                        {errors.general && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-xs font-semibold text-red-600">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Email Address *"
                                type="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                icon={<Mail size={16} className="text-gray-400" />}
                                error={errors.email}
                            />

                            <div>
                                <Input
                                    label="Password *"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    icon={<Lock size={16} className="text-gray-400" />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    }
                                    error={errors.password}
                                />
                                <div className="flex justify-end mt-1.5">
                                    <Link to="/forgot-password" className="text-xs font-medium text-[#FF4A1F] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={isLoading || processing}
                                className="w-full py-3 px-4 bg-[#FF4A1F] hover:bg-[#E03E15] text-white font-bold text-sm rounded-md transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Signing in…</span>
                                    </>
                                ) : (
                                    <span>Log In</span>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-[11px] uppercase">
                                <span className="bg-white px-2 text-gray-400 font-semibold">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign-In */}
                        <button
                            type="button"
                            onClick={() => window.location.href = '/auth/google'}
                            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-md transition-all shadow-2xs cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.27v3.13C3.26 21.3 7.31 24 12 24z"/>
                                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.63H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.37l4.01-3.13z"/>
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.63l4.01 3.13c.95-2.85 3.6-4.96 6.72-4.96z"/>
                            </svg>
                            <span>Sign in with Google</span>
                        </button>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>Don't have an account?</span>
                                <Link to="/select-role" className="font-bold text-[#FF4A1F] hover:underline">
                                    Create Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
