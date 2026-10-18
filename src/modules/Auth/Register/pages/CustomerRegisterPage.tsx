import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CustomerRegisterLeftBanner } from '../components/CustomerRegisterLeftBanner';
import { CustomerRegisterFormFields } from '../components/CustomerRegisterFormFields';
import { CustomerRegisterSocialFooter } from '../components/CustomerRegisterSocialFooter';
import { useCustomerRegisterForm } from '../hooks/useCustomerRegisterForm';

export default function CustomerRegisterPage() {
    const {
        formData,
        agreed,
        errors,
        isLoading,
        handleInputChange,
        handleAgreedChange,
        handleSubmit,
    } = useCustomerRegisterForm();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative p-4">
            {/* Top Left Back Button */}
            <div className="absolute top-6 left-6">
                <Link to="/web/register" className="flex items-center text-sm font-medium text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Account Type
                </Link>
            </div>

            {/* The Main Centered Card */}
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[700px]">
                <CustomerRegisterLeftBanner />

                {/* Right Side - Form */}
                <div className="w-full md:w-8/12 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
                        <p className="mt-2 text-sm text-gray-500">It only takes a minute to get started.</p>
                    </div>

                    <CustomerRegisterFormFields
                        formData={formData}
                        agreed={agreed}
                        errors={errors}
                        isLoading={isLoading}
                        onInputChange={handleInputChange}
                        onAgreedChange={handleAgreedChange}
                        onSubmit={handleSubmit}
                    />

                    <CustomerRegisterSocialFooter />
                </div>
            </div>
        </div>
    );
}
