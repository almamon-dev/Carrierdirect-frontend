import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import Input from '../../../../components/ui/input';
import Button from '../../../../components/ui/button';

interface LoginFormFieldsProps {
    email: string;
    password: string;
    errors: Record<string, string>;
    isLoading: boolean;
    onInputChange: (field: string, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
    email,
    password,
    errors,
    isLoading,
    onInputChange,
    onSubmit,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form onSubmit={onSubmit} className="space-y-4">
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
                        value={email}
                        onChange={(e) => onInputChange('email', e.target.value)}
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
                        value={password}
                        onChange={(e) => onInputChange('password', e.target.value)}
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
    );
};
