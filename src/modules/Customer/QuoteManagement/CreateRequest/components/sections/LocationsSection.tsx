import React from "react";
import { MapPin } from "lucide-react";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import PhoneInput from "@/components/ui/phone-input";
import TabHeader from "@/components/ui/tab-header";
import { GooglePlacesAutocompleteInput, LocationData } from "@/components/GooglePlacesAutocompleteInput";
import { QuoteFormData } from "../../types/formTypes";
import { FormRow } from "../FormHelpers";

interface SectionProps {
    formData: QuoteFormData;
    handleChange: (e: any) => void;
    onLocationSelect?: (prefix: "pickup" | "delivery", data: LocationData) => void;
}

export const LocationsSection: React.FC<SectionProps> = ({
    formData,
    handleChange,
    onLocationSelect,
}) => {
    const handleLocationSelectInternal = (prefix: "pickup" | "delivery", data: LocationData) => {
        if (onLocationSelect) {
            onLocationSelect(prefix, data);
            return;
        }

        // Fallback: fire synthetic events if onLocationSelect prop is not passed directly
        if (data.address) handleChange({ target: { name: `${prefix}Address`, value: data.address } } as any);
        if (data.lat !== undefined && data.lat !== null) handleChange({ target: { name: `${prefix}Lat`, value: data.lat } } as any);
        if (data.lng !== undefined && data.lng !== null) handleChange({ target: { name: `${prefix}Lng`, value: data.lng } } as any);
        if (data.city) handleChange({ target: { name: `${prefix}City`, value: data.city } } as any);
        if (data.state) handleChange({ target: { name: `${prefix}State`, value: data.state } } as any);
        if (data.country) handleChange({ target: { name: `${prefix}Country`, value: data.country } } as any);
        if (data.zip) handleChange({ target: { name: `${prefix}Zip`, value: data.zip } } as any);
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                <TabHeader title="Location Information" icon={MapPin} />

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
                        <FormRow label="Contact Person" required>
                            <Input name="pickupContactName" value={formData.pickupContactName} onChange={handleChange} placeholder="Contact person name" />
                        </FormRow>
                        <FormRow label="Phone Number" required>
                            <PhoneInput name="pickupPhone" value={formData.pickupPhone} onChange={handleChange} placeholder="Phone number" />
                        </FormRow>
                        <FormRow label="Email">
                            <Input name="pickupEmail" value={formData.pickupEmail} onChange={handleChange} type="email" placeholder="name@company.com" />
                        </FormRow>
                        <FormRow label="Country">
                            <Input name="pickupCountry" value={formData.pickupCountry} onChange={handleChange} placeholder="Country" />
                        </FormRow>
                        <FormRow label="State/Division">
                            <Input name="pickupState" value={formData.pickupState} onChange={handleChange} placeholder="State / Division" />
                        </FormRow>
                        <FormRow label="City">
                            <Input name="pickupCity" value={formData.pickupCity} onChange={handleChange} placeholder="City" />
                        </FormRow>
                        <FormRow label="ZIP Code">
                            <Input name="pickupZip" value={formData.pickupZip} onChange={handleChange} placeholder="ZIP / Postal code" />
                        </FormRow>
                        <FormRow label="Full Address" required colSpan>
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
                        <FormRow label="Contact Person" required>
                            <Input name="deliveryContactName" value={formData.deliveryContactName} onChange={handleChange} placeholder="Contact person name" />
                        </FormRow>
                        <FormRow label="Phone Number" required>
                            <PhoneInput name="deliveryPhone" value={formData.deliveryPhone} onChange={handleChange} placeholder="Phone number" />
                        </FormRow>
                        <FormRow label="Email">
                            <Input name="deliveryEmail" value={formData.deliveryEmail} onChange={handleChange} type="email" placeholder="name@company.com" />
                        </FormRow>
                        <FormRow label="Country">
                            <Input name="deliveryCountry" value={formData.deliveryCountry} onChange={handleChange} placeholder="Country" />
                        </FormRow>
                        <FormRow label="State/Division">
                            <Input name="deliveryState" value={formData.deliveryState} onChange={handleChange} placeholder="State / Division" />
                        </FormRow>
                        <FormRow label="City">
                            <Input name="deliveryCity" value={formData.deliveryCity} onChange={handleChange} placeholder="City" />
                        </FormRow>
                        <FormRow label="ZIP Code">
                            <Input name="deliveryZip" value={formData.deliveryZip} onChange={handleChange} placeholder="ZIP / Postal code" />
                        </FormRow>
                        <FormRow label="Full Address" required colSpan>
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
