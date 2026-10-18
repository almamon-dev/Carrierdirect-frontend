import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSupplierRegisterForm } from '../hooks/useSupplierRegisterForm';
import { SupplierRegisterLeftBanner } from '../components/SupplierRegisterLeftBanner';
import { SupplierRegisterStep1Fields } from '../components/SupplierRegisterStep1Fields';
import { SupplierRegisterStep2Fields } from '../components/SupplierRegisterStep2Fields';

export default function SupplierRegisterPage() {
    const {
        step,
        setStep,
        agreed,
        handleAgreedChange,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        isLoading,
        isStep1Loading,
        formData,
        errors,
        handleInputChange,
        handleContinue,
        handleSubmit,
        isOtherInsurance,
        customInsuranceInputRef,
        insuranceOptions,
        navigate
    } = useSupplierRegisterForm();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0e1117] relative p-4">
            <div className="absolute top-6 left-6">
                <button
                    onClick={() => (step === 2 ? setStep(1) : navigate('/web/register'))}
                    className="flex items-center text-sm font-medium text-[#FF4A1F] hover:text-[#D13915] transition-colors focus:outline-none"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {step === 2 ? 'Back to Account Details' : 'Back to Account Type'}
                </button>
            </div>

            <div className="main-auth-card flex flex-col md:flex-row w-full max-w-5xl bg-white dark:bg-[#181a20] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden min-h-[700px]">
                <SupplierRegisterLeftBanner />

                <div className="w-full md:w-8/12 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#181a20]">
                    <div className="mb-8">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {step === 1 ? 'Create your account' : 'Compliance & Verification'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                            {step === 1
                                ? 'It only takes a minute to get started.'
                                : 'Please provide your insurance and licensing details.'}
                        </p>
                    </div>

                    {step === 1 ? (
                        <SupplierRegisterStep1Fields
                            formData={formData}
                            errors={errors}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            showConfirmPassword={showConfirmPassword}
                            setShowConfirmPassword={setShowConfirmPassword}
                            isStep1Loading={isStep1Loading}
                            onInputChange={handleInputChange}
                            onContinue={handleContinue}
                        />
                    ) : (
                        <SupplierRegisterStep2Fields
                            formData={formData}
                            errors={errors}
                            agreed={agreed}
                            isOtherInsurance={isOtherInsurance}
                            isLoading={isLoading}
                            customInsuranceInputRef={customInsuranceInputRef}
                            insuranceOptions={insuranceOptions}
                            onInputChange={handleInputChange}
                            onAgreedChange={handleAgreedChange}
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
