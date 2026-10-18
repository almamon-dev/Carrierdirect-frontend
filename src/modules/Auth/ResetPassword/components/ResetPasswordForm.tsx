import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Input from '../../../../components/ui/input';
import Button from '../../../../components/ui/button';

interface ResetPasswordFormProps {
    email: string;
    maskEmail: (email: string) => string;
    errors: Record<string, string>;
    isLoading: boolean;
    onSubmit: (password: string, confirmPassword: string) => void;
    onClearError: (field: string) => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
    email,
    maskEmail,
    errors,
    isLoading,
    onSubmit,
    onClearError,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(password, confirmPassword);
    };

    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Set New Password</h2>
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
                <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        New Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type={showPassword ? 'text' : 'password'}
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
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            onClearError('password');
                        }}
                        error={errors.password}
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type={showConfirmPassword ? 'text' : 'password'}
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
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            onClearError('confirmPassword');
                        }}
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
    );
};
