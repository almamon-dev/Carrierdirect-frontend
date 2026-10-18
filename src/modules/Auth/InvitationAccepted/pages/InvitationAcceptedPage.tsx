import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { InvitationAcceptedLeftBanner } from '../components/InvitationAcceptedLeftBanner';
import { InvitationAcceptedStatusStates } from '../components/InvitationAcceptedStatusStates';
import { useInvitationAcceptedFlow } from '../hooks/useInvitationAcceptedFlow';

export default function InvitationAcceptedPage() {
    const {
        status,
        emailParam,
        passwordParam,
        errorMessage,
        isNavigating,
        copied,
        handleContinue,
        handleCopyPassword,
    } = useInvitationAcceptedFlow();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0e1117] relative p-4 font-sans">
            <div className="absolute top-6 left-6 z-20">
                <Link to="/web/login" className="flex items-center text-sm font-medium text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Link>
            </div>

            <div className="main-auth-card flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-[#181a20] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border-2 border-gray-200 dark:border-[#384150] overflow-hidden min-h-[460px]">
                <InvitationAcceptedLeftBanner />

                <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center text-center bg-white dark:bg-[#181a20]">
                    <InvitationAcceptedStatusStates
                        status={status}
                        emailParam={emailParam}
                        passwordParam={passwordParam}
                        errorMessage={errorMessage}
                        isNavigating={isNavigating}
                        copied={copied}
                        onContinue={handleContinue}
                        onCopyPassword={handleCopyPassword}
                    />
                </div>
            </div>
        </div>
    );
}
