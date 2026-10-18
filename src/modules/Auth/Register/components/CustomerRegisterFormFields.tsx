import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '../../../../components/ui/input';
import Button from '../../../../components/ui/button';

interface CustomerRegisterFormFieldsProps {
    formData: {
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
    agreed: boolean;
    errors: Record<string, string>;
    isLoading: boolean;
    onInputChange: (field: string, value: string) => void;
    onAgreedChange: (checked: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const CustomerRegisterFormFields: React.FC<CustomerRegisterFormFieldsProps> = ({
    formData,
    agreed,
    errors,
    isLoading,
    onInputChange,
    onAgreedChange,
    onSubmit,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute top-0 left-0 h-[42px] pl-3 flex items-center pointer-events-none z-10">
                        <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                        type="text"
                        className="pl-9 bg-white"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => onInputChange('fullName', e.target.value)}
                        error={errors.fullName}
                    />
                </div>
            </div>

            <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
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
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
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
                        className="absolute top-0 right-0 h-[42px] pr-3 flex items-center z-10 text-gray-400 hover:text-[#FF4A1F] focus:outline-none cursor-pointer"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">
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
                        className="absolute top-0 right-0 h-[42px] pr-3 flex items-center z-10 text-gray-400 hover:text-[#FF4A1F] focus:outline-none cursor-pointer"
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
                            onChange={(e) => onAgreedChange(e.target.checked)}
                            className={`w-4 h-4 rounded cursor-pointer accent-[#FF4A1F] focus:ring-[#FF4A1F] ${
                                errors.agreed ? 'border-[#d82c0d] text-[#d82c0d]' : 'border-gray-300 text-[#FF4A1F]'
                            }`}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700">
                            I agree to the{' '}
                            <a href="#" className="text-[#FF4A1F] hover:underline font-semibold">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-[#FF4A1F] hover:underline font-semibold">
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                </div>
                {errors.agreed && <span className="text-[12px] text-[#d82c0d] mt-1 ml-7">{errors.agreed}</span>}
            </div>

            <Button type="submit" isLoading={isLoading} fullWidth={true} className="mt-4">
                Create Account
            </Button>
        </form>
    );
};
