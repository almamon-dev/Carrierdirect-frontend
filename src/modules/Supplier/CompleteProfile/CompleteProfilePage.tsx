import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileCompletionModal from './components/ProfileCompletionModal';
import { CompleteProfileLeftPanel } from './components/CompleteProfileLeftPanel';
import { CompleteProfileForm } from './components/CompleteProfileForm';
import { useCompleteProfileState } from './hooks/useCompleteProfileState';

export default function SupplierCompleteProfilePage() {
    const navigate = useNavigate();
    const {
        formData,
        errors,
        isLoading,
        isSuccessModalOpen,
        setIsSuccessModalOpen,
        countriesList,
        statesList,
        citiesList,
        zipCodesList,
        currentUser,
        handleLogout,
        handleInputChange,
        handleCountryChange,
        handleStateChange,
        handleCityChange,
        handleSubmit,
    } = useCompleteProfileState();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0e1117] relative p-4 font-sans antialiased">
            {/* Top Right Logout Button */}
            <div className="absolute top-6 right-6 z-20">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 bg-white dark:bg-[#181a20] hover:bg-red-50 dark:hover:bg-red-950/40 border border-gray-200 dark:border-[#384150] hover:border-red-200 dark:border-red-800 rounded-[4px] shadow-2xs transition-all cursor-pointer"
                    title="Log out from your account"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                </button>
            </div>

            {/* Main Centered Card matching SupplierRegisterPage */}
            <div className="main-auth-card flex flex-col md:flex-row w-full max-w-5xl bg-white dark:bg-[#181a20] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-200 dark:border-[#384150] overflow-hidden min-h-[600px]">
                <CompleteProfileLeftPanel />

                <CompleteProfileForm
                    formData={formData}
                    errors={errors}
                    isLoading={isLoading}
                    countriesList={countriesList}
                    statesList={statesList}
                    citiesList={citiesList}
                    zipCodesList={zipCodesList}
                    onSubmit={handleSubmit}
                    onInputChange={handleInputChange}
                    onCountryChange={handleCountryChange}
                    onStateChange={handleStateChange}
                    onCityChange={handleCityChange}
                    onLogout={handleLogout}
                />
            </div>

            {/* Congratulations & Onboarding Success Modal */}
            <ProfileCompletionModal
                isOpen={isSuccessModalOpen}
                onClose={() => navigate('/supplier/dashboard')}
                onGoToDashboard={() => navigate('/supplier/dashboard')}
                onGoToQuotes={() => navigate('/supplier/quotes/requests')}
                companyName={formData.companyName || currentUser.name}
            />
        </div>
    );
}
