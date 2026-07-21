import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../../../assets/Images/LogoBlack.png';
import Input from '../../../../components/ui/input';

export default function CustomerRegisterPage() {
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const handleAgreedChange = (checked: boolean) => {
        setAgreed(checked);
        if (errors.agreed) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.agreed;
                return newErrors;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email Address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (!agreed) newErrors.agreed = 'You must agree to the Terms & Privacy Policy';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Handle registration logic here
            navigate('/customer/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative p-4">
            {/* Top Left Back Button */}
            <div className="absolute top-6 left-6">
                <Link to="/web/register" className="flex items-center text-sm font-medium text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Account Type
                </Link>
            </div>

            {/* The Main Centered Card */}
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[700px]">

                {/* Left Side - Logo & Background */}
                <div className="hidden md:flex md:w-8/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 flex flex-col items-center w-full">
                        <img src={Logo} alt="GetItMoving Logo" className="w-full max-w-[400px] object-contain" />
                        <h2 className="text-[15px] font-bold text-slate-800 mt-10 text-center tracking-tight">Customer Portal</h2>
                        <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed">
                            Find top-rated movers and request moving quotes instantly.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-8/12 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-[15px] font-bold text-slate-800">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            It only takes a minute to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    type="text"
                                    className="pl-9 bg-white"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    error={errors.fullName}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    type="email"
                                    className="pl-9 bg-white"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    error={errors.email}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    className="pl-9 pr-10 bg-white"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    error={errors.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-0 right-0 h-[42px] pr-3 flex items-center z-10 text-gray-400 hover:text-[#FF4A1F] focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="pl-9 pr-10 bg-white"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    error={errors.confirmPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute top-0 right-0 h-[42px] pr-3 flex items-center z-10 text-gray-400 hover:text-[#FF4A1F] focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col pt-2">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => handleAgreedChange(e.target.checked)}
                                        className={`w-4 h-4 rounded cursor-pointer focus:ring-[#FF4A1F] ${errors.agreed ? 'border-[#d82c0d] text-[#d82c0d]' : 'border-gray-300 text-[#FF4A1F]'}`}
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-medium text-gray-700">
                                        I agree to the <a href="#" className="text-[#FF4A1F] hover:underline font-semibold">Terms of Service</a> and <a href="#" className="text-[#FF4A1F] hover:underline font-semibold">Privacy Policy</a>
                                    </label>
                                </div>
                            </div>
                            {errors.agreed && <span className="text-[12px] text-[#d82c0d] mt-1 ml-7">{errors.agreed}</span>}
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[42px] flex items-center justify-center px-4 border border-transparent rounded-[4px] shadow-sm text-[14px] font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] focus:outline-none"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                className="w-full h-[42px] flex items-center justify-center px-4 border border-gray-300 rounded-[4px] shadow-sm text-[14px] font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Sign up with Google
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/web/login" className="font-semibold text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
