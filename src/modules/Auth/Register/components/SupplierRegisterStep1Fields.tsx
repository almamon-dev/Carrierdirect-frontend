import React from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import Input from '../../../../components/ui/input';
import Button from '../../../../components/ui/button';
import { SupplierFormData } from '../hooks/supplierRegisterUtils';

interface SupplierRegisterStep1FieldsProps {
    formData: SupplierFormData;
    errors: Record<string, string>;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (show: boolean) => void;
    isStep1Loading: boolean;
    onInputChange: (field: string, value: string) => void;
    onContinue: (e: React.FormEvent) => void;
}

export const SupplierRegisterStep1Fields: React.FC<SupplierRegisterStep1FieldsProps> = ({
    formData,
    errors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isStep1Loading,
    onInputChange,
    onContinue
}) => {
    return (
        <form onSubmit={onContinue} className="space-y-3">
            <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-slate-200 mb-1">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                        <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                        type="text"
                        className="pl-9 bg-white"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => onInputChange('fullName', e.target.value)}
                        error={errors.fullName}
                    />
                </div>
            </div>

            <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-slate-200 mb-1">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                        <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                        type="email"
                        className="pl-9 bg-white"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => onInputChange('email', e.target.value)}
                        error={errors.email}
                    />
                </div>
            </div>

            <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-slate-200 mb-1">
                    Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                        <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        className="pl-9 pr-10 bg-white"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => onInputChange('password', e.target.value)}
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
                <label className="block text-[13px] font-medium text-gray-700 dark:text-slate-200 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                        <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="pl-9 pr-10 bg-white"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => onInputChange('confirmPassword', e.target.value)}
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

            <Button type="submit" isLoading={isStep1Loading} fullWidth={true} className="mt-6">
                Continue
            </Button>

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
                        className="w-full h-[42px] flex items-center justify-center px-4 border border-gray-300 rounded-md shadow-sm text-[14px] font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
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
        </form>
    );
};
