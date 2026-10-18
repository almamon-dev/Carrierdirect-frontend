import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VerifyEmailLeftBanner } from '../components/VerifyEmailLeftBanner';
import { VerifyEmailStatusStates } from '../components/VerifyEmailStatusStates';
import { useVerifyEmailFlow } from '../hooks/useVerifyEmailFlow';

export default function VerifyEmailPage() {
    const { status, nextRedirect, isNavigating, handleProceed, navigate } = useVerifyEmailFlow();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative p-4 sm:p-6 font-sans antialiased">
            <Link
                to="/web/login"
                className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ff4a1f] hover:underline transition-colors"
            >
                <ArrowLeft className="w-4 h-4 text-[#ff4a1f]" />
                Back to Login
            </Link>

            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden min-h-[520px] border border-slate-100">
                <VerifyEmailLeftBanner />

                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center text-center">
                    <VerifyEmailStatusStates
                        status={status}
                        nextRedirect={nextRedirect}
                        isNavigating={isNavigating}
                        handleProceed={handleProceed}
                        onResendNotice={() => navigate('/web/verify-email-notice')}
                    />
                </div>
            </div>
        </div>
    );
}
