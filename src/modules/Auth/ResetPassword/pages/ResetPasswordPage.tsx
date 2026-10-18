import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../../../../lib/axios';
import { ENDPOINTS } from '../../../../config/api';
import { ResetPasswordLeftBanner } from '../components/ResetPasswordLeftBanner';
import { ResetPasswordInvalidLinkView } from '../components/ResetPasswordInvalidLinkView';
import { ResetPasswordSuccessView } from '../components/ResetPasswordSuccessView';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

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
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleClearError = (field: string) => {
        if (errors[field] || errors.general) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                delete newErrors.general;
                return newErrors;
            });
        }
    };

    const handleFormSubmit = async (password: string, confirmPassword: string) => {
        const newErrors: Record<string, string> = {};

        if (!password) {
            newErrors.password = 'New Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (password !== confirmPassword) {
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
                    password,
                    password_confirmation: confirmPassword,
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
            <Link
                to="/web/login"
                className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ff4a1f] hover:underline transition-colors"
            >
                <ArrowLeft className="w-4 h-4 text-[#ff4a1f]" />
                Back to Login
            </Link>

            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden min-h-[560px]">
                <ResetPasswordLeftBanner />

                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                    {isMissingParams && !isSuccess ? (
                        <ResetPasswordInvalidLinkView />
                    ) : !isSuccess ? (
                        <ResetPasswordForm
                            email={email}
                            maskEmail={maskEmail}
                            errors={errors}
                            isLoading={isLoading}
                            onSubmit={handleFormSubmit}
                            onClearError={handleClearError}
                        />
                    ) : (
                        <ResetPasswordSuccessView />
                    )}
                </div>
            </div>
        </div>
    );
}
