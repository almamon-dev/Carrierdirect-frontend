import React from 'react';
import { MapPin } from 'lucide-react';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import PhoneInput from '@/components/ui/phone-input';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';
import { FormRow } from '../FormHelpers';

interface SectionProps {
    formData: QuoteFormData;
    handleChange: (e: any) => void;
}

export const LocationsSection: React.FC<SectionProps> = ({ formData, handleChange }) => {
    return (
        <div className="space-y-2.5 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                <TabHeader title="Location Information" icon={MapPin} />
                
                {/* Pickup Info */}
                <div className="col-span-1 md:col-span-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-1">
                    <h3 className="text-xs font-bold text-[#ff4a1f] uppercase tracking-wider mb-2 flex items-center gap-1.5 select-none">
                        <MapPin size={14}/> Pickup Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                        <FormRow label="Company Name"><Input name="pickupCompany" value={formData.pickupCompany} onChange={handleChange} placeholder="Pickup Company Name" /></FormRow>
                        <FormRow label="Contact Person" required><Input name="pickupContactName" value={formData.pickupContactName} onChange={handleChange} placeholder="Contact Person Name" /></FormRow>
                        <FormRow label="Phone Number" required><PhoneInput name="pickupPhone" value={formData.pickupPhone} onChange={handleChange} placeholder="1711-234567" /></FormRow>
                        <FormRow label="Email"><Input name="pickupEmail" value={formData.pickupEmail} onChange={handleChange} type="email" placeholder="Email Address" /></FormRow>
                        <FormRow label="Country"><Input name="pickupCountry" value={formData.pickupCountry} onChange={handleChange} /></FormRow>
                        <FormRow label="State/Division"><Input name="pickupState" value={formData.pickupState} onChange={handleChange} placeholder="State / Division" /></FormRow>
                        <FormRow label="City"><Input name="pickupCity" value={formData.pickupCity} onChange={handleChange} placeholder="City" /></FormRow>
                        <FormRow label="ZIP Code"><Input name="pickupZip" value={formData.pickupZip} onChange={handleChange} placeholder="ZIP Code" /></FormRow>
                        <FormRow label="Full Address" required colSpan><Textarea name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} placeholder="Detailed street address..." rows={2}/></FormRow>
                        <FormRow label="Google Map URL" colSpan><Input name="pickupMapUrl" value={formData.pickupMapUrl} onChange={handleChange} placeholder="Map Link URL" /></FormRow>
                        <FormRow label="Instructions" colSpan><Textarea name="pickupInstructions" value={formData.pickupInstructions} onChange={handleChange} placeholder="Special pickup instructions..." rows={2}/></FormRow>
                    </div>
                </div>
                
                {/* Delivery Info */}
                <div className="col-span-1 md:col-span-2 pt-1">
                    <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 select-none">
                        <MapPin size={14}/> Delivery Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                        <FormRow label="Company Name"><Input name="deliveryCompany" value={formData.deliveryCompany} onChange={handleChange} placeholder="Delivery Company Name" /></FormRow>
                        <FormRow label="Contact Person" required><Input name="deliveryContactName" value={formData.deliveryContactName} onChange={handleChange} placeholder="Contact Person Name" /></FormRow>
                        <FormRow label="Phone Number" required><PhoneInput name="deliveryPhone" value={formData.deliveryPhone} onChange={handleChange} placeholder="1819-987654" /></FormRow>
                        <FormRow label="Email"><Input name="deliveryEmail" value={formData.deliveryEmail} onChange={handleChange} type="email" placeholder="Email Address" /></FormRow>
                        <FormRow label="Country"><Input name="deliveryCountry" value={formData.deliveryCountry} onChange={handleChange} /></FormRow>
                        <FormRow label="State/Division"><Input name="deliveryState" value={formData.deliveryState} onChange={handleChange} placeholder="State / Division" /></FormRow>
                        <FormRow label="City"><Input name="deliveryCity" value={formData.deliveryCity} onChange={handleChange} placeholder="City" /></FormRow>
                        <FormRow label="ZIP Code"><Input name="deliveryZip" value={formData.deliveryZip} onChange={handleChange} placeholder="ZIP Code" /></FormRow>
                        <FormRow label="Full Address" required colSpan><Textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} placeholder="Detailed street address..." rows={2}/></FormRow>
                        <FormRow label="Google Map URL" colSpan><Input name="deliveryMapUrl" value={formData.deliveryMapUrl} onChange={handleChange} placeholder="Map Link URL" /></FormRow>
                        <FormRow label="Instructions" colSpan><Textarea name="deliveryInstructions" value={formData.deliveryInstructions} onChange={handleChange} placeholder="Special delivery instructions..." rows={2}/></FormRow>
                    </div>
                </div>
            </div>
        </div>
    );
};
