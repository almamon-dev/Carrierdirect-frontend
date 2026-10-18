import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/button';

interface VerifyEmailStatusStatesProps {
    status: 'verifying' | 'success' | 'error';
    nextRedirect: string;
    isNavigating: boolean;
    handleProceed: () => void;
    onResendNotice: () => void;
}

export const VerifyEmailStatusStates: React.FC<VerifyEmailStatusStatesProps> = ({
    status,
    nextRedirect,
    isNavigating,
    handleProceed,
    onResendNotice,
}) => {
    if (status === 'verifying') {
        return (
            <div className="py-6">
                <div className="w-16 h-16 bg-orange-50 text-[#ff4a1f] rounded-full flex items-center justify-center mx-auto mb-5 border border-orange-100 animate-pulse">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Verifying Your Email...</h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                    Please wait a moment while we validate your verification token and activate your account.
                </p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="py-2">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Email Verified Successfully!</h2>
                <p className="text-sm text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
                    Thank you for verifying your email address. Your account is now fully active and ready to use.
                </p>
                <div className="space-y-3 max-w-md mx-auto w-full">
                    <Button
                        onClick={handleProceed}
                        isLoading={isNavigating}
                        disabled={isNavigating}
                        variant="primary"
                        className="w-full h-11 text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] rounded-[4px] shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>{nextRedirect.includes('complete-profile') ? 'Complete Your Profile' : 'Continue to Dashboard'}</span>
                    </Button>
                    <Link
                        to="/"
                        className="w-full h-11 flex items-center justify-center gap-2 px-4 border border-slate-200 rounded-[4px] text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <span>Return to Home Page</span>
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="py-2">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-100">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Link Expired or Invalid</h2>
                <p className="text-sm text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
                    The verification link is invalid or has expired. Please request a new verification link.
                </p>
                <div className="space-y-3 max-w-md mx-auto w-full">
                    <Button
                        onClick={onResendNotice}
                        isLoading={isNavigating}
                        disabled={isNavigating}
                        variant="primary"
                        className="w-full h-11 text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] rounded-lg shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {!isNavigating && <Mail className="w-4 h-4" />}
                        <span>Resend Verification Link</span>
                    </Button>
                    <Link
                        to="/web/login"
                        className="w-full h-11 flex items-center justify-center gap-2 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <span>Back to Sign In</span>
                    </Link>
                </div>
            </div>
        );
    }

    return null;
};
