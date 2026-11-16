import React from 'react';
import { User, Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Input from '../../../../components/ui/input';
import Button from '../../../../components/ui/button';
import { SupplierFormData } from '../hooks/supplierRegisterUtils';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

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
                    Company / Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                        <Building2 className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                        type="text"
                        className="pl-9 bg-white"
                        placeholder="e.g. Acme Transport & Logistics Ltd"
                        value={formData.companyName}
                        onChange={(e) => onInputChange('companyName', e.target.value)}
                        error={errors.companyName}
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
                    <GoogleAuthButton
                        role="supplier"
                        label="Sign up with Google"
                        className="h-[42px] text-[14px] font-bold border-gray-300 shadow-sm"
                    />
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
