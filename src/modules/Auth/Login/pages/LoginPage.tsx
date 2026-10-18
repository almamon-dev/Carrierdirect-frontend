import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';
import ProcessingOverlay from '../components/ProcessingOverlay';
import TwoFactorModal from '../components/TwoFactorModal';
import { LoginLeftBanner } from '../components/LoginLeftBanner';
import { LoginFormFields } from '../components/LoginFormFields';
import { LoginSocialAndDemoSection } from '../components/LoginSocialAndDemoSection';
import { useLoginForm } from '../hooks/useLoginForm';

export default function LoginPage() {
    const {
        formData,
        setFormData,
        errors,
        setErrors,
        isLoading,
        processing,
        redirectUserType,
        is2FAModalOpen,
        setIs2FAModalOpen,
        pendingLoginRes,
        invitationToken,
        invitationAccepted,
        handleInputChange,
        handleSubmit,
        completeLoginRedirect,
    } = useLoginForm();

    if (processing) {
        return <ProcessingOverlay userType={redirectUserType} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0e1117] relative p-4 font-sans">
            {/* Top Left Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <Link to="/" className="flex items-center text-sm font-medium text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </div>

            {/* The Main Centered Split Card */}
            <div className="main-auth-card flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-[#181a20] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border-2 border-gray-200 dark:border-[#384150] overflow-hidden min-h-[520px]">
                <LoginLeftBanner />

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#181a20]">
                    {/* Mobile Logo */}
                    <div className="md:hidden flex justify-center mb-6">
                        <Link to="/">
                            <img src={LogoBlack} alt="CarrierDirect Logo" className="h-8 dark:hidden object-contain" />
                            <img src={LogoWhite} alt="CarrierDirect Logo" className="h-8 hidden dark:block object-contain" />
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Sign in to your account to continue</p>
                    </div>

                    {/* Invitation Welcome Banner */}
                    {invitationToken && (
                        <div className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-lg flex items-start gap-3 text-left animate-in fade-in">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 text-emerald-600 font-bold text-sm">
                                ✓
                            </div>
                            <div>
                                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                    {invitationAccepted ? 'Invitation Accepted & Account Active!' : 'Team Member Invitation'}
                                </div>
                                <div className="text-[11.5px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed font-medium">
                                    Your invitation has been accepted. Sign in with your credentials below to access your team workspace.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Alert */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-md text-xs font-medium text-red-600 dark:text-red-400 text-center">
                            {errors.general}
                        </div>
                    )}

                    <LoginFormFields
                        email={formData.email}
                        password={formData.password}
                        errors={errors}
                        isLoading={isLoading}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                    />

                    <LoginSocialAndDemoSection
                        onSelectDemo={(email, password) => {
                            setFormData({ email, password });
                            setErrors({});
                        }}
                    />
                </div>
            </div>

            <TwoFactorModal
                isOpen={is2FAModalOpen}
                onClose={() => setIs2FAModalOpen(false)}
                onSuccess={() => {
                    if (pendingLoginRes) {
                        completeLoginRedirect(pendingLoginRes);
                    }
                }}
            />
        </div>
    );
}
