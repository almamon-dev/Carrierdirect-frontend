import React from 'react';
import { Building2, Hash } from 'lucide-react';
import Input from '../../../../components/ui/input';
import Select from '../../../../components/ui/select';
import Button from '../../../../components/ui/button';
import { SupplierFormData, isPolicyDateValid } from '../hooks/supplierRegisterUtils';
import { SupplierRegisterDocumentUploads } from './SupplierRegisterDocumentUploads';

interface SupplierRegisterStep2FieldsProps {
    formData: SupplierFormData;
    errors: Record<string, string>;
    agreed: boolean;
    isOtherInsurance: boolean;
    isLoading: boolean;
    customInsuranceInputRef: React.RefObject<HTMLInputElement | null>;
    insuranceOptions: { id: string | number; name: string }[];
    onInputChange: (field: string, value: string | File) => void;
    onAgreedChange: (checked: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const SupplierRegisterStep2Fields: React.FC<SupplierRegisterStep2FieldsProps> = ({
    formData,
    errors,
    agreed,
    isOtherInsurance,
    isLoading,
    customInsuranceInputRef,
    insuranceOptions,
    onInputChange,
    onAgreedChange,
    onSubmit
}) => {
    const isStep2Disabled =
        !formData.insuranceType ||
        (isOtherInsurance && !formData.customInsuranceType.trim()) ||
        !formData.insuranceProviderName.trim() ||
        !formData.policyNumber.trim() ||
        !formData.policyExpiryDate ||
        !isPolicyDateValid(formData.policyExpiryDate) ||
        !formData.insuranceDocument ||
        !agreed;

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Insurance Type <span className="text-red-500">*</span>
                </label>
                <Select
                    value={formData.insuranceType}
                    onChange={(e) => onInputChange('insuranceType', e.target.value)}
                    options={insuranceOptions}
                    placeholder="Select a type"
                    className="h-[42px] [&>div>button]:h-[42px]"
                    error={errors.insuranceType}
                />
                {errors.insuranceType && (
                    <span className="text-[12px] text-[#d82c0d] mt-1 block">{errors.insuranceType}</span>
                )}
            </div>

            {isOtherInsurance && (
                <div>
                    <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                        Specify Insurance Type <span className="text-red-500">*</span>
                    </label>
                    <Input
                        ref={customInsuranceInputRef}
                        autoFocus
                        type="text"
                        className="bg-white"
                        placeholder="Enter your custom insurance type"
                        value={formData.customInsuranceType}
                        onChange={(e) => onInputChange('customInsuranceType', e.target.value)}
                        error={errors.customInsuranceType}
                    />
                    {errors.customInsuranceType && (
                        <span className="text-[12px] text-[#d82c0d] mt-1 block">{errors.customInsuranceType}</span>
                    )}
                </div>
            )}

            <div>
                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Insurance Provider Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Input
                        type="text"
                        className="bg-white pr-10"
                        placeholder="Enter provider name"
                        value={formData.insuranceProviderName}
                        onChange={(e) => onInputChange('insuranceProviderName', e.target.value)}
                        error={errors.insuranceProviderName}
                    />
                    <div className="absolute top-0 right-0 h-[42px] pr-3 flex items-center pointer-events-none z-0">
                        <Building2 className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Policy Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Input
                        type="text"
                        className="bg-white pr-10"
                        placeholder="Enter policy number"
                        value={formData.policyNumber}
                        onChange={(e) => onInputChange('policyNumber', e.target.value)}
                        error={errors.policyNumber}
                    />
                    <div className="absolute top-0 right-0 h-[42px] pr-3 flex items-center pointer-events-none z-0">
                        <Hash className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Policy Expiry Date <span className="text-red-500">*</span>
                </label>
                <Input
                    type="date"
                    className="bg-white pr-3"
                    placeholder="mm/dd/yyyy"
                    value={formData.policyExpiryDate}
                    onChange={(e) => onInputChange('policyExpiryDate', e.target.value)}
                    error={errors.policyExpiryDate}
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <SupplierRegisterDocumentUploads
                insuranceDocument={formData.insuranceDocument}
                licenses={formData.licenses}
                insuranceDocumentError={errors.insuranceDocument}
                licensesError={errors.licenses}
                onFileChange={(field, file) => onInputChange(field, file)}
            />

            <div className="flex flex-col pt-4 pb-2">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => onAgreedChange(e.target.checked)}
                            className={`w-4 h-4 rounded cursor-pointer accent-[#FF4A1F] focus:ring-[#FF4A1F] ${
                                errors.agreed ? 'border-[#d82c0d] text-[#d82c0d]' : 'border-gray-300 dark:border-slate-600 text-[#FF4A1F]'
                            }`}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700 dark:text-slate-300">
                            I agree to the{' '}
                            <a href="#" className="text-[#FF4A1F] hover:underline font-semibold">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-[#FF4A1F] hover:underline font-semibold">
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                </div>
                {errors.agreed && <span className="text-[12px] text-[#d82c0d] mt-1 ml-7">{errors.agreed}</span>}
            </div>

            <Button type="submit" disabled={isStep2Disabled} isLoading={isLoading} fullWidth={true}>
                Create Account
            </Button>
        </form>
    );
};
