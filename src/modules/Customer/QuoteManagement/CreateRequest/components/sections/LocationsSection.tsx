import React from 'react';
import { MapPin, Navigation, Plane } from 'lucide-react';
import Input from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import Textarea from '@/components/ui/textarea';
import GooglePlacesAutocompleteInput from '@/components/GooglePlacesAutocompleteInput';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';
import { FormRow } from '../FormHelpers';
import { resolveQuoteDistance } from '@/utils/geoDistance';

interface SectionProps {
    formData: QuoteFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleLocationSelect?: (prefix: 'pickup' | 'delivery', locationData: any) => void;
    onLocationSelect?: (prefix: 'pickup' | 'delivery', locationData: any) => void;
    getFieldError?: (field: string) => string | undefined;
    markTouched?: (field: string) => void;
}

export const LocationsSection: React.FC<SectionProps> = ({
    formData,
    handleChange,
    handleLocationSelect,
    onLocationSelect,
    getFieldError = () => undefined,
    markTouched = () => {},
}) => {
    const distInfo = resolveQuoteDistance(formData);
    const hasDistance = distInfo.distanceStr && distInfo.distanceStr !== '—';

    const locationHandler = handleLocationSelect || onLocationSelect;

    const handleLocationSelectInternal = (prefix: 'pickup' | 'delivery', data: any) => {
        if (locationHandler) {
            locationHandler(prefix, data);
        }
        if (data.company) handleChange({ target: { name: `${prefix}Company`, value: data.company } } as any);
        if (data.city) handleChange({ target: { name: `${prefix}City`, value: data.city } } as any);
        if (data.state) handleChange({ target: { name: `${prefix}State`, value: data.state } } as any);
        if (data.country) handleChange({ target: { name: `${prefix}Country`, value: data.country } } as any);
        if (data.zip) handleChange({ target: { name: `${prefix}Zip`, value: data.zip } } as any);
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                <div className="col-span-1 md:col-span-2 flex items-center justify-between">
                    <TabHeader title="Location Information" icon={MapPin} />
                    {hasDistance && (
                        <div
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-semibold border ${
                                distInfo.isAirDistance
                                    ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/60"
                                    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60"
                            }`}
                        >
                            {distInfo.isAirDistance ? <Plane size={13} className="text-sky-500" /> : <Navigation size={13} className="text-[#ff4a1f]" />}
                            <span>Estimated Distance: {distInfo.distanceStr}</span>
                        </div>
                    )}
                </div>

                {/* Pickup Info */}
                <div className="col-span-1 md:col-span-2 border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-2">
                    <div className="mb-2">
                        <h3 className="text-xs font-bold text-[#ff4a1f] tracking-wider flex items-center gap-1.5 select-none">
                            <MapPin size={14} /> Pickup Details
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2.5">
                        <FormRow label="Company Name">
                            <Input name="pickupCompany" value={formData.pickupCompany} onChange={handleChange} placeholder="Company name" />
                        </FormRow>
                        <FormRow label="Contact Person" required error={getFieldError('pickupContactName')}>
                            <Input
                                name="pickupContactName"
                                value={formData.pickupContactName}
                                onChange={handleChange}
                                onBlur={() => markTouched('pickupContactName')}
                                error={getFieldError('pickupContactName')}
                                placeholder="Contact person name"
                            />
                        </FormRow>
                        <FormRow label="Phone Number" required error={getFieldError('pickupPhone')}>
                            <PhoneInput
                                name="pickupPhone"
                                value={formData.pickupPhone}
                                country={formData.pickupCountry}
                                onChange={handleChange}
                                onCountryChange={(c) => {
                                    if (c?.name && (!formData.pickupCountry || formData.pickupCountry === 'Bangladesh' || formData.pickupCountry === '')) {
                                        handleChange({ target: { name: 'pickupCountry', value: c.name } } as any);
                                    }
                                }}
                                placeholder="Phone number"
                            />
                        </FormRow>
                        <FormRow label="Email">
                            <Input name="pickupEmail" value={formData.pickupEmail} onChange={handleChange} type="email" placeholder="name@company.com" />
                        </FormRow>
                        <FormRow label="Country" required error={getFieldError('pickupCountry')}>
                            <Input
                                name="pickupCountry"
                                value={formData.pickupCountry}
                                onChange={handleChange}
                                onBlur={() => markTouched('pickupCountry')}
                                error={getFieldError('pickupCountry')}
                                placeholder="Country"
                            />
                        </FormRow>
                        <FormRow label="State/Division">
                            <Input name="pickupState" value={formData.pickupState} onChange={handleChange} placeholder="State / Division" />
                        </FormRow>
                        <FormRow label="City" required error={getFieldError('pickupCity')}>
                            <Input
                                name="pickupCity"
                                value={formData.pickupCity}
                                onChange={handleChange}
                                onBlur={() => markTouched('pickupCity')}
                                error={getFieldError('pickupCity')}
                                placeholder="City"
                            />
                        </FormRow>
                        <FormRow label="ZIP Code">
                            <Input name="pickupZip" value={formData.pickupZip} onChange={handleChange} placeholder="ZIP / Postal code" />
                        </FormRow>
                        <FormRow label="Full Address" required colSpan error={getFieldError('pickupAddress')}>
                            <GooglePlacesAutocompleteInput
                                name="pickupAddress"
                                value={formData.pickupAddress}
                                onChange={handleChange}
                                onLocationSelect={(data) => handleLocationSelectInternal("pickup", data)}
                                placeholder="Enter pickup address or search place..."
                                lat={formData.pickupLat}
                                lng={formData.pickupLng}
                            />
                        </FormRow>
                        <FormRow label="Instructions" colSpan>
                            <Textarea name="pickupInstructions" value={formData.pickupInstructions} onChange={handleChange} placeholder="Special pickup instructions or gate notes..." rows={2} />
                        </FormRow>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="col-span-1 md:col-span-2 pt-1">
                    <div className="mb-2">
                        <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1.5 select-none">
                            <MapPin size={14} /> Delivery Details
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2.5">
                        <FormRow label="Company Name">
                            <Input name="deliveryCompany" value={formData.deliveryCompany} onChange={handleChange} placeholder="Company name" />
                        </FormRow>
                        <FormRow label="Contact Person" required error={getFieldError('deliveryContactName')}>
                            <Input
                                name="deliveryContactName"
                                value={formData.deliveryContactName}
                                onChange={handleChange}
                                onBlur={() => markTouched('deliveryContactName')}
                                error={getFieldError('deliveryContactName')}
                                placeholder="Contact person name"
                            />
                        </FormRow>
                        <FormRow label="Phone Number" required error={getFieldError('deliveryPhone')}>
                            <PhoneInput
                                name="deliveryPhone"
                                value={formData.deliveryPhone}
                                country={formData.deliveryCountry}
                                onChange={handleChange}
                                onCountryChange={(c) => {
                                    if (c?.name && (!formData.deliveryCountry || formData.deliveryCountry === 'Bangladesh' || formData.deliveryCountry === '')) {
                                        handleChange({ target: { name: 'deliveryCountry', value: c.name } } as any);
                                    }
                                }}
                                placeholder="Phone number"
                            />
                        </FormRow>
                        <FormRow label="Email">
                            <Input name="deliveryEmail" value={formData.deliveryEmail} onChange={handleChange} type="email" placeholder="name@company.com" />
                        </FormRow>
                        <FormRow label="Country" required error={getFieldError('deliveryCountry')}>
                            <Input
                                name="deliveryCountry"
                                value={formData.deliveryCountry}
                                onChange={handleChange}
                                onBlur={() => markTouched('deliveryCountry')}
                                error={getFieldError('deliveryCountry')}
                                placeholder="Country"
                            />
                        </FormRow>
                        <FormRow label="State/Division">
                            <Input name="deliveryState" value={formData.deliveryState} onChange={handleChange} placeholder="State / Division" />
                        </FormRow>
                        <FormRow label="City" required error={getFieldError('deliveryCity')}>
                            <Input
                                name="deliveryCity"
                                value={formData.deliveryCity}
                                onChange={handleChange}
                                onBlur={() => markTouched('deliveryCity')}
                                error={getFieldError('deliveryCity')}
                                placeholder="City"
                            />
                        </FormRow>
                        <FormRow label="ZIP Code">
                            <Input name="deliveryZip" value={formData.deliveryZip} onChange={handleChange} placeholder="ZIP / Postal code" />
                        </FormRow>
                        <FormRow label="Full Address" required colSpan error={getFieldError('deliveryAddress')}>
                            <GooglePlacesAutocompleteInput
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleChange}
                                onLocationSelect={(data) => handleLocationSelectInternal("delivery", data)}
                                placeholder="Enter delivery address or search place..."
                                lat={formData.deliveryLat}
                                lng={formData.deliveryLng}
                            />
                        </FormRow>
                        <FormRow label="Instructions" colSpan>
                            <Textarea name="deliveryInstructions" value={formData.deliveryInstructions} onChange={handleChange} placeholder="Special delivery instructions or dock notes..." rows={2} />
                        </FormRow>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationsSection;
