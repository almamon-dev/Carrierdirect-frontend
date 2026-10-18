import React from 'react';
import Input from '@/components/ui/input';
import AutocompleteInput from './AutocompleteInput';
import { OptionItem, ProfileFormData } from '../types/completeProfile.types';
import { generateAutoAddress } from '../utils/completeProfileUtils';

interface CompleteProfileLocationFieldsProps {
    formData: ProfileFormData;
    errors: Record<string, string>;
    countriesList: OptionItem[];
    statesList: OptionItem[];
    citiesList: OptionItem[];
    zipCodesList: OptionItem[];
    onInputChange: (field: string, val: string) => void;
    onCountryChange: (val: string) => void;
    onStateChange: (val: string) => void;
    onCityChange: (val: string, item?: OptionItem) => void;
}

export function CompleteProfileLocationFields({
    formData,
    errors,
    countriesList,
    statesList,
    citiesList,
    zipCodesList,
    onInputChange,
    onCountryChange,
    onStateChange,
    onCityChange,
}: CompleteProfileLocationFieldsProps) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        Country <span className="text-red-500">*</span>
                    </label>
                    <AutocompleteInput
                        id="country"
                        nextFieldId="state"
                        value={formData.country}
                        onChange={onCountryChange}
                        onSelect={(val) => onCountryChange(val)}
                        options={countriesList}
                        placeholder="Enter Country"
                        error={errors.country}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        State / Division
                    </label>
                    <AutocompleteInput
                        id="state"
                        nextFieldId="city"
                        value={formData.state}
                        onChange={onStateChange}
                        onSelect={(val) => onStateChange(val)}
                        options={statesList}
                        placeholder={!formData.country.trim() ? "Enter Country first" : "Enter State"}
                        disabled={!formData.country.trim()}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                    </label>
                    <AutocompleteInput
                        id="city"
                        nextFieldId="zipCode"
                        value={formData.city}
                        onChange={(val) => onCityChange(val)}
                        onSelect={(val, item) => onCityChange(val, item)}
                        options={citiesList}
                        placeholder={
                            !formData.country.trim()
                                ? "Enter Country first"
                                : (!formData.state.trim() ? "Enter State first" : "Enter City")
                        }
                        disabled={!formData.country.trim() || !formData.state.trim()}
                        error={errors.city}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        Zip / Postal Code <span className="text-red-500">*</span>
                    </label>
                    <AutocompleteInput
                        id="zipCode"
                        nextFieldId="address"
                        value={formData.zipCode}
                        onChange={(val) => onInputChange('zipCode', val)}
                        onSelect={(val) => onInputChange('zipCode', val)}
                        options={zipCodesList}
                        placeholder={!formData.city.trim() ? "Enter City first" : "Enter Zip Code"}
                        disabled={!formData.city.trim()}
                        error={errors.zipCode}
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-[13px] font-bold text-gray-700 mb-1">
                        Full Business Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="address"
                        type="text"
                        className="bg-slate-100 text-slate-700 font-semibold cursor-not-allowed border-slate-200"
                        placeholder={!formData.city.trim() ? "Enter City first" : "Auto-generated Address"}
                        value={generateAutoAddress(formData.city, formData.state, formData.country, formData.zipCode)}
                        readOnly={true}
                        error={errors.address}
                    />
                </div>
            </div>
        </>
    );
}
export default CompleteProfileLocationFields;
