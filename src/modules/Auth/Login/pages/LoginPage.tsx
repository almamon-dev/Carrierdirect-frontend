import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../../../assets/Images/LogoBlack.png';
import Input from '../../../../components/ui/input';

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleDemoLogin = (type: 'customer' | 'supplier') => {
        if (type === 'customer') {
            const demoData = { email: 'customer@getitmoving.com', password: 'password123' };
            setFormData(demoData);
            localStorage.setItem('erp_access_token', 'demo_customer_token_123');
            localStorage.setItem('erp_user_data', JSON.stringify({ user_type: 'customer', name: 'Demo Customer', email: demoData.email }));
        } else {
            const demoData = { email: 'supplier@getitmoving.com', password: 'password123' };
            setFormData(demoData);
            localStorage.setItem('erp_access_token', 'demo_supplier_token_123');
            localStorage.setItem('erp_user_data', JSON.stringify({ user_type: 'supplier', name: 'Demo Supplier', email: demoData.email }));
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

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 600));
                
                const isSupplier = formData.email.includes('supplier');
                if (isSupplier) {
                    localStorage.setItem('erp_access_token', 'supplier_token');
                    localStorage.setItem('erp_user_data', JSON.stringify({ user_type: 'supplier', email: formData.email }));
                    navigate('/supplier/dashboard');
                } else {
                    localStorage.setItem('erp_access_token', 'customer_token');
                    localStorage.setItem('erp_user_data', JSON.stringify({ user_type: 'customer', email: formData.email }));
                    navigate('/customer/dashboard');
                }
            } catch (error) {
                console.error('Login error', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative p-4 sm:p-6">
            
            {/* Top-Left Screen Corner Link */}
            <Link 
                to="/" 
                className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ff4a1f] hover:underline transition-colors"
            >
                <ArrowLeft className="w-4 h-4 text-[#ff4a1f]" />
                Back to Home
            </Link>

            {/* Main Card Container */}
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden min-h-[600px]">

                {/* Left Side - Logo & Background */}
                <div className="hidden md:flex md:w-5/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 flex flex-col items-center w-full">
                        <Link to="/">
                            <img src={Logo} alt="GetItMoving Logo" className="w-full max-w-[280px] object-contain" />
                        </Link>
                        <h2 className="text-xl font-bold text-slate-800 mt-10 text-center tracking-tight">Welcome Back!</h2>
                        <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed">
                            Sign in to access your shipping portal, track deliveries, and manage your account.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                    
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Log In to your account
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Enter your credentials to continue.
                        </p>
                    </div>

                    {/* Simple CodeCanyon Style Demo Login Bar */}
                    <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-md">
                        <div className="text-[11px] font-bold text-slate-500 mb-2">
                            Demo Accounts:
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('customer')}
                                className="flex-1 px-3 py-2 bg-white border border-slate-200 hover:border-[#ff4a1f] text-slate-700 rounded-md text-xs font-semibold transition-colors text-left flex items-center justify-between gap-2 cursor-pointer group"
                            >
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] text-slate-900 font-bold group-hover:text-[#ff4a1f]">Customer</span>
                                    <span className="text-[11px] text-slate-500 font-normal truncate">customer@getitmoving.com</span>
                                </div>
                                <span className="text-[10.5px] text-[#ff4a1f] font-bold whitespace-nowrap shrink-0 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Fill &rarr;</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('supplier')}
                                className="flex-1 px-3 py-2 bg-white border border-slate-200 hover:border-[#ff4a1f] text-slate-700 rounded-md text-xs font-semibold transition-colors text-left flex items-center justify-between gap-2 cursor-pointer group"
                            >
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] text-slate-900 font-bold group-hover:text-[#ff4a1f]">Supplier</span>
                                    <span className="text-[11px] text-slate-500 font-normal truncate">supplier@getitmoving.com</span>
                                </div>
                                <span className="text-[10.5px] text-[#ff4a1f] font-bold whitespace-nowrap shrink-0 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Fill &rarr;</span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Address Field */}
                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="email"
                                icon={<Mail className="h-4 w-4 text-gray-400" />}
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                error={errors.email}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-[13px] font-bold text-gray-700">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <Link to="/web/forgot-password" className="text-xs text-[#FF4A1F] hover:underline font-semibold">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                type={showPassword ? "text" : "password"}
                                icon={<Lock className="h-4 w-4 text-gray-400" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-[#FF4A1F] focus:outline-none cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                }
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                error={errors.password}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-[42px] flex items-center justify-center px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                className="w-full h-[42px] flex items-center justify-center px-4 border border-gray-300 rounded-md shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all cursor-pointer"
                            >
                                <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/web/register" className="font-semibold text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    );
}
