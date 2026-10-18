import React from 'react';
import { RefreshCw, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/button';
import { InvitationAcceptedCredentialsBox } from './InvitationAcceptedCredentialsBox';

interface InvitationAcceptedStatusStatesProps {
    status: 'verifying' | 'success' | 'error';
    emailParam: string;
    passwordParam: string;
    errorMessage: string;
    isNavigating: boolean;
    copied: boolean;
    onContinue: () => void;
    onCopyPassword: () => void;
}

export const InvitationAcceptedStatusStates: React.FC<InvitationAcceptedStatusStatesProps> = ({
    status,
    emailParam,
    passwordParam,
    errorMessage,
    isNavigating,
    copied,
    onContinue,
    onCopyPassword,
}) => {
    if (status === 'verifying') {
        return (
            <div className="py-4 animate-in fade-in">
                <div className="w-12 h-12 bg-orange-50 dark:bg-[#ff4a1f]/10 text-[#ff4a1f] rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 dark:border-[#ff4a1f]/20 animate-pulse">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
                    Activating Your Invitation...
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Please wait a moment while we verify your invitation token and activate your team account.
                </p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="py-2 animate-in fade-in">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-emerald-100 dark:border-emerald-800/40 shadow-2xs">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                    Welcome to the Team! 🎉
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed max-w-sm mx-auto">
                    Your invitation has been successfully accepted. Your account is now active and ready to use.
                </p>

                <InvitationAcceptedCredentialsBox
                    emailParam={emailParam}
                    passwordParam={passwordParam}
                    copied={copied}
                    onCopyPassword={onCopyPassword}
                />

                <div className="space-y-2.5 max-w-sm mx-auto w-full">
                    <Button
                        onClick={onContinue}
                        isLoading={isNavigating}
                        disabled={isNavigating}
                        variant="primary"
                        className="w-full h-10 text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] rounded-[4px] shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Continue to Dashboard / Sign In</span>
                        {!isNavigating && <ArrowRight className="w-4 h-4" />}
                    </Button>

                    <Link
                        to="/"
                        className="w-full h-10 flex items-center justify-center gap-2 px-4 border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                    >
                        <span>Return to Home</span>
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="py-2 animate-in fade-in">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-red-100 dark:border-red-800/40">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
                    Invalid or Expired Invitation
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed max-w-sm mx-auto">
                    {errorMessage || 'This invitation token is invalid or has already been used.'}
                </p>

                <div className="space-y-2.5 max-w-sm mx-auto w-full">
                    <Link
                        to="/web/login"
                        className="w-full h-10 text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] rounded-[4px] shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Proceed to Login</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                        to="/contact-us"
                        className="w-full h-10 flex items-center justify-center gap-2 px-4 border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                    >
                        <span>Contact Support</span>
                    </Link>
                </div>
            </div>
        );
    }

    return null;
};
