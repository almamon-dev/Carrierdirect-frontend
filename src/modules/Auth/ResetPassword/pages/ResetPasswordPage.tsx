import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../../../assets/Images/LogoBlack.png';
import Input from '../../../../components/ui/input';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.password) {
            newErrors.password = 'New Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                // Simulate password reset API call
                await new Promise((resolve) => setTimeout(resolve, 800));
                setIsSuccess(true);
            } catch (error) {
                console.error(error);
                setErrors({ password: 'Failed to reset password. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative p-4 sm:p-6">
            {/* Top-Left Screen Corner Link */}
            <Link 
                to="/web/login" 
                className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ff4a1f] hover:underline transition-colors"
            >
                <ArrowLeft className="w-4 h-4 text-[#ff4a1f]" />
                Back to Login
            </Link>

            {/* Main Card Container */}
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden min-h-[560px]">

                {/* Left Side - Logo & Background */}
                <div className="hidden md:flex md:w-5/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 flex flex-col items-center w-full">
                        <Link to="/">
                            <img src={Logo} alt="GetItMoving Logo" className="w-full max-w-[240px] object-contain" />
                        </Link>
                        <h2 className="text-xl font-bold text-slate-800 mt-8 text-center tracking-tight">Create New Password</h2>
                        <p className="mt-2 text-sm text-gray-500 text-center leading-relaxed">
                            Your security is our priority. Set a strong password for your account.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form / Success State */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                    
                    {!isSuccess ? (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Set New Password
                                </h2>
                                <p className="mt-1.5 text-sm text-gray-500">
                                    Please enter your new password below to reset your account credentials.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* New Password */}
                                <div>
                                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                        New Password <span className="text-red-500">*</span>
                                    </label>
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
                                        placeholder="At least 8 characters"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        error={errors.password}
                                    />
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                        Confirm New Password <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        icon={<Lock className="h-4 w-4 text-gray-400" />}
                                        rightIcon={
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="text-gray-400 hover:text-[#FF4A1F] focus:outline-none cursor-pointer"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        }
                                        placeholder="Re-enter your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        error={errors.confirmPassword}
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-[42px] flex items-center justify-center px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                                    >
                                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                Password Reset Successfully!
                            </h2>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                Your password has been updated successfully. You can now log in using your new password.
                            </p>

                            <button
                                onClick={() => navigate('/web/login')}
                                className="w-full h-[42px] flex items-center justify-center px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] transition-all cursor-pointer"
                            >
                                Back to Log In
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
