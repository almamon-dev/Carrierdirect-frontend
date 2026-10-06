import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';
import Input from '../../../../components/ui/input';
import Button from '../../../../components/ui/button';
import apiClient from '../../../../lib/axios';
import { ENDPOINTS } from '../../../../config/api';

function maskEmail(emailStr: string): string {
    if (!emailStr || !emailStr.includes('@')) return emailStr;
    const [localPart, domain] = emailStr.split('@');
    if (localPart.length <= 2) {
        return `${localPart[0]}***@${domain}`;
    }
    const firstChar = localPart[0];
    const lastChar = localPart[localPart.length - 1];
    const maskedLength = Math.max(localPart.length - 2, 4);
    const maskedMiddle = '•'.repeat(Math.min(maskedLength, 8));
    return `${firstChar}${maskedMiddle}${lastChar}@${domain}`;
}

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field] || errors.general) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                delete newErrors.general;
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

        if (!token || !email) {
            newErrors.general = 'Missing reset token or email address. Please request a new link.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
                    email,
                    token,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword,
                });
                setIsSuccess(true);
            } catch (err: any) {
                console.error('Password reset error:', err);
                const apiMsg = err.response?.data?.message || err.message || 'Failed to reset password. Please try again.';
                setErrors({ general: apiMsg });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const isMissingParams = !token || !email;

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
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden min-h-[560px]">

                {/* Left Side - Logo & Background */}
                <div className="hidden md:flex md:w-5/12 bg-[#f8fafc] flex-col items-center justify-center p-10 relative border-r border-gray-100">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 flex flex-col items-center w-full">
                        <Link to="/">
                            <img src={LogoBlack} alt="CarrierDirect Logo" className="w-full max-w-[240px] object-contain dark:hidden" />
                            <img src={LogoWhite} alt="CarrierDirect Logo" className="w-full max-w-[240px] object-contain hidden dark:block" />
                        </Link>
                        <h2 className="text-xl font-bold text-slate-800 mt-8 text-center tracking-tight">Create New Password</h2>
                        <p className="mt-2 text-sm text-gray-500 text-center leading-relaxed">
                            Your security is our priority. Set a strong password for your account.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form / Success State */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                    
                    {isMissingParams && !isSuccess ? (
                        <div className="text-center py-6">
                            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">
                                Invalid Reset Link
                            </h2>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-sm mx-auto">
                                The password reset link appears to be missing required verification parameters. Please request a fresh reset link.
                            </p>
                            <Link
                                to="/web/forgot-password"
                                className="w-full h-[42px] flex items-center justify-center px-4 rounded-md shadow-sm text-sm font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] transition-all cursor-pointer"
                            >
                                Request New Reset Link
                            </Link>
                        </div>
                    ) : !isSuccess ? (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Set New Password
                                </h2>
                                <p className="mt-1.5 text-sm text-gray-500">
                                    Resetting password for <span className="font-semibold text-slate-800 font-mono text-sm">{maskEmail(email)}</span>
                                </p>
                            </div>

                            {errors.general && (
                                <div className="mb-5 p-3.5 bg-red-50/80 border border-red-200/80 rounded-lg flex items-start gap-3 text-red-700 text-xs font-medium">
                                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    <span>{errors.general}</span>
                                </div>
                            )}

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
                                        disabled={isLoading}
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
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        isLoading={isLoading}
                                        variant="primary"
                                        className="w-full h-[42px] text-sm font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] rounded-md shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        Reset Password
                                    </Button>
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
                                Your password has been updated successfully. You can now log in using your new credentials.
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
