import React from 'react';
import Input from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CompleteProfileLocationFields from './CompleteProfileLocationFields';
import { OptionItem, ProfileFormData } from '../types/completeProfile.types';

interface CompleteProfileFormProps {
    formData: ProfileFormData;
    errors: Record<string, string>;
    isLoading: boolean;
    countriesList: OptionItem[];
    statesList: OptionItem[];
    citiesList: OptionItem[];
    zipCodesList: OptionItem[];
    onSubmit: (e: React.FormEvent) => void;
    onInputChange: (field: string, val: string) => void;
    onCountryChange: (val: string) => void;
    onStateChange: (val: string) => void;
    onCityChange: (val: string, item?: OptionItem) => void;
    onLogout: () => void;
}

export function CompleteProfileForm({
    formData,
    errors,
    isLoading,
    countriesList,
    statesList,
    citiesList,
    zipCodesList,
    onSubmit,
    onInputChange,
    onCountryChange,
    onStateChange,
    onCityChange,
    onLogout,
}: CompleteProfileFormProps) {
    const isFormValid = Boolean(
        formData.companyName?.trim() &&
        formData.phone?.trim() &&
        formData.country?.trim() &&
        formData.city?.trim() &&
        formData.zipCode?.trim()
    );

    return (
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-center">
            <div className="mb-6">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Complete Your Supplier Profile
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                    Please provide your business location and contact information to complete your account setup.
                </p>
            </div>

            <form
                onSubmit={onSubmit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                    }
                }}
                className="space-y-4"
            >
                <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="companyName"
                        type="text"
                        className="bg-white"
                        placeholder="Enter Company Name"
                        value={formData.companyName}
                        onChange={(e) => onInputChange('companyName', e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                document.getElementById('phone')?.focus();
                            }
                        }}
                        error={errors.companyName}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        country={formData.country}
                        onChange={(e) => onInputChange('phone', e.target.value)}
                        onCountryChange={(c) => {
                            if (c?.name && formData.country !== c.name) {
                                onCountryChange(c.name);
                            }
                        }}
                        placeholder="1711-234567"
                        error={errors.phone}
                    />
                </div>

                <CompleteProfileLocationFields
                    formData={formData}
                    errors={errors}
                    countriesList={countriesList}
                    statesList={statesList}
                    citiesList={citiesList}
                    zipCodesList={zipCodesList}
                    onInputChange={onInputChange}
                    onCountryChange={onCountryChange}
                    onStateChange={onStateChange}
                    onCityChange={onCityChange}
                />

                <Button
                    id="submit-btn"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!isFormValid || isLoading}
                    fullWidth={true}
                    className={cn("mt-6 transition-opacity", !isFormValid && "opacity-50 cursor-not-allowed")}
                >
                    Complete Setup
                </Button>

                <p className="mt-4 text-center text-xs text-gray-500 dark:text-slate-400">
                    Want to sign in with a different account?{' '}
                    <button
                        type="button"
                        onClick={onLogout}
                        className="font-semibold text-[#FF4A1F] hover:underline cursor-pointer"
                    >
                        Log Out
                    </button>
                </p>
            </form>
        </div>
    );
}
export default CompleteProfileForm;
